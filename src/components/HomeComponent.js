import { useEffect, useState } from "react";
import useWalletStore from "../hooks/useWallet";
import FlashMessage from "./FlashMessage";
import dashboardBalance from "../hooks/dashboardBalance";

export default function HomeComponent() {
  const api_link = process.env.REACT_APP_API_URL;
  const [spn, setSpn] = useState("");
  const { address, fetchBalances, getTxStatus } = useWalletStore();
  const { fetchIncomeData, incomeData } = dashboardBalance();
  const [flash, setFlash] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showWithdrawal, setShowWithdrawal] = useState(false);
  const [withdrawData, setWithdrawData] = useState([]);
  //const [incomeData, setIncomeData] = useState([]);
  // const address = useWalletStore((state) => state.address);
  // const fetchBalances = useWalletStore((state) => state.fetchBalances);
  async function getWithdrawals() {
    try {
      let url = api_link + "getIncomeStatement/" + address + "/Withdrawal";
      const result = await fetch(url);
      const reData = await result.json();
      setWithdrawData(reData.data);
    } catch (e) {
      console.log("Error!");
      return;
    }
  }
  useEffect(() => {
    async function getData() {
      try {
        let url = api_link + "getUser/" + address;
        const result = await fetch(url);
        const reData = await result.json();

        if (reData.data !== "No Data") {
          setSpn(reData.data[0].upCode);
        }
      } catch (e) {
        console.log("Error");
      }
    }
    getData();
  }, [address]);

  useEffect(() => {
    fetchIncomeData(address);
  }, [fetchIncomeData, address]);
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
  async function onWithdraw() {
    if (!address) {
      return;
    }
    setIsLoading(true);
    const data = await fetchIncomeData(address);
    const balance = data[0].balance;
    if (parseFloat(balance) > 0) {
      const admCh = (balance * 10) / 100;
      const net = balance - admCh;
      console.log(admCh, net);
      const signUpurl = api_link + "withdrawUsdt";
      const data = {
        to: address,
        amount: net,
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
          throw new Error(`HTTP error! status: ${result.status}`);
        }
        const reData = await result.json();
        console.log(reData.msg);
        const msg = reData.msg;
        if (msg === "success") {
          const txHash = reData.txHash;
          ///////// Database
          const withdrawalUrl = api_link + "withdrawal";
          const data = {
            publicKey: address,
            amount: balance,
            txn: txHash,
          };
          const customHeaders = {
            "Content-Type": "application/json",
          };
          try {
            const result = await fetch(withdrawalUrl, {
              method: "POST",
              headers: customHeaders,
              body: JSON.stringify(data),
            });

            if (!result.ok) {
              setIsLoading(false);
              setFlash("Withdrawal Failed!");
              setIsError(true);
              throw new Error(`HTTP error! status: ${result.status}`);
            }
            const reData = await result.json();
          } catch (error) {
            console.log("Others Error!");
            setIsLoading(false);
          }
          //// End Database
        }
        fetchIncomeData(address);
        fetchBalances(address);
        setIsLoading(false);
        setFlash("Withdrawal Success");
        setIsError(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
        setFlash("Withdrawal Failed!");
        setIsError(true);
      }
    } else {
      setIsLoading(false);
      setFlash("Low Balance");
      setIsError(true);
    }
  }
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setFlash("Share Link Copied!");
      setIsError(false);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };
  return (
    <>
      <div className="homeTab pt-2 px-6">
        <div className="pt-6">
          <p className="p-3 border border-dashed border-g300 rounded-xl w-full flex justify-center items-center gap-3 text-g300 font-medium">
            <span className="flex justify-center items-center p-1 text-n900 bg-g300 rounded-full">
              <i className="ph ph-sliders-horizontal"></i>
            </span>
            Sponsor :{String(spn).slice(0, 6)}......
            {String(spn).slice(-6)}
            <i className="ph ph-copy"></i>
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 pt-5 p-4">
        <div className="bg-white bg-opacity-5 rounded-xl p-3">
          <div className="flex justify-between items-center gap-6">
            <div className="p-2 bg-g300 rounded-md">
              <img src="assets/images/check.png" alt="" />
            </div>
            <div className="flex justify-start items-center text-g300 text-xs">
              <div className="w-12">
                <img src="assets/images/trend-graph.png" alt="" />
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center gap-6 pt-3">
            <div className="">
              <p className="font-semibold uppercase">
                {incomeData ? <>${incomeData[0].shareInc}</> : "..."}
              </p>
              <p className="font-medium text-n70">Sharing Bonus</p>
            </div>
          </div>
        </div>
        <div className="bg-white bg-opacity-5 rounded-xl p-3">
          <div className="flex justify-between items-center gap-6">
            <div className="p-2 bg-g300 rounded-md">
              <img src="assets/images/check.png" alt="" />
            </div>
            <div className="flex justify-start items-center text-g300 text-xs">
              <div className="w-12">
                <img src="assets/images/trend-graph.png" alt="" />
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center gap-6 pt-3">
            <div className="">
              <p className="font-semibold uppercase">
                {incomeData ? <>${incomeData[0].commInc}</> : "..."}
              </p>
              <p className="font-normal text-n70">Community Bonus</p>
            </div>
          </div>
        </div>
        <div className="bg-white bg-opacity-5 rounded-xl p-3">
          <div className="flex justify-between items-center gap-6">
            <div className="p-2 bg-g300 rounded-md">
              <img src="assets/images/check.png" alt="" />
            </div>
            <div className="flex justify-start items-center text-g300 text-xs">
              <div className="w-12">
                <img src="assets/images/trend-graph.png" alt="" />
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center gap-6 pt-3">
            <div className="">
              <p className="font-semibold uppercase">
                {incomeData ? <>${incomeData[0].spnInc}</> : "..."}
              </p>
              <p className="font-medium text-n70">Sponsor Bonus</p>
            </div>
          </div>
        </div>
        <div className="bg-white bg-opacity-5 rounded-xl p-3">
          <div className="flex justify-between items-center gap-6">
            <div className="p-2 bg-g300 rounded-md">
              <img src="assets/images/check.png" alt="" />
            </div>
            <div className="flex justify-start items-center text-g300 text-xs">
              <div className="w-12">
                <img src="assets/images/trend-graph.png" alt="" />
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center gap-6 pt-3">
            <div className="">
              <p className="font-semibold uppercase">
                {incomeData ? <>${incomeData[0].leaderInc}</> : "..."}
              </p>
              <p className="font-normal text-n70">Leadership Bonus</p>
            </div>
          </div>
        </div>
        <div className="bg-white bg-opacity-5 rounded-xl p-3">
          <div className="flex justify-between items-center gap-6">
            <div className="p-2 bg-g300 rounded-md">
              <img src="assets/images/check.png" alt="" />
            </div>
            <div className="flex justify-start items-center text-g300 text-xs">
              <div className="w-12">
                <img src="assets/images/trend-graph.png" alt="" />
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center gap-6 pt-3">
            <div className="">
              <p className="font-semibold uppercase">
                {incomeData ? <>${incomeData[0].achInc}</> : "..."}
              </p>
              <p className="font-normal text-n70">Achieve Bonus</p>
            </div>
          </div>
        </div>
        <div className="bg-white bg-opacity-5 rounded-xl p-3">
          <div className="flex justify-between items-center gap-6">
            <div className="p-2 bg-g300 rounded-md">
              <img src="assets/images/check.png" alt="" />
            </div>
            <div className="flex justify-start items-center text-g300 text-xs">
              <div className="w-12">
                <img src="assets/images/trend-graph.png" alt="" />
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center gap-6 pt-3">
            <div className="">
              <p className="font-semibold uppercase">
                {incomeData ? <>${incomeData[0].partnerInc}</> : "..."}
              </p>
              <p className="font-normal text-n70">Partnership Bonus</p>
            </div>
          </div>
        </div>
      </div>

      <div
        className="px-6 pt-8"
        onClick={() =>
          copyToClipboard(`https://unidex.world/#/sign?s=${address}`)
        }
      >
        <div className="w-full bg-g300 p-5 rounded-xl relative bg-opacity-20 overflow-hidden">
          <div className="flex justify-between items-center">
            <img
              src="assets/images/invite_bg.png"
              alt=""
              className="absolute top-0 right-0 bottom-0 h-full"
            />
            <div className="max-w-[300px]">
              <p className="text-xl font-semibold">
                Invite a friends and get{" "}
                <span className="text-g300">higher </span>income opportunities
              </p>
            </div>
            <div className="">
              <img src="/refer.png" alt="" width={150} />
            </div>
          </div>
          <div className="text-n70 pt-1 text-xs">
            https://unidex.world/sign?s={String(address).slice(0, 10)}
            .............
            <i
              className="ph ph-copy"
              style={{ fontSize: "20px", cursor: "pointer" }}
            ></i>
          </div>
        </div>
      </div>

      <div className="px-6 pt-8">
        <div className="flex flex-col gap-2 pt-5">
          <div className="flex justify-between items-center bg-white bg-opacity-5 p-4 rounded-xl">
            <div className="flex justify-start items-center gap-2">
              <div className="text-g300 flex justify-center items-center size-10 rounded-full text-xl bg-white bg-opacity-5">
                <img src="assets/images/check.png" alt="" />
              </div>
              <p className="font-semibold">Subscription</p>
            </div>
            <div className="flex flex-col justify-end items-end">
              <p className="font-semibold">
                {incomeData ? <>${incomeData[0].totalInv}</> : "..."}
              </p>
            </div>
          </div>
          <div className="flex justify-between items-center bg-white bg-opacity-5 p-4 rounded-xl">
            <div className="flex justify-start items-center gap-2">
              <div className="text-g300 flex justify-center items-center size-10 rounded-full text-xl bg-white bg-opacity-5">
                <img src="assets/images/check.png" alt="" />
              </div>
              <p className="font-semibold">Earned Bonus</p>
            </div>
            <div className="flex flex-col justify-end items-end">
              <p className="font-semibold">
                {incomeData ? <>${incomeData[0].totInc}</> : "..."}
              </p>
            </div>
          </div>
          {showWithdrawal ? (
            <div className="flex flex-col gap-2 pt-2">
              <div className="flex justify-between items-center">
                <p className="font-semibold text-center text-g300">
                  Withdrawal History
                </p>
                <p
                  className="text-red-400"
                  onClick={() => setShowWithdrawal(!showWithdrawal)}
                >
                  Hide
                </p>
              </div>
              {withdrawData.length > 0 ? (
                <>
                  {withdrawData.map((data, index) => (
                    <div
                      key={data.WITHDRA_SL}
                      className="flex justify-between items-center bg-white bg-opacity-5 p-4 rounded-xl"
                    >
                      <div className="flex justify-start items-center gap-2">
                        <p className="text-sm text-n70">#{index + 1}</p>
                        <div className="flex flex-col justify-start ">
                          <p className="font-semibold">{data.dates} </p>
                          <p className="text-n70 text-xs">
                            Ch. -{data.ADMIN_CH}{" "}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col justify-end items-end">
                        <p className="font-semibold">$ {data.AMOUNT}</p>
                        <p className="text-yellow">
                          Txn. {String(data.TXN).slice(0, 12)}…
                          <i className="ph ph-copy"></i>
                        </p>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <p className="text-center">No Record Found!</p>
              )}
            </div>
          ) : (
            <div className="flex justify-between items-center bg-white bg-opacity-5 p-4 rounded-xl">
              <div className="flex justify-start items-center gap-2">
                <div className="text-g300 flex justify-center items-center size-10 rounded-full text-xl bg-white bg-opacity-5">
                  <img src="assets/images/check.png" alt="" />
                </div>
                <p className="font-semibold">Withdrawal</p>
              </div>
              <div className="flex flex-col justify-end items-end">
                <p className="font-semibold">
                  {incomeData ? <>${incomeData[0].totWith}</> : "..."}
                </p>
                <p
                  className="text-g300"
                  onClick={() => {
                    setShowWithdrawal(!showWithdrawal);
                    getWithdrawals();
                  }}
                >
                  History
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center bg-white bg-opacity-5 p-4 rounded-xl">
            <div className="flex justify-start items-center gap-2">
              <div className="text-g300 flex justify-center items-center size-10 rounded-full text-xl bg-white bg-opacity-5">
                <img src="assets/images/check.png" alt="" />
              </div>
              <p className="font-semibold">Balance</p>
              {!isLoading ? (
                <button
                  className="block bg-withdraw font-semibold text-center py-1 rounded-lg openAgreeModal w-full"
                  onClick={() => onWithdraw()}
                >
                  Withdraw
                </button>
              ) : (
                <div className="text-center">
                  <img src="assets/images/wait.gif" alt="Loading" width={40} />
                </div>
              )}
            </div>
            <div className="flex flex-col justify-end items-end">
              <p className="font-semibold">
                {incomeData ? <>${incomeData[0].balance}</> : "..."}
              </p>
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
