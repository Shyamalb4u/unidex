import { BrowserProvider, ethers } from "ethers";
import EthereumProvider from "@walletconnect/ethereum-provider";
import { create } from "zustand";

const USDT_ADDRESS = "0x55d398326f99059fF775485246999027B3197955"; // BSC USDT
const ERC20_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function decimals() view returns (uint8)",
];

const useWalletStore = create((set, get) => ({
  provider: null,
  signer: null,
  address: null,
  wcProvider: null,
  isConnected: false,
  bnbBalance: "0",
  usdtBalance: "0",

  connectWallet: async () => {
    let _provider,
      wcProvider = null;
    console.log("Connection Start");

    if (window.ethereum) {
      // ✅ Metamask or injected provider
      console.log("window.ethereum");
      _provider = new BrowserProvider(window.ethereum);
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
      } catch (err) {
        console.log(err);
      }
      // Listen for account changes
      window.ethereum.on("accountsChanged", async (accounts) => {
        if (accounts.length === 0) {
          get().disconnectWallet(); // user disconnected
        } else {
          // const _signer = await _provider.getSigner();
          // const _address = accounts[0];
          // set({ signer: _signer, address: _address, isConnected: true });
          // await get().fetchBalances(_address);
          get().disconnectWallet();
        }
      });

      // Listen for network changes
      window.ethereum.on("chainChanged", async () => {
        // const _signer = await _provider.getSigner();
        // const _address = await _signer.getAddress();
        // set({ signer: _signer, address: _address });
        // await get().fetchBalances(_address);
        get().disconnectWallet();
      });

      // Optional: detect disconnect
      window.ethereum.on("disconnect", () => {
        get().disconnectWallet();
      });
    } else {
      // ✅ WalletConnect fallback
      console.log("Not window.ethereum, using WalletConnect");
      wcProvider = await EthereumProvider.init({
        projectId: "0afc422585c9b7c7ce9ef5418cb641fa", // replace
        chains: [56], // BSC Mainnet
        showQrModal: true,
      });
      await wcProvider.enable();
      _provider = new BrowserProvider(wcProvider);
    }

    //console.log("Got All");
    const _signer = await _provider.getSigner();
    const _address = await _signer.getAddress();

    //console.log("Address:", _address);
    set({
      provider: _provider,
      signer: _signer,
      wcProvider,
      address: _address,
      isConnected: true,
    });
    // fetch balances right after connect
    await get().fetchBalances(_address);
  },

  disconnectWallet: async () => {
    const { wcProvider } = get();
    try {
      if (wcProvider) {
        await wcProvider.disconnect(); // 🔹 close Trust Wallet session
      }
    } catch (err) {
      console.error("WalletConnect disconnect error:", err);
    }
    set({
      provider: null,
      signer: null,
      address: null,
      wcProvider: null,
      isConnected: false,
      bnbBalance: "0",
      usdtBalance: "0",
    });
  },

  fetchBalances: async (address) => {
    const { provider } = get();
    if (!provider || !address) return;

    try {
      console.log("Fetch Balance");
      // ✅ Get BNB balance
      const rpcProvider = new ethers.JsonRpcProvider(
        "https://bsc-dataseed.binance.org/"
      );

      // ✅ BNB Balance
      const balanceWei = await rpcProvider.getBalance(address);
      const bnbBalance = ethers.formatEther(balanceWei);
      // ✅ Get USDT balance
      const usdt = new ethers.Contract(USDT_ADDRESS, ERC20_ABI, provider);
      const decimals = await usdt.decimals();
      const usdtRaw = await usdt.balanceOf(address);
      const usdtBalance = ethers.formatUnits(usdtRaw, decimals);
      console.log("Balance : ", bnbBalance);
      console.log("USDT Balance : ", usdtBalance);

      set({ bnbBalance, usdtBalance });
    } catch (err) {
      console.error("Balance fetch error:", err);
    }
  },

  sendUSDT: async (to, amountStr) => {
    const { signer } = get();
    if (!signer) throw new Error("Wallet not connected");

    const usdt = new ethers.Contract(USDT_ADDRESS, ERC20_ABI, signer);

    const decimals = await usdt.decimals();
    const amount = ethers.parseUnits(amountStr, decimals);

    const tx = await usdt.transfer(to, amount);
    await tx.wait();

    return tx.hash;
  },

  // ✅ Check transaction status
  getTxStatus: async (txHash) => {
    const { provider } = get();
    if (!provider) return { status: "no_provider" };

    try {
      const receipt = await provider.getTransactionReceipt(txHash);

      if (!receipt) {
        return "pending";
      }

      const status = receipt.status === 1 ? "success" : "failed";
      return status;
    } catch (err) {
      return "error";
    }
  },
}));
export default useWalletStore;
