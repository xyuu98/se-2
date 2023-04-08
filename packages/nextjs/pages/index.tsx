import { useEffect, useState } from "react";
import Head from "next/head";
import { useScaffoldContractRead } from "../hooks/scaffold-eth/useScaffoldContractRead";
import dayjs from "dayjs";
import type { NextPage } from "next";
import { SquareUi } from "~~/components/example-ui/squareUi";

const Home: NextPage = () => {
  const [now, setNow] = useState("");
  const [nowStamp, setNowStamp] = useState(0);

  const { data: startTime } = useScaffoldContractRead({
    contractName: "SE2H",
    functionName: "getMintStartTime",
  });
  const { data: endTime } = useScaffoldContractRead({
    contractName: "SE2H",
    functionName: "getMintEndTime",
  });
  const { data: mintState } = useScaffoldContractRead({
    contractName: "SE2H",
    functionName: "getMintState",
  });
  const { data: tokenId } = useScaffoldContractRead({
    contractName: "SE2H",
    functionName: "getTokenId",
  });
  const { data: maxSupply } = useScaffoldContractRead({
    contractName: "SE2H",
    functionName: "getMaxSupply",
  });

  const formatTime = () => {
    const time = new Date().getTime();
    const _time = dayjs(time * 1000).format("YYYY-MM-DD HH-mm-ss");
    setNow(_time);
    setNowStamp(time);
  };

  useEffect(() => {
    const timeoutID = setInterval(() => {
      formatTime();
    }, 1000);

    return () => {
      clearTimeout(timeoutID);
    };
  }, []);

  return (
    <>
      <Head>
        <title>Scaffold-eth App</title>
        <meta name="description" content="Created with 🏗 scaffold-eth" />
      </Head>

      {/* changed */}
      <div className="h-auto bg-base-300 flex flex-row">
        <div className="w-1/3 pl-5">
          <div className="mt-3">
            <strong>Total supply:</strong> <br />
            {Number(maxSupply)}
          </div>
          <div className="mt-3">
            <strong> Already mint:</strong> <br />
            {Number(tokenId)}
          </div>
          <div className="mt-3">
            <strong>Status:</strong> <br />
            {mintState ? "true" : "false"}
          </div>

          <div className="mt-3">
            <strong>Now time:</strong> <br />
            {now} <br />
            {nowStamp}
          </div>
          <div className="mt-3">
            <strong>Start time:</strong> <br />
            {dayjs(Number(startTime) * 1000).format("YYYY-MM-DD HH:mm")}
          </div>
          <div className="mt-3">
            <strong> End time: </strong> <br />
            {dayjs(Number(endTime) * 1000).format("YYYY-MM-DD HH:mm")}
          </div>
        </div>
        <div className="grow pr-4">
          <div className="w-2/3">
            <SquareUi />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
