import { useState, useEffect } from "react";
import { BrowserProvider, ethers } from "ethers";
import EthereumProvider from "@walletconnect/ethereum-provider";

export function useWallet() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [address, setAddress] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  async function connectWallet() {
    let _provider;
    console.log("Connection Start");
    if (window.ethereum) {
      // MetaMask or injected provid
      console.log("window.ethereum");
      _provider = new BrowserProvider(window.ethereum);
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
      } catch (err) {
        console.log(err);
      }
    } else {
      console.log("Not window.ethereum");
      // WalletConnect fallback
      const wcProvider = await EthereumProvider.init({
        projectId: "0afc422585c9b7c7ce9ef5418cb641fa", // replace
        chains: [56], // BSC Mainnet
        showQrModal: true, // QR for desktop, deep link for mobile
      });
      await wcProvider.enable();
      _provider = new BrowserProvider(wcProvider);
    }
    console.log("Got All");
    const _signer = await _provider.getSigner();
    const _address = await _signer.getAddress();
    console.log("Address : ", _address);
    setProvider(_provider);
    setSigner(_signer);
    setAddress(_address);
    setIsConnected(true);
  }

  return { provider, signer, address, isConnected, connectWallet };
}
const USDT_ADDRESS = "0x55d398326f99059fF775485246999027B3197955"; // BSC USDT
const ERC20_ABI = [
  "function transfer(address to, uint256 amount) returns (bool)",
  "function decimals() view returns (uint8)",
];

export async function sendUSDT(signer, to, amountStr) {
  if (!signer) throw new Error("Wallet not connected");
  const usdt = new ethers.Contract(USDT_ADDRESS, ERC20_ABI, signer);

  const decimals = await usdt.decimals();
  const amount = ethers.parseUnits(amountStr, decimals);

  const tx = await usdt["transfer"](to, amount);
  await tx.wait();

  return tx.hash;
}
