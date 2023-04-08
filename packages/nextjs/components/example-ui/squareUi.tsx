import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { getFreelistProof, getWhitelistProof } from "../../../hardhat/scripts/getRoot";
import nullPic from "../../pages/null.jpg";
import pic from "../../pages/pic.png";
import { notification } from "../../utils/scaffold-eth/notification";
import { useAccount } from "wagmi";
import { useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

export const SquareUi = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { address } = useAccount();

  const { data: totalCounter } = useScaffoldContractRead({
    contractName: "SE2H",
    functionName: "getMaxSupply",
  });
  const { data: tokenId } = useScaffoldContractRead({
    contractName: "SE2H",
    functionName: "getTokenId",
  });
  const { writeAsync: writePublic } = useScaffoldContractWrite({
    contractName: "SE2H",
    functionName: "publicMint",
    value: "0.1",
  });
  const { data: freeIf } = useScaffoldContractRead({
    contractName: "SE2H",
    functionName: "freelistClaimed",
    args: [address],
  });

  const { data: endTime } = useScaffoldContractRead({
    contractName: "SE2H",
    functionName: "getMintEndTime",
  });
  const { data: balanceof } = useScaffoldContractRead({
    contractName: "SE2H",
    functionName: "balanceOf",
    args: [address],
  });
  const { data: startTime } = useScaffoldContractRead({
    contractName: "SE2H",
    functionName: "getMintStartTime",
  });

  const [_args, set_args] = useState<any>();
  const { writeAsync: freelistMint } = useScaffoldContractWrite({
    contractName: "SE2H",
    functionName: "freelistMint",
    args: _args,
  });

  const PublicMint = () => {
    const _now = new Date().getTime();
    if (Number(endTime) * 1000 > _now) {
      notification.warning(
        <>
          <p className="font-bold">The public mint has not started yet</p>
        </>,
      );
      return;
    }
    if (5 - Number(balanceof) <= 0) {
      notification.warning(
        <>
          <p className="font-bold">Mint upper limit</p>
        </>,
      );
      return;
    }

    writePublic();
  };

  const freeMint = () => {
    const _now = new Date().getTime();
    if (_now > Number(endTime) * 1000) {
      notification.warning(
        <>
          <p className="font-bold">The free mint has ended</p>
        </>,
      );
      return;
    }
    if (_now < Number(startTime) * 1000) {
      notification.warning(
        <>
          <p className="font-bold">The free mint has not started yet</p>
        </>,
      );
      return;
    }
    if (freeIf) {
      notification.warning(
        <>
          <p className="font-bold">Already mint it for free</p>
        </>,
      );
      return;
    }
    const proof = getFreelistProof(address);
    set_args(proof);
    _args && freelistMint();
  };

  const { data: whiteif } = useScaffoldContractRead({
    contractName: "SE2H",
    functionName: "whitelistClaimed",
    args: [address],
  });

  const [__args, set__args] = useState<any>();
  const { writeAsync: whitelistMint } = useScaffoldContractWrite({
    contractName: "SE2H",
    functionName: "whitelistMint",
    args: __args,
  });

  const whiteMint = () => {
    const _now = new Date().getTime();
    if (_now > Number(endTime) * 1000) {
      notification.warning(
        <>
          <p className="font-bold">The free mint has ended</p>
        </>,
      );
      return;
    }
    if (_now < Number(startTime) * 1000) {
      notification.warning(
        <>
          <p className="font-bold">The free mint has not started yet</p>
        </>,
      );
      return;
    }
    if (whiteif) {
      notification.warning(
        <>
          <p className="font-bold">Already mint it for whitelist</p>
        </>,
      );
      return;
    }
    const proof = getWhitelistProof(address);
    set__args(proof);
    __args && whitelistMint();
  };

  useEffect(() => {}, []);

  return (
    <div className="">
      {/* Total count */}
      <div className="btn flex justify-around mt-2 mb-2">
        <div className="">Total count</div>
        <div className="text-lg">
          {tokenId?.toString() || "0"}/{totalCounter?.toString() || "0"}
        </div>
      </div>
      {/* mint */}
      <div className="py-2 flex flex-wrap justify-center bg-[url('/assets/gradient-bg.png')] bg-[length:100%_100%] sm:px-0 lg:py-auto">
        {/* free white */}
        <div className="flex justify-around">
          {/* 1 whitelist mint */}
          <div className={`mr-8 flex flex-col bg-base-200 bg-opacity-70 rounded-2xl shadow-lg px-5 py-4 }`}>
            <div className="flex justify-between w-full">
              <button className="" onClick={() => {}}>
                <div>
                  <strong>Status:</strong>
                  {whiteif ? "Already mint" : "Not mint"}
                </div>
              </button>
            </div>
            <div className="mt-3 border border-primary bg-neutral rounded-3xl text-secondary  overflow-hidden text-[116px] whitespace-nowrap w-full uppercase tracking-tighter font-bai-jamjuree leading-tight">
              <div className="relative overflow-x-hidden" ref={containerRef}>
                {/* for speed calculating purposes */}
                {new Array(1).fill("").map((_, i) => {
                  return (
                    <div className="flex justify-center" key={i}>
                      <Image src={whiteif ? pic : nullPic} alt="" width={200} priority />
                    </div>
                  );
                })}
              </div>
            </div>
            <button className="btn" onClick={whiteMint}>
              White Mint
            </button>
          </div>

          {/* 2  free mint */}
          <div className={`flex flex-col bg-base-200 bg-opacity-70 rounded-2xl shadow-lg px-5 py-4  }`}>
            <div className="flex justify-between w-full">
              <button className="" onClick={() => {}}>
                <div>
                  <strong>Status:</strong>
                  {freeIf ? "Already mint" : "Not mint"}
                </div>
              </button>
            </div>
            <div className="mt-3 border border-primary bg-neutral rounded-3xl text-secondary  overflow-hidden text-[116px] whitespace-nowrap w-full uppercase tracking-tighter font-bai-jamjuree leading-tight">
              <div className="relative overflow-x-hidden" ref={containerRef}>
                {/* for speed calculating purposes */}
                {new Array(1).fill("").map((_, i) => {
                  return (
                    <div className="flex justify-center" key={i}>
                      <Image src={freeIf ? pic : nullPic} alt="" width={200} priority />
                    </div>
                  );
                })}
              </div>
            </div>
            <button className="btn" onClick={freeMint}>
              Free Mint
            </button>
          </div>
        </div>

        {/*   public mint */}
        <div
          className={`mt-2 flex flex-col max-w-md bg-base-200 bg-opacity-70 rounded-2xl shadow-lg px-5 py-4 w-full }`}
        >
          <div className="flex justify-between w-full">
            <button className="" onClick={() => {}}>
              <div>
                <strong>Can mint:</strong>
                {5 - Number(balanceof)}
              </div>
            </button>
          </div>
          <div className="mt-3 border border-primary bg-neutral rounded-3xl text-secondary  overflow-hidden text-[116px] whitespace-nowrap w-full uppercase tracking-tighter font-bai-jamjuree leading-tight">
            <div className="relative overflow-x-hidden" ref={containerRef}>
              {/* for speed calculating purposes */}
              {new Array(1).fill("").map((_, i) => {
                return (
                  <div className="flex justify-center" key={i}>
                    <Image src={Number(balanceof) > 1 ? pic : nullPic} alt="" width={200} priority />
                  </div>
                );
              })}
            </div>
          </div>
          <button className="btn" onClick={PublicMint}>
            Public Mint
          </button>
        </div>
      </div>
    </div>
  );
};
