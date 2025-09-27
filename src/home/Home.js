import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="container bg-n900 min-h-dvh relative overflow-hidden flex justify-start items-start text-white pb-28">
      <div className="w-[582px] h-[582px] rounded-full bg-g300 absolute -top-32 -left-20 blur-[575px]"></div>

      <div className="px-6 py-8 relative z-20 w-full">
        <div className="flex justify-center items-center pb-8">
          <div className="flex justify-center items-center w-full">
            <img src="/logo.png" alt="" width={150} />
          </div>
        </div>

        <div className="">
          <div className="w-full bg-g300 p-5 flex justify-between items-center rounded-xl relative bg-opacity-20 overflow-hidden">
            <img
              src="/assets/images/invite_bg.png"
              alt=""
              className="absolute top-0 right-0 bottom-0 h-full"
            />
            <div className="max-w-[200px]">
              <p className="text-xl font-semibold">
                Smart Edges for{" "}
                <span className="text-g300">Accelerating Financial Growth</span>
              </p>
              <p className="text-n70 pt-4 text-xs">
                THE SIMPLE MOVE TO INVEST & BEGIN CRYPTO FUTURE
              </p>
            </div>
            <div className="">
              <img src="/globe.gif" alt="" />
            </div>
          </div>
        </div>

        <div className="flex justify-start items-center gap-3 overflow-y-auto pt-4 pb-3 pl-4">
          <Link
            to="/sign"
            className="block bg-g300 font-semibold text-center py-3 px-3 rounded-lg"
          >
            Launch App <i className="ph ph-caret-right"></i>
          </Link>
        </div>
        <p className="text-xl font-bold">About UniDex</p>
        <p className="pb-3">
          At UniDex, we revolutionize the smart approach to transform the era of
          digital finance by integrating community-driven growth powered by
          blockchain technology. Our solution blends expansion of digital assets
          with a structured network model.
        </p>
        <div className="bg-white bg-opacity-5 rounded-xl p-3 mt-4">
          <div class="flex justify-between items-center gap-6 pt-3">
            <div class="">
              <p class="font-semibold">
                Maximize your earnings through smart investments.
              </p>
              <p class="font-medium text-n70">
                Boost your earning potential with strategic asset investments
                and a blockchain-driven ecosystem, tailored for sustainable
                growth and effortless gain and scalable earning opportunities.
              </p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 pt-5">
          <div className="rounded-xl overflow-hidden col-span-1">
            <img src="/assets/images/nft-tab-img-1.png" alt="" />
            <div className="bg-white bg-opacity-5 p-3 flex justify-between items-start">
              <div className="flex justify-start items-start flex-col gap-2">
                <p className="text-sm font-semibold">
                  Blockchain-powered transparency
                </p>
                <div className="flex justify-center items-center bg-white bg-opacity-5 py-1 px-2 rounded-md gap-1">
                  <p className="text-xs text-n70 font-medium">
                    Obtain trust with visible, tamper-proof, and real-time data
                    with verification and validation.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-xl overflow-hidden col-span-1">
            <img src="/assets/images/nft-tab-img-2.png" alt="" />
            <div className="bg-white bg-opacity-5 p-3 flex justify-between items-start">
              <div className="flex justify-start items-start flex-col gap-2">
                <p className="text-sm font-semibold">
                  Strong encryption and security
                </p>
                <div className="flex justify-center items-center bg-white bg-opacity-5 py-1 px-2 rounded-md gap-1">
                  <p className="text-xs text-n70 font-medium">
                    Your information and assets are safeguarded with
                    multi-layered blockchain security protocols.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="fixed left-0 right-0 bottom-0">
          <div className="container relative bg-white bg-opacity-5 py-5 flex justify-around items-center text-white">
            Copyright www.unidex.world 2025.
          </div>
        </div>
      </div>
    </div>
  );
}
