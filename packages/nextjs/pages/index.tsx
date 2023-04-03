import { useEffect, useState } from "react";
import Head from "next/head";
// import Image from "next/image";
import CountDown from "../components/CountDown";
import abi from "../generated/contarct.json";
import { ethers } from "ethers";
import type { NextPage } from "next";
import { localhost } from "wagmi/chains";
import { getLocalProvider } from "~~/utils/scaffold-eth";

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const Home: NextPage = () => {
  const provider = getLocalProvider(localhost);
  const [startTime, setstartTime] = useState<number>(0);
  const [endTime, setendTime] = useState<number>(0);
  const [nowTime, setnowTime] = useState<number>(0);
  //   const [maxSupply, setmaxSupply] = useState<number>(0);

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
    // contract.maxSupply().then((data: number) => {
    //   console.log(data);
    //   setmaxSupply(starttime);
    // });
    setnowTime(new Date().getTime());
  }, []);

  return (
    <>
      <Head>
        <title>Scaffold-eth App</title>
        <meta name="description" content="Created with 🏗 scaffold-eth" />
      </Head>

      {/* changed */}
      <div className="h-screen bg-base-300">
        {/* mt-16  py-12 */}
        <div className="bg-base-300 w-full px-8">
          {/* <div className="p-5 divide-y divide-base-300">{contractWriteMethods.methods[0]}</div> */}
        </div>

        <div className="w-11/12 border border-black mx-auto relative font-sans" style={{ height: "600px" }}>
          {/* circle */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div>SUPPLY</div>
            <div className="rounded-full h-24 w-24 flex items-center justify-center border border-black">1/1000</div>
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
              {/* <Image
                   src=""
                alt="My Image"
                width={200}
                height={300}
              /> */}
              <div className="btn btn-primary btn-sm rounded-full font-normal normal-case w-20">FREE</div>
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
              {/* <Image
              src=""
                alt="My Image"
                width={200}
                height={300}
              /> */}
              <div className="btn btn-primary btn-sm rounded-full font-normal normal-case w-20">FREE</div>
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
              {/* <Image
              src=""
                alt="My Image"
                width={200}
                height={300}
              /> */}
              <div className="btn btn-primary btn-sm rounded-full font-normal normal-case w-20">FREE</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
