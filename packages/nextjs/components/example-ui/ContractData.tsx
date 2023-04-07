import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import dog from "../../pages/dog.jpg";
import pic from "../../pages/pic.png";
import { useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

export const ContractData = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: totalCounter } = useScaffoldContractRead({
    contractName: "SE2H",
    functionName: "getMaxSupply",
  });
  const { data: tokenId } = useScaffoldContractRead({
    contractName: "SE2H",
    functionName: "getTokenId",
  });
  const { data: baseURI } = useScaffoldContractRead({
    contractName: "SE2H",
    functionName: "getBaseUri",
  });
  const { writeAsync: writePublic } = useScaffoldContractWrite({
    contractName: "SE2H",
    functionName: "publicMint",
    value: "0.1",
  });

  const PublicMint = () => {
    console.log(2, writePublic());
  };

  useEffect(() => {}, []);

  return (
    <div className="flex flex-col justify-center items-center bg-[url('/assets/gradient-bg.png')] bg-[length:100%_100%] py-10 px-5 sm:px-0 lg:py-auto max-w-[100vw] ">
      <div
        className={`flex flex-col max-w-md bg-base-200 bg-opacity-70 rounded-2xl shadow-lg px-5 py-4 w-full 
        }`}
      >
        <div className="flex justify-between w-full">
          <button
            className="btn btn-circle btn-ghost relative bg-center bg-[url('/assets/switch-button-on.png')] bg-no-repeat"
            onClick={() => {}}
          >
            <div
              className={`absolute inset-0 bg-center bg-no-repeat bg-[url('/assets/switch-button-off.png')] transition-opacity opacity-0 
              }`}
            />
          </button>
          <div className="bg-secondary border border-primary rounded-xl flex">
            <div className="p-2 py-1 border-r border-primary flex items-end">Total count</div>
            <div className="text-4xl text-right min-w-[3rem] px-2 py-1 flex justify-end font-bai-jamjuree">
              {tokenId?.toString() || "0"}/{totalCounter?.toString() || "0"}
            </div>
          </div>
        </div>

        <div className="mt-3 border border-primary bg-neutral rounded-3xl text-secondary  overflow-hidden text-[116px] whitespace-nowrap w-full uppercase tracking-tighter font-bai-jamjuree leading-tight">
          <div className="relative overflow-x-hidden" ref={containerRef}>
            {/* for speed calculating purposes */}
            {new Array(1).fill("").map((_, i) => {
              return (
                <div className="flex justify-center">
                  <Image
                    src={baseURI ? dog : pic}
                    alt=""
                    width={200}
                    priority
                    className="border border-2 border-black"
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-3 flex items-end justify-between">
          <button
            className={`btn btn-circle btn-ghost border border-primary hover:border-primary w-12 h-12 p-1 bg-neutral flex items-center justify-start}`}
            onClick={PublicMint}
          >
            <div className="border border-primary rounded-full bg-secondary w-2 h-2 relative">
              <span className="absolute translate-x-7">PublicMint</span>
            </div>
          </button>
          <div className="w-44 p-0.5 flex items-center bg-neutral border border-primary rounded-full">
            <div
              className="h-1.5 border border-primary rounded-full bg-secondary animate-grow"
              style={{ animationPlayState: "paused" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
