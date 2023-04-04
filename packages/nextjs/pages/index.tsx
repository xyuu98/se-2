import { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import CountDown from "../components/CountDown";
import abi from "../generated/contarc.json";
import pic from "./pic.png";
import { ethers } from "ethers";
import type { NextPage } from "next";
import { localhost } from "wagmi/chains";
import { getLocalProvider } from "~~/utils/scaffold-eth";

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const provider = getLocalProvider(localhost);

const Home: NextPage = () => {
  const [startTime, setstartTime] = useState<number>(0);
  const [endTime, setendTime] = useState<number>(0);
  const [nowTime, setnowTime] = useState<number>(0);
  const [maxSupply, setmaxSupply] = useState<number>(0);
  const [tokenId, settokenId] = useState<number>(0);
  const [notRevealedUri, setnotRevealedUri] = useState<string>("");

  const getfinish = () => {
    console.log("倒计时结束");
  };

  useEffect(() => {
    const contract = new ethers.Contract(contractAddress, abi, provider);
    console.log(contract);

    contract.mintEndTime().then((data: number) => {
      const endtime = parseInt(String(data), 10);
      setendTime(endtime);
    });
    contract.mintStartTime().then((data: number) => {
      const starttime = parseInt(String(data), 10);
      setstartTime(starttime);
    });
    contract.i_maxSupply().then((data: number) => {
      const _maxSupply = parseInt(String(data), 10);
      setmaxSupply(_maxSupply);
    });
    contract.tokenId().then((data: number) => {
      const _tokenId = parseInt(String(data), 10);
      settokenId(_tokenId);
    });
    contract.notRevealedUri().then((data: string) => {
      setnotRevealedUri(data);
    });

    setnowTime(new Date().getTime());
  }, [provider]);

  return (
    <>
      <Head>
        <title>Scaffold-eth App</title>
        <meta name="description" content="Created with 🏗 scaffold-eth" />
      </Head>

      {/* changed */}
      <div className="h-screen bg-base-300">
        {/*  py-12 */}
        <div className="bg-base-300 w-full px-8 mt-8"></div>

        <div className="w-11/12 border border-black mx-auto relative font-sans" style={{ height: "600px" }}>
          {/* circle */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div>SUPPLY</div>
            <div className="rounded-full h-24 w-24 flex items-center justify-center border border-black">
              {tokenId}/{maxSupply}
            </div>
          </div>
          {/* 1 */}
          <div className="w-4/5 h-full absolute left-0 top-0 z-10 flex flex-col ">
            <div>
              <div>
                <span className="font-bold">FREELIST</span>
                <span>closed</span>
              </div>
              <div>
                End in 10h &nbsp;
                {startTime !== 0 && startTime > nowTime ? (
                  "Pending"
                ) : endTime > nowTime ? (
                  <CountDown max={endTime - nowTime} finish={getfinish} />
                ) : (
                  "Closed"
                )}
              </div>
              <Image src={pic} alt={notRevealedUri} width={200} priority />
              <div className="btn btn-primary btn-sm rounded-full font-normal normal-case w-20 relative z-10">FREE</div>
            </div>
          </div>
          {/* 2 */}
          <div className="w-1/2 h-full absolute right-0 top-0 flex flex-col" style={{ alignItems: "flex-end" }}>
            <div>
              <div>
                <span className="font-bold">WHITELIST</span>
                <span>Opening</span>
              </div>
              <div>
                End in 10h&nbsp;
                {startTime !== 0 && startTime > nowTime ? (
                  "Pending"
                ) : endTime > nowTime ? (
                  <CountDown max={endTime - nowTime} finish={getfinish} />
                ) : (
                  "Closed"
                )}
              </div>
              <Image src={pic} alt={notRevealedUri} width={200} priority />
              <div className="btn btn-primary btn-sm rounded-full font-normal normal-case w-20 relative z-10">FREE</div>
            </div>
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
                  <span>Opening</span>
                </div>
                <div>End in 10h</div>
              </div>
              <Image src={pic} alt={notRevealedUri} width={200} priority />
              <div className="btn btn-primary btn-sm rounded-full font-normal normal-case w-20 relative z-10">FREE</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
