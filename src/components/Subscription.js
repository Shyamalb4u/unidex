import { useState } from "react";
import FlashMessage from "./FlashMessage";

export default function Subscription() {
  const api_link = process.env.REACT_APP_API_URL;
  const receive_address = process.env.REACT_APP_RECEIVE_ADDRESS;
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState(0);
  const [flash, setFlash] = useState("");

  const { address, usdtBalance, bnbBalance, sendUSDT, fetchBalances } =
    useWalletStore();

  async function onTopup() {
    setIsLoading(true);
    if (!address) {
      setFlash("Please Connect Wallet");
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
    const signUpurl = api_link + "topup";
    const data = {
      publicKey: address,
      amt: amount,
      txn: txHash,
      mode: "user",
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
      if (uid === "OK") {
        setIsLoading(false);
        fetchBalances(address);
        setAmount(0);
        setFlash("Subcription Successful");
        setIsError(false);
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
      <ul className="flex flex-wrap gap-3 pt-4 pb-3">
        <li
          className={`${
            amount === 1 ? "bg-g300 bg-opacity-4" : "bg-white bg-opacity-5"
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
            amount === 10 ? "bg-g300 bg-opacity-4" : "bg-white bg-opacity-5"
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
            amount === 25 ? "bg-g300 bg-opacity-4" : "bg-white bg-opacity-5"
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
            amount === 50 ? "bg-g300 bg-opacity-4" : "bg-white bg-opacity-5"
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
            amount === 100 ? "bg-g300 bg-opacity-4" : "bg-white bg-opacity-5"
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
            amount === 250 ? "bg-g300 bg-opacity-4" : "bg-white bg-opacity-5"
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
        <li className="w-50">
          {" "}
          {!isLoading ? (
            <button
              className="block bg-g300 font-semibold text-center py-3 rounded-lg openAgreeModal w-full"
              onClick={() => onTopup()}
            >
              Subcribe
            </button>
          ) : (
            <div className="text-center">
              <img src="assets/images/wait.gif" alt="Loading" width={55} />
            </div>
          )}
        </li>
      </ul>
      <hr></hr>
      {/* <div className="w-20 pt-5 flex justify-center items-center">
        {!isLoading ? (
          <button className="block bg-g300 font-semibold text-center py-3 rounded-lg openAgreeModal w-full">
            Subcribe
          </button>
        ) : (
          <div className="text-center">
            <img src="assets/images/wait.gif" alt="Loading" width={55} />
          </div>
        )}
      </div> */}

      <div className="px-6 pt-8">
        <div className="text-center">
          <p className="text-xl font-semibold">My Subscriptions</p>
        </div>
        <div className="flex flex-col gap-2 pt-5">
          <div className="flex justify-between items-center bg-white bg-opacity-5 p-4 rounded-xl">
            <div className="flex justify-start items-center gap-2">
              <p className="text-sm text-n70">#01</p>
              <p className="font-semibold">25-09-2025</p>
            </div>
            <div className="flex flex-col justify-end items-end">
              <p className="font-semibold">$10</p>
              <p className="text-g300 text-sm">Txn. 0x45d4d</p>
            </div>
          </div>
          <div className="flex justify-between items-center bg-white bg-opacity-5 p-4 rounded-xl">
            <div className="flex justify-start items-center gap-2">
              <p className="text-sm text-n70">#02</p>
              <p className="font-semibold">25-09-2025</p>
            </div>
            <div className="flex flex-col justify-end items-end">
              <p className="font-semibold">$20</p>
              <p className="text-g300 text-sm">Txn. 0x45d4d</p>
            </div>
          </div>
          <div className="flex justify-between items-center bg-white bg-opacity-5 p-4 rounded-xl">
            <div className="flex justify-start items-center gap-2">
              <p className="text-sm text-n70">#03</p>
              <p className="font-semibold">25-09-2025</p>
            </div>
            <div className="flex flex-col justify-end items-end">
              <p className="font-semibold">$100</p>
              <p className="text-g300 text-sm">Txn. 0x45d4d</p>
            </div>
          </div>
          <div className="flex justify-between items-center bg-white bg-opacity-5 p-4 rounded-xl">
            <div className="flex justify-start items-center gap-2">
              <p className="text-sm text-n70">#01</p>
              <p className="font-semibold">25-09-2025</p>
            </div>
            <div className="flex flex-col justify-end items-end">
              <p className="font-semibold">$10</p>
              <p className="text-g300 text-sm">Txn. 0x45d4d</p>
            </div>
          </div>
          <div className="flex justify-between items-center bg-white bg-opacity-5 p-4 rounded-xl">
            <div className="flex justify-start items-center gap-2">
              <p className="text-sm text-n70">#01</p>
              <p className="font-semibold">25-09-2025</p>
            </div>
            <div className="flex flex-col justify-end items-end">
              <p className="font-semibold">$10</p>
              <p className="text-g300 text-sm">Txn. 0x45d4d</p>
            </div>
          </div>
          <div className="flex justify-between items-center bg-white bg-opacity-5 p-4 rounded-xl">
            <div className="flex justify-start items-center gap-2">
              <p className="text-sm text-n70">#01</p>
              <p className="font-semibold">25-09-2025</p>
            </div>
            <div className="flex flex-col justify-end items-end">
              <p className="font-semibold">$10</p>
              <p className="text-g300 text-sm">Txn. 0x45d4d</p>
            </div>
          </div>
          <div className="flex justify-between items-center bg-white bg-opacity-5 p-4 rounded-xl">
            <div className="flex justify-start items-center gap-2">
              <p className="text-sm text-n70">#01</p>
              <p className="font-semibold">25-09-2025</p>
            </div>
            <div className="flex flex-col justify-end items-end">
              <p className="font-semibold">$10</p>
              <p className="text-g300 text-sm">Txn. 0x45d4d</p>
            </div>
          </div>
          <div className="flex justify-between items-center bg-white bg-opacity-5 p-4 rounded-xl">
            <div className="flex justify-start items-center gap-2">
              <p className="text-sm text-n70">#01</p>
              <p className="font-semibold">25-09-2025</p>
            </div>
            <div className="flex flex-col justify-end items-end">
              <p className="font-semibold">$10</p>
              <p className="text-g300 text-sm">Txn. 0x45d4d</p>
            </div>
          </div>
          <div className="flex justify-between items-center bg-white bg-opacity-5 p-4 rounded-xl">
            <div className="flex justify-start items-center gap-2">
              <p className="text-sm text-n70">#01</p>
              <p className="font-semibold">25-09-2025</p>
            </div>
            <div className="flex flex-col justify-end items-end">
              <p className="font-semibold">$10</p>
              <p className="text-g300 text-sm">Txn. 0x45d4d</p>
            </div>
          </div>
          <div className="flex justify-between items-center bg-white bg-opacity-5 p-4 rounded-xl">
            <div className="flex justify-start items-center gap-2">
              <p className="text-sm text-n70">#01</p>
              <p className="font-semibold">25-09-2025</p>
            </div>
            <div className="flex flex-col justify-end items-end">
              <p className="font-semibold">$10</p>
              <p className="text-g300 text-sm">Txn. 0x45d4d</p>
            </div>
          </div>
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
