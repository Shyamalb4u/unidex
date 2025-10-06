import { useEffect, useState } from "react";
import useWalletStore from "../hooks/useWallet";

export default function Income() {
  const api_link = process.env.REACT_APP_API_URL;
  const [statementData, setStatementData] = useState([]);
  const { address } = useWalletStore();
  useEffect(() => {
    async function getPackages() {
      try {
        let url = api_link + "getIncomeStatement/" + address + "/All";
        const result = await fetch(url);
        const reData = await result.json();
        console.log("Data", reData.data);
        setStatementData(reData.data);
      } catch (e) {
        console.log("Error!");
        return;
      }
    }
    getPackages();
  }, [address]);
  return (
    <div className="px-6 pt-8">
      <div className="text-center">
        <p className="text-xl font-semibold">Income Statement</p>
      </div>
      <div className="flex flex-col gap-2 pt-5">
        {statementData.length > 0 ? (
          <>
            {statementData.map((data, index) => (
              <div
                key={data.Member_sl}
                className=" bg-white bg-opacity-5 p-4 rounded-xl"
              >
                <div className="flex justify-between items-center">
                  <div className="flex justify-start items-center gap-2">
                    <p className="text-sm text-n70">{index + 1}</p>
                    <p className="font-semibold">{data.DATES}</p>
                  </div>
                  <div className="flex flex-col justify-end items-end">
                    <p className="font-semibold">${data.CREDIT}</p>
                  </div>
                </div>
                <p className="text-g300 text-sm">
                  {data.FOLIO}-{data.DETAILS}
                </p>
              </div>
            ))}
          </>
        ) : (
          <>
            <p className="text-center">No Data Found</p>
            <div className="flex justify-center items-center">
              <img src="assets/no-data.png" alt="" width={220} />{" "}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
