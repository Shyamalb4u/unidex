import { Link, useNavigate } from "react-router-dom";
import HomeComponent from "../components/HomeComponent";
import Subscription from "../components/Subscription";
import { useEffect, useState } from "react";
import Income from "../components/Income";
import Network from "../components/Network";
import useWalletStore from "../hooks/useWallet";

export default function Wallet() {
  const navigate = useNavigate();
  const api_link = process.env.REACT_APP_API_URL;
  const [page, setPage] = useState(0);

  // const address = useWalletStore((state) => state.address);
  // const bnbBalance = useWalletStore((state) => state.bnbBalance);
  // const usdtBalance = useWalletStore((state) => state.usdtBalance);
  // const fetchBalances = useWalletStore((state) => state.fetchBalances);
  // const isConnected = useWalletStore((state) => state.isConnected);
  // const signer = useWalletStore((state) => state.signer);
  // const getTxStatus = useWalletStore((state) => state.getTxStatus);

  const {
    address,
    isConnected,
    signer,
    bnbBalance,
    usdtBalance,
    fetchBalances,
    getTxStatus,
  } = useWalletStore();
  useEffect(() => {
    async function checkUser() {
      if (!isConnected) {
        navigate("/");
      }
    }
    checkUser();
  }, [isConnected, navigate]);
  useEffect(() => {
    async function getPendingData() {
      try {
        let url = api_link + "pending_activation/" + address;
        console.log(url);
        const result = await fetch(url);
        const reData = await result.json();

        if (reData.data !== "No Data") {
          for (const pdata of reData.data) {
            try {
              const status = await getTxStatus(pdata.txn);

              if (status === "success") {
                console.log(pdata.txn);
                //set activation status success and calculate income abd achievement
                const buyUpurl = api_link + "booking";
                const data = {
                  txn: pdata.txn,
                  type: "success",
                };
                const customHeaders = {
                  "Content-Type": "application/json",
                };
                try {
                  const result = await fetch(buyUpurl, {
                    method: "POST",
                    headers: customHeaders,
                    body: JSON.stringify(data),
                  });
                  if (!result.ok) {
                    throw new Error(`HTTP error! status: ${result.status}`);
                  }
                } catch (error) {
                  console.log("Error!");
                }
              } else if (status === "failed") {
                const buyUpurl = api_link + "booking";
                const data = {
                  txn: pdata.txn,
                  type: "fail",
                };
                const customHeaders = {
                  "Content-Type": "application/json",
                };
                try {
                  const result = await fetch(buyUpurl, {
                    method: "POST",
                    headers: customHeaders,
                    body: JSON.stringify(data),
                  });
                  if (!result.ok) {
                    throw new Error(`HTTP error! status: ${result.status}`);
                  }
                } catch (error) {
                  console.log("Error!");
                }
              }
            } catch (e) {
              console.log("Error!");
            }
          }
        }
      } catch (e) {
        console.log("Error!");
        return;
      }
    }
    getPendingData();
  }, [address, getTxStatus]);

  return (
    <div className="container bg-n900 relative overflow-hidden flex justify-start items-start text-white pb-36">
      <div className="w-[582px] h-[582px] rounded-full bg-g300/10 absolute -top-48 -left-20 blur-[575px]"></div>
      <div className="relative z-20 w-full">
        <div className="bg-white bg-opacity-5 py-4 px-6 rounded-b-3xl">
          <div className="flex justify-between items-center">
            <div className="flex justify-start items-center gap-2">
              <img src="/logo.png" alt="Logo" width={80} />
              {/* <p className="text-sm">0x21hf12h1ffghfgfghfh</p> */}
            </div>
            <div className="flex justify-start items-center gap-2">
              <span className="text-n70 text-sm">
                {String(address).slice(0, 10)}......{String(address).slice(-10)}
              </span>
            </div>
          </div>
          <div className="flex justify-between items-start">
            <div className="py-4">
              <p className="text-n70 text-sm">Your available balance</p>
              <div className="flex justify-start items-center gap-2">
                <img src="/assets/images/tet.png" alt="" />
                <p className="text-[32px] font-bold text-white relative">
                  {usdtBalance}
                  <span className="text-sm font-normal text-g300 absolute top-1 -right-14">
                    (USDT)
                  </span>
                </p>
              </div>
              <p className="text-sm text-n70">
                <span className="text-g300"></span>
                {bnbBalance} (BNB)
              </p>
            </div>
            <i
              className="ph ph-arrows-counter-clockwise"
              onClick={() => fetchBalances(address)}
            ></i>
          </div>
        </div>
        {page === 0 ? (
          <HomeComponent />
        ) : page === 1 ? (
          <Subscription />
        ) : page === 2 ? (
          <Income />
        ) : page === 3 ? (
          <Network />
        ) : (
          ""
        )}

        <div className="fixed left-0 right-0 bottom-0">
          <div className="container relative bg-white bg-opacity-5 py-5 flex justify-around items-center after:absolute after:bg-n700 after:inset-0">
            <div className="absolute left-[41%] bottom-[72px] z-40">
              <Link
                to="/wallet"
                className="bg-g300 text-2xl p-3.5 rounded-full flex justify-center items-center relative"
              >
                <i className="ph ph-arrows-counter-clockwise"></i>
                <div className="absolute -bottom-2 -left-5 -right-5 -z-10">
                  <img src="assets/images/reload-bg.png" alt="" />
                </div>
              </Link>
            </div>
            <div
              className="flex flex-col justify-center items-center gap-1 relative z-20"
              onClick={() => setPage(0)}
            >
              <i
                className={`ph ph-house text-2xl ${
                  page === 0 ? "text-g300" : ""
                }`}
              ></i>
              <p className="text-xs font-semibold">Home</p>
            </div>
            <div
              className="flex flex-col justify-center items-center gap-1 z-20"
              onClick={() => setPage(1)}
            >
              <i
                className={`ph ph-globe text-2xl ${
                  page === 1 ? "text-g300" : ""
                }`}
              ></i>
              <p className="text-xs font-semibold">Subscription</p>
            </div>
            <div
              className="flex flex-col justify-center items-center gap-1 z-20"
              onClick={() => setPage(2)}
            >
              <i
                className={`ph ph-align-bottom text-2xl ${
                  page === 2 ? "text-g300" : ""
                }`}
              ></i>
              <p className="text-xs font-semibold">Income</p>
            </div>
            <div
              className="flex flex-col justify-center items-center gap-1 z-20"
              onClick={() => setPage(3)}
            >
              <i
                className={`ph ph-user text-2xl ${
                  page === 3 ? "text-g300" : ""
                }`}
              ></i>
              <p className="text-xs font-semibold">Community</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
