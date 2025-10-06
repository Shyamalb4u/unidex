import { useEffect, useState } from "react";
import useWalletStore from "../hooks/useWallet";
export default function Network() {
  const api_link = process.env.REACT_APP_API_URL;
  const [statementData, setStatementData] = useState([]);
  const { address } = useWalletStore();
  useEffect(() => {
    async function getPackages() {
      try {
        let url = api_link + "getDownline/" + address;
        const result = await fetch(url);
        const reData = await result.json();
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
        <p className="text-xl font-semibold">Community</p>
      </div>
      <div className="flex flex-col gap-2 pt-5">
        {statementData.length > 0 ? (
          <>
            {statementData.map((data, index) => (
              <div className=" bg-white bg-opacity-5 p-4 rounded-xl">
                <div
                  key={data.lvl}
                  className="flex justify-between items-center"
                >
                  <div className="flex justify-start items-center gap-2">
                    <p className="font-semibold">Level {data.lvl}</p>
                  </div>
                  <div className="flex flex-col justify-end items-end">
                    <p className="font-semibold">${data.busi}</p>
                  </div>
                </div>
                <p className="text-g300 text-sm">
                  Total {data.team} : Active : {data.team}
                </p>
              </div>
            ))}
          </>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
