import { useEffect, useState } from "react";
import useWalletStore from "../hooks/useWallet";

export default function HomeComponent() {
  const api_link = process.env.REACT_APP_API_URL;
  const [spn, setSpn] = useState("");
  const { address, fetchBalances, getTxStatus } = useWalletStore();
  // const address = useWalletStore((state) => state.address);
  // const fetchBalances = useWalletStore((state) => state.fetchBalances);

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
    const signUpurl = api_link + "withdrawUsdt";
    const data = {
      to: address,
      amount: 1,
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
      fetchBalances(address);
      // const msg = reData.data[0].msg;
      // if (msg === "success") {
      //   console.log(reData.data[0].txHash);
      // }
      //console.log(reData);
    } catch (error) {
      console.log(error);
    }
  }
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);

      alert("Coppied");
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
              <p className="font-semibold uppercase">120.21</p>
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
              <p className="font-semibold uppercase">12451.214</p>
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
              <p className="font-semibold uppercase">124.311</p>
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
              <p className="font-semibold uppercase">541</p>
              <p className="font-normal text-n70">Leadership Bonus</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 pt-8">
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
          <p className="text-n70 pt-1 text-xs">
            https://unidex.world/sign?s={String(address).slice(0, 10)}
            .............
            <i
              className="ph ph-copy"
              onClick={() =>
                copyToClipboard(
                  "https://unidex.world/#/sign?s=" + String(address)
                )
              }
            ></i>
          </p>
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
              <p className="font-semibold">250</p>
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
              <p className="font-semibold">$150</p>
            </div>
          </div>
          <div
            className="flex justify-between items-center bg-white bg-opacity-5 p-4 rounded-xl"
            onClick={() => onWithdraw()}
          >
            <div className="flex justify-start items-center gap-2">
              <div className="text-g300 flex justify-center items-center size-10 rounded-full text-xl bg-white bg-opacity-5">
                <img src="assets/images/check.png" alt="" />
              </div>
              <p className="font-semibold">Withdrawal</p>
            </div>
            <div className="flex flex-col justify-end items-end">
              <p className="font-semibold">$45</p>
            </div>
          </div>
          <div className="flex justify-between items-center bg-white bg-opacity-5 p-4 rounded-xl">
            <div className="flex justify-start items-center gap-2">
              <div className="text-g300 flex justify-center items-center size-10 rounded-full text-xl bg-white bg-opacity-5">
                <img src="assets/images/check.png" alt="" />
              </div>
              <p className="font-semibold">Balance</p>
            </div>
            <div className="flex flex-col justify-end items-end">
              <p className="font-semibold">$105</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
