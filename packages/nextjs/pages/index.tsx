import { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { getFreelistProof } from "../../hardhat/scripts/getRoot";
import CountDown from "../components/CountDown";
import { useScaffoldContractRead } from "../hooks/scaffold-eth/useScaffoldContractRead";
import { useScaffoldContractWrite } from "../hooks/scaffold-eth/useScaffoldContractWrite";
import dog from "./dog.jpg";
import pic from "./pic.png";
import type { NextPage } from "next";
import { useAccount } from "wagmi";

const Home: NextPage = () => {
  const { address } = useAccount();

  const nowTime = new Date().getTime();
  const { data: startTime } = useScaffoldContractRead({
    contractName: "SE2H",
    functionName: "getMintStartTime",
  });
  const { data: endTime } = useScaffoldContractRead({
    contractName: "SE2H",
    functionName: "getMintEndTime",
  });
  const { data: baseURI } = useScaffoldContractRead({
    contractName: "SE2H",
    functionName: "getBaseUri",
  });
  const { data: tokenId } = useScaffoldContractRead({
    contractName: "SE2H",
    functionName: "getTokenId",
  });
  const { data: maxSupply } = useScaffoldContractRead({
    contractName: "SE2H",
    functionName: "getMaxSupply",
  });
  const { writeAsync: writePublic } = useScaffoldContractWrite({
    contractName: "SE2H",
    functionName: "publicMint",
    value: "0.1",
  });

  const [_args, set_args] = useState<any>();
  const { writeAsync: freelistMint } = useScaffoldContractWrite({
    contractName: "SE2H",
    functionName: "freelistMint",
    args: _args,
  });

  const getfinish = () => {
    console.log("finish");
  };

  const freeMint = () => {
    const freeproof = getFreelistProof(address);
    set_args(freeproof);
    console.log(_args, freeproof);
    console.log(1, freelistMint());
  };
  const PublicMint = () => {
    console.log(2, writePublic());
  };

  useEffect(() => {
    console.log("start home");
  }, []);

  return (
    <>
      <Head>
        <title>Scaffold-eth App</title>
        <meta name="description" content="Created with 🏗 scaffold-eth" />
      </Head>

      {/* changed */}
      <div className="h-screen bg-base-300">
        <div className="bg-base-300 w-full px-8 mt-8"></div>
        <div className="w-11/12 border border-black mx-auto relative font-sans" style={{ height: "600px" }}>
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <div className="text-center font-bold ">SUPPLY</div>
            <div className="rounded-full h-24 w-24 flex items-center justify-center border border-4 border-violet-800">
              {Number(tokenId)}/{Number(maxSupply)}
            </div>
          </div>
          {/* 1 */}
          <div className="w-1/3 h-full absolute left-0 top-0 z-10 flex flex-col items-center border mt-4">
            <div className="flex flex-row justify-center">
              <span className="font-bold">FREELIST</span>
              <span>{}</span>
            </div>
            <div className="flex flex-row justify-center">
              {Number(startTime) !== 0 && Number(startTime) <= nowTime && Number(endTime) > nowTime ? (
                <div style={{ color: "#ffbf70" }}>
                  End in <CountDown max={Number(endTime) - nowTime} finish={getfinish} />
                </div>
              ) : null}
            </div>
            <Image src={baseURI ? dog : pic} alt="" width={200} priority className="border border-2 border-black" />
            <div
              className="btn btn-primary btn-sm rounded-full font-normal normal-case w-20 relative z-10 mt-4"
              onClick={freeMint}
            >
              FreeMint
            </div>
          </div>
          {/* 2 */}
          <div className="w-1/2 h-full absolute right-0 top-0 flex flex-col" style={{ alignItems: "flex-end" }}>
            <div>
              <span className="font-bold">WHITELIST</span>
              <span></span>
            </div>
            <div>
              {Number(startTime) !== 0 && Number(startTime) > nowTime ? (
                "Pending"
              ) : Number(endTime) > nowTime ? (
                <div>
                  End in <CountDown max={Number(endTime) - nowTime} finish={getfinish} />
                </div>
              ) : (
                "Closed"
              )}
            </div>
            <Image src={baseURI ? dog : pic} alt="" width={200} priority />
            <div className="btn btn-primary btn-sm rounded-full font-normal normal-case w-20 relative z-10">FREE</div>
          </div>
          {/* 3 */}
          <div
            className="w-full h-1/2 absolute bottom-0 flex flex-row justify-center"
            style={{ alignItems: "flex-end" }}
          >
            <div className="flex flex-row">
              <div>
                <div>
                  <span className="font-bold">Public</span>
                  <span></span>
                </div>
                <div></div>
              </div>
              <Image src={baseURI ? dog : pic} alt="" width={200} priority />
              <div
                className="btn btn-primary btn-sm rounded-full font-normal normal-case w-20 relative z-10"
                onClick={PublicMint}
              >
                PublicMint
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
