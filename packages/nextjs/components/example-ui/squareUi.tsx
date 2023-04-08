import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { getFreelistProof, getWhitelistProof } from "../../../hardhat/scripts/getRoot";
import nullPic from "../../pages/null.jpg";
import pic from "../../pages/pic.png";
import { notification } from "../../utils/scaffold-eth/notification";
import dayjs from "dayjs";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import { useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

export const SquareUi = () => {
  const [now, setNow] = useState(0);
  const { address } = useAccount();
  const [show, setShow] = useState(false);

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
    onSuccess: () => {
      setShow(true);
    },
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

  const [_merkleProof, set_merkleProof] = useState<any>();
  const { writeAsync: freelistMint } = useScaffoldContractWrite({
    contractName: "SE2H",
    functionName: "freelistMint",
    args: _merkleProof,
    onSuccess: () => {
      setShow(true);
    },
  });

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
    value: "0.05",
    onSuccess: () => {
      setShow(true);
    },
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

  const freeMint = async () => {
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
    if (proof) {
      let _proofs: string[] = [];
      proof.forEach(item => {
        _proofs.push(ethers.utils.hexlify(item));
      });
      const params = [_proofs];
      set_merkleProof(params);
      _merkleProof && freelistMint();
    } else {
      notification.warning(
        <>
          <p className="font-bold">You are not on the list</p>
        </>,
      );
    }
  };

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
          <p className="font-bold">The whitelist mint has not started yet</p>
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
    if (proof) {
      let _proofs: string[] = [];
      proof.forEach(item => {
        _proofs.push(ethers.utils.hexlify(item));
      });
      const params = [_proofs];
      set__args(params);
      __args && whitelistMint();
    } else {
      notification.warning(
        <>
          <p className="font-bold">You are not on the list</p>
        </>,
      );
    }
  };

  const formatTime = () => {
    const time = new Date().getTime();
    setNow(time);
  };

  //   const showWhitelist = () => {
  //     if (whiteif) {
  //       setShow(true);
  //     } else {
  //       notification.warning(
  //         <>
  //           <p className="font-bold">No NFT there</p>
  //         </>,
  //       );
  //     }
  //   };

  //   const showFreelist = () => {
  //     if (freeIf) {
  //       setShow(true);
  //     } else {
  //       notification.warning(
  //         <>
  //           <p className="font-bold">No NFT there</p>
  //         </>,
  //       );
  //     }
  //   };

  //   const showPubliclist = () => {
  //     if (Number(balanceof) > 0) {
  //       setShow(true);
  //     } else {
  //       notification.warning(
  //         <>
  //           <p className="font-bold">No NFT there</p>
  //         </>,
  //       );
  //     }
  //   };

  useEffect(() => {
    const timeoutID = setInterval(() => {
      formatTime();
    }, 1000);

    return () => {
      clearTimeout(timeoutID);
    };
  }, []);

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
      <div className="py-2 flex flex-wrap justify-center bg-[url('/assets/gradient-bg.png')] bg-[length:100%_100%] relative">
        {!show ? null : (
          <div
            className="absolute w-[250px] h-[300px] z-20 rounded-md bg-indigo-300 flex flex-col justify-center"
            style={{ top: "10%" }}
          >
            <Image src={pic} width={200} height={200} alt="" className="rounded-md" style={{ margin: "10px auto" }} />

            <div
              className="btn"
              style={{ margin: "auto" }}
              onClick={() => {
                setShow(false);
              }}
            >
              close
            </div>
          </div>
        )}

        {/* free white */}
        {/* 1 whitelist mint */}
        <div className={`flex flex-col justify-around bg-base-200 bg-opacity-70 rounded-2xl shadow-lg px-5 py-4 }`}>
          <div className="flex justify-between w-full">
            <div>
              <strong>Status:</strong>
              {now < Number(startTime) * 1000 ? (
                <span style={{}}>Not started</span>
              ) : now > Number(endTime) * 1000 ? (
                <span style={{ color: "red" }}>Close</span>
              ) : (
                <span style={{ color: "green" }}>Opening</span>
              )}
            </div>
          </div>
          <div className="btn btn-primary capitalize mt-10 mb-4">Whitelist</div>
          <div className="btn" onClick={whiteMint}>
            Mint
          </div>
        </div>

        {/* 2  free mint */}
        <div
          className={`mt-6 mb-6 flex flex-col justify-around bg-base-200 bg-opacity-70 rounded-2xl shadow-lg px-5 py-4 }`}
        >
          <div className="flex justify-between w-full">
            <div>
              <strong>Status:</strong>
              {now < Number(startTime) * 1000 ? (
                <span style={{}}>Not started</span>
              ) : now > Number(endTime) * 1000 ? (
                <span style={{ color: "red" }}>Close</span>
              ) : (
                <span style={{ color: "green" }}>Opening</span>
              )}
            </div>
          </div>
          <div className="btn btn-primary capitalize mt-10 mb-4">Freelist</div>
          <div className="btn" onClick={freeMint}>
            Mint
          </div>
        </div>

        {/* 3  public mint */}
        <div className={`flex flex-col justify-around bg-base-200 bg-opacity-70 rounded-2xl shadow-lg px-5 py-4 }`}>
          <div className="flex justify-between w-full">
            <div>
              <strong>You can mint:</strong> &nbsp;
              {5 - Number(balanceof)}
            </div>
          </div>
          <div className="btn btn-primary capitalize mt-10 mb-4">Publiclist</div>
          <div className="btn" onClick={PublicMint}>
            Mint
          </div>
        </div>
      </div>
    </div>
  );
};
