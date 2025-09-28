import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useWallet, sendUSDT } from "../hooks/useWallet";

export default function Sign() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const spn = searchParams.get("s");
  const [refer, setRefer] = useState("");
  const { connectWallet, address, isConnected, signer } = useWallet();
  useEffect(() => {
    setRefer(spn);
  }, [spn]);
  return (
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
          <button onClick={connectWallet}>
            {isConnected ? `Connected: ${address}` : "Connect Wallet"}
          </button>
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

        <div className="mt-6 p-4 bg-white bg-opacity-5 rounded-xl flex flex-col justify-center items-center text-center">
          <p className="text-n70 text-sm pt-3">Sponsor</p>
          <ul className="flex justify-center items-center gap-3 flex-wrap pt-4">
            <li className="bg-white bg-opacity-5 py-2 px-4 rounded-md">
              <span className="font-medium">{refer}</span>
            </li>
            <li className="bg-white bg-opacity-5 py-2 px-4 rounded-md"></li>
          </ul>
        </div>

        <ul className="flex flex-wrap gap-3 pt-4">
          <li className="bg-white bg-opacity-5 py-2 px-4 rounded-md">
            <span className="text-n70">$</span>
            <span className="font-medium">10</span>
          </li>
          <li className="bg-white bg-opacity-5 py-2 px-4 rounded-md">
            <span className="text-n70">$</span>
            <span className="font-medium">25</span>
          </li>

          <li className="bg-white bg-opacity-5 py-2 px-4 rounded-md">
            <span className="text-n70">$</span>
            <span className="font-medium">50</span>
          </li>

          <li className="bg-white bg-opacity-5 py-2 px-4 rounded-md">
            <span className="text-n70">$</span>
            <span className="font-medium">100</span>
          </li>
          <li className="bg-white bg-opacity-5 py-2 px-4 rounded-md">
            <span className="text-n70">$</span>
            <span className="font-medium">250</span>
          </li>
        </ul>

        <div className="w-full pt-20">
          <Link
            to="/wallet"
            className="block bg-g300 font-semibold text-center py-3 rounded-lg openAgreeModal w-full"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
