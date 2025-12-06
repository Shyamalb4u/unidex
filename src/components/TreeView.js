import { useEffect, useState } from "react";
import useWalletStore from "../hooks/useWallet";

export default function TreeView() {
  const api_link = process.env.REACT_APP_API_URL;
  const [statementData, setStatementData] = useState([]);
  const [viewAddress, setViewAddress] = useState("");
  const { address } = useWalletStore();
  async function getPackages(addr) {
    try {
      let url = api_link + "genealogy/" + addr;
      const result = await fetch(url);
      const reData = await result.json();
      setStatementData(reData.data);
      setViewAddress(addr);
      console.log(reData.data);
    } catch (e) {
      console.log("Error!");
      return;
    }
  }
  useEffect(() => {
    setViewAddress(address);
    getPackages(address);
  }, [address]);

  return (
    <div className="px-6 pt-8">
      <div className="text-center">
        <p className="text-xl font-semibold">Tree View</p>
        <p className="text-n70 text-sm">
          Of {String(viewAddress).slice(0, 6)}......
          {String(viewAddress).slice(-6)}
        </p>
      </div>
      <div className="flex flex-col gap-2 pt-5">
        {statementData !== "No Data" ? (
          <>
            {statementData.map((data, index) => (
              <div className=" bg-white bg-opacity-5 p-4 rounded-xl">
                <div
                  key={data.publicKey}
                  className="flex justify-between items-center"
                  onClick={() => getPackages(data.publicKey)}
                >
                  <div className="flex justify-start items-center gap-2">
                    <p className="text-n70 text-sm">
                      {String(data.publicKey).slice(0, 6)}......
                      {String(data.publicKey).slice(-6)}
                    </p>
                  </div>
                  <div className="flex flex-col justify-end items-end">
                    <p className="font-semibold">${data.busi}</p>
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className="text-center"> No Community Found 😒 </div>
        )}
      </div>
    </div>
  );
}
