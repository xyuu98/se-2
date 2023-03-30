const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");

let whitelistAddress = ["0x3D64FB07e24a6543c3A5B9c08a55122910f67655", "0x45821AF32F0368fEeb7686c4CC10B7215E00Ab04"];
let freelistAddress = ["0x3D64FB07e24a6543c3A5B9c08a55122910f67655", "0x45821AF32F0368fEeb7686c4CC10B7215E00Ab04"];

const whiteListLeafNodes = whitelistAddress.map(addr => keccak256(addr));
const freeListLeafNodes = freelistAddress.map(addr => keccak256(addr));
const whiteListMerkleTree = new MerkleTree(whiteListLeafNodes, keccak256, { sortPairs: true });
const freeListMerkleTree = new MerkleTree(freeListLeafNodes, keccak256, { sortPairs: true });

// console.log("Whitelist Merkle Tree\n", whitelistMerkleTree.toString());

function getWhitelistRootHash() {
  const whiteListRootHash = whiteListMerkleTree.getHexRoot();
  return whiteListRootHash;
}

function getFreelistRootHash() {
  const freeListRootHash = freeListMerkleTree.getHexRoot();
  return freeListRootHash;
}

function getWhitelistProof(wAddress) {
  const wIndex = whitelistAddress.findIndex(wAddress);
  const wClaimAddress = whiteListLeafNodes[wIndex];
  const wHexProof = whiteListMerkleTree.getHexProof(wClaimAddress);
  //   console.log(`whiteList Proof for Address - leafNodes[${index}]\n`, hexProof);
  return wHexProof;
}

function getFreelistProof(fAddress) {
  const fIndex = whitelistAddress.findIndex(fAddress);
  const fClaimAddress = freeListLeafNodes[fIndex];
  const fHexProof = freeListMerkleTree.getHexProof(fClaimAddress);
  //   console.log(`freeList Proof for Address - leafNodes[${index}]\n`, hexProof);
  return fHexProof;
}
