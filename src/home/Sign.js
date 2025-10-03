import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useWalletStore from "../hooks/useWallet";
import FlashMessage from "../components/FlashMessage";

export default function Sign() {
  const navigate = useNavigate();
  //const newApi = process.env.REACT_APP_API_URL;
  //console.log(process.env.REACT_APP_API_URL);
  const api_link = process.env.REACT_APP_API_URL;
  const receive_address = process.env.REACT_APP_RECEIVE_ADDRESS;
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const spn = searchParams.get("s");
  const [refer, setRefer] = useState("");
  const [showRegi, setShowRegi] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState(0);

  const address = useWalletStore((state) => state.address);
  const bnbBalance = useWalletStore((state) => state.bnbBalance);
  const usdtBalance = useWalletStore((state) => state.usdtBalance);
  const fetchBalances = useWalletStore((state) => state.fetchBalances);
  const isConnected = useWalletStore((state) => state.isConnected);
  const connectWallet = useWalletStore((state) => state.connectWallet);
  const sendUSDT = useWalletStore((state) => state.sendUSDT);
  // const {
  //   connectWallet,
  //   address,
  //   isConnected,
  //   usdtBalance,
  //   bnbBalance,
  //   sendUSDT,
  //   fetchBalances,
  // } = useWalletStore();

  const [flash, setFlash] = useState("");

  // const showMessage = () => {
  //   setFlash("Wallet connected successfully!");
  // };

  useEffect(() => {
    setRefer(spn);
  }, [spn]);
  useEffect(() => {
    async function checkUser() {
      if (isConnected) {
        try {
          let url = api_link + "getUser/" + address;
          const result = await fetch(url);
          const reData = await result.json();

          if (reData.data !== "No Data") {
            navigate("/wallet");
          } else {
            setShowRegi(true);
            console.log("Not a user");
          }
        } catch (e) {
          setShowRegi(true);
          return;
        }
      } else {
        setShowRegi(false);
      }
    }
    checkUser();
  }, [address, isConnected, navigate]);

  async function onSignup() {
    setIsLoading(true);
    if (!address) {
      setFlash("Please Connect Wallet");
      setIsError(true);
      setIsLoading(false);
      return;
    }
    if (!refer) {
      setFlash("Please come back here by a refer link");
      setIsError(true);
      setIsLoading(false);
      return;
    }
    // # Check sponsor

    try {
      let url = api_link + "getUser/" + refer;
      const result = await fetch(url);
      const reData = await result.json();

      if (reData.data === "No Data") {
        setFlash("Invalid Refer Address");
        setIsError(true);
        setIsLoading(false);
        return;
      }
    } catch (e) {
      setFlash("Invalid Refer Address");
      setIsError(true);
      setIsLoading(false);
      return;
    }

    // 1. Check balance
    if (parseInt(amount) <= 0) {
      setFlash("Select Subscription Amount");
      setIsError(true);
      setIsLoading(false);
      return;
    }
    if (parseFloat(amount) > parseFloat(usdtBalance)) {
      setFlash("You have not enough balance");
      setIsError(true);
      setIsLoading(false);
      return;
    }
    if (parseFloat(bnbBalance) <= 0) {
      setFlash("BNB Required for GAS Fee");
      setIsError(true);
      setIsLoading(false);
      return;
    }
    // 2. Transfer USDT and get txn
    var txHash = "";
    try {
      txHash = await sendUSDT(receive_address, amount.toString());
    } catch (err) {
      console.error(err);
      setFlash("Transaction Error");
      setIsError(true);
      setIsLoading(false);
      return;
    }
    // 3. Then insert to database
    const signUpurl = api_link + "signup";
    const data = {
      spn: refer,
      public: address,
      amt: amount,
      txn: txHash,
    };
    const customHeaders = {
      "Content-Type": "application/json",
    };
    try {
      const result = await fetch(signUpurl, {
        method: "POST",
        headers: customHeaders,
        body: JSON.stringify(data),
      });

      if (!result.ok) {
        setIsLoading(false);
        throw new Error(`HTTP error! status: ${result.status}`);
      }
      const reData = await result.json();
      const uid = reData.data[0].uid;
      if (uid !== "Sponsor Not Exists") {
        setIsLoading(false);
        fetchBalances(address);
        navigate("/wallet");
      } else {
        setFlash("Sponsor Not Exists");
        setIsError(true);
        setIsLoading(false);
        console.log("Sponsor Not Exists");
      }
      //console.log(reData);
    } catch (error) {
      console.log("Others Error!");
      setIsLoading(false);
    }
  }
  return (
    <>
      <div className="container bg-n900 h-dvh relative overflow-hidden flex justify-start items-start text-white min-h-dvh">
        <div className="w-[582px] h-[582px] rounded-full bg-g300 absolute -top-32 -left-20 blur-[575px]"></div>

        <div className="px-6 py-8 relative z-20">
          <div className="flex justify-start items-center gap-20">
            <Link
              to="/"
              className="flex justify-center items-center p-2 rounded-full bg-g300 text-n900"
            >
              <i className="ph-bold ph-caret-left"></i>
            </Link>
            {isConnected ? (
              <span className="text-n70 text-sm">
                {String(address).slice(0, 10)}......{String(address).slice(-10)}
              </span>
            ) : (
              <button
                className="block bg-g300 font-semibold text-center py-3 rounded-lg openAgreeModal w-full"
                onClick={connectWallet}
              >
                Connect Wallet
              </button>
            )}

            {/* <div className="flex justify-start items-center">
            <button className="block bg-g300 font-semibold text-center py-3 px-3 rounded-lg">
              Connect Wallet
            </button>
          </div> */}
          </div>

          <div className="flex justify-center items-center flex-col gap-3 text- pt-8">
            <h1 className="text-2xl font-semibold">Registation / Signin</h1>
            <p className="text-n70 text-sm text-center"></p>
          </div>

          <div className="border border-white border-opacity-5 border-dashed w-full mt-8"></div>
          {showRegi ? (
            <div>
              <div className="mt-6 p-4 bg-white bg-opacity-5 rounded-xl flex flex-col justify-center items-center text-center">
                <p className="text-n70 text-sm pt-3">Sponsor</p>
                <ul className="flex justify-center items-center gap-3 flex-wrap pt-4">
                  <li className="bg-white bg-opacity-5 py-2 px-4 rounded-md">
                    <span className="font-normal">
                      {String(refer).slice(0, 10)}......
                      {String(refer).slice(-10)}
                    </span>
                  </li>
                  <li>
                    {usdtBalance}/{bnbBalance}
                  </li>
                </ul>
              </div>

              <ul className="flex flex-wrap gap-3 pt-4">
                <li
                  className={`${
                    amount === 1
                      ? "bg-g300 bg-opacity-4"
                      : "bg-white bg-opacity-5"
                  } py-2 px-4 rounded-md`}
                  onClick={() => {
                    setAmount(1);
                    setFlash("You have selected $1");
                    setIsError(false);
                  }}
                >
                  <span className="text-n70">$</span>
                  <span className="font-medium">1</span>
                </li>
                <li
                  className={`${
                    amount === 10
                      ? "bg-g300 bg-opacity-4"
                      : "bg-white bg-opacity-5"
                  } py-2 px-4 rounded-md`}
                  onClick={() => {
                    setAmount(10);
                    setFlash("You have selected $10");
                    setIsError(false);
                  }}
                >
                  <span className="text-n70">$</span>
                  <span className="font-medium">10</span>
                </li>
                <li
                  className={`${
                    amount === 25
                      ? "bg-g300 bg-opacity-4"
                      : "bg-white bg-opacity-5"
                  } py-2 px-4 rounded-md`}
                  onClick={() => {
                    setAmount(25);
                    setFlash("You have selected $25");
                    setIsError(false);
                  }}
                >
                  <span className="text-n70">$</span>
                  <span className="font-medium">25</span>
                </li>

                <li
                  className={`${
                    amount === 50
                      ? "bg-g300 bg-opacity-4"
                      : "bg-white bg-opacity-5"
                  } py-2 px-4 rounded-md`}
                  onClick={() => {
                    setAmount(50);
                    setFlash("You have selected $50");
                    setIsError(false);
                  }}
                >
                  <span className="text-n70">$</span>
                  <span className="font-medium">50</span>
                </li>

                <li
                  className={`${
                    amount === 100
                      ? "bg-g300 bg-opacity-4"
                      : "bg-white bg-opacity-5"
                  } py-2 px-4 rounded-md`}
                  onClick={() => {
                    setAmount(100);
                    setFlash("You have selected $100");
                    setIsError(false);
                  }}
                >
                  <span className="text-n70">$</span>
                  <span className="font-medium">100</span>
                </li>
                <li
                  className={`${
                    amount === 250
                      ? "bg-g300 bg-opacity-4"
                      : "bg-white bg-opacity-5"
                  } py-2 px-4 rounded-md`}
                  onClick={() => {
                    setAmount(250);
                    setFlash("You have selected $250");
                    setIsError(false);
                  }}
                >
                  <span className="text-n70">$</span>
                  <span className="font-medium">250</span>
                </li>
              </ul>

              <div className="w-full pt-20 flex justify-center items-center">
                {!isLoading ? (
                  <button
                    className="block bg-g300 font-semibold text-center py-3 rounded-lg openAgreeModal w-full"
                    onClick={() => onSignup()}
                  >
                    Create Account
                  </button>
                ) : (
                  <div className="text-center">
                    <img
                      src="assets/images/wait.gif"
                      alt="Loading"
                      width={55}
                    />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <img src="/connect.png" alt="Connect" onClick={connectWallet} />
          )}
        </div>
      </div>
      <FlashMessage
        message={flash}
        onClose={() => setFlash("")}
        isError={isError}
      />
    </>
  );
}
