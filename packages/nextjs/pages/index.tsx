import { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { getFreelistProof } from "../../hardhat/scripts/getRoot";
import CountDown from "../components/CountDown";
import abi from "../generated/contarc.json";
import dog from "./dog.jpg";
import pic from "./pic.png";
import { ethers } from "ethers";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { localhost } from "wagmi/chains";
import { getLocalProvider } from "~~/utils/scaffold-eth";

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const provider = getLocalProvider(localhost);
const contract = new ethers.Contract(contractAddress, abi, provider);
console.log(contract);

const Home: NextPage = () => {
  const [startTime, setstartTime] = useState<number>(0);
  const [endTime, setendTime] = useState<number>(0);
  const [nowTime, setnowTime] = useState<number>(0);
  const [maxSupply, setmaxSupply] = useState<number>(0);
  const [tokenId, settokenId] = useState<number>(0);
  const [notRevealedUri, setnotRevealedUri] = useState<string>("");
  const [baseURI, setbaseURI] = useState<string>("");
  const { address } = useAccount();

  const getfinish = () => {
    console.log("mint结束");
  };

  const freeMint = () => {
    const freeproof = getFreelistProof(address);
    console.log(freeproof);
    contract.freelistMint(freeproof).then((data: any) => {
      console.log(data);
    });
  };

  useEffect(() => {
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
    contract.baseURI().then((data: string) => {
      setbaseURI(data);
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
        <div className="bg-base-300 w-full px-8 mt-8"></div>
        <div className="w-11/12 border border-black mx-auto relative font-sans" style={{ height: "600px" }}>
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <div className="text-center font-bold ">SUPPLY</div>
            <div className="rounded-full h-24 w-24 flex items-center justify-center border border-4 border-violet-800">
              {tokenId}/{maxSupply}
            </div>
          </div>
          {/* 1 */}
          <div className="w-1/3 h-full absolute left-0 top-0 z-10 flex flex-col items-center border mt-4">
            <div className="flex flex-row justify-center">
              <span className="font-bold">FREELIST</span>
              <span>{}</span>
            </div>
            <div className="flex flex-row justify-center">
              {startTime !== 0 && startTime <= nowTime && endTime > nowTime ? (
                <div style={{ color: "#ffbf70" }}>
                  End in <CountDown max={endTime - nowTime} finish={getfinish} />
                </div>
              ) : null}
            </div>
            <Image
              src={baseURI ? dog : pic}
              alt={notRevealedUri}
              width={200}
              priority
              className="border border-2 border-black"
            />
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
              {startTime !== 0 && startTime > nowTime ? (
                "Pending"
              ) : endTime > nowTime ? (
                <div>
                  End in <CountDown max={endTime - nowTime} finish={getfinish} />
                </div>
              ) : (
                "Closed"
              )}
            </div>
            <Image src={baseURI ? dog : pic} alt={notRevealedUri} width={200} priority />
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
              <Image src={baseURI ? dog : pic} alt={notRevealedUri} width={200} priority />
              <div className="btn btn-primary btn-sm rounded-full font-normal normal-case w-20 relative z-10">FREE</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
