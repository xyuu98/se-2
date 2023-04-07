const { MerkleTree } = require("merkletreejs")
const keccak256 = require("keccak256")

// account[5-9]
let whitelistAddress = [
    "0x3D64FB07e24a6543c3A5B9c08a55122910f67655",
    "0x45821AF32F0368fEeb7686c4CC10B7215E00Ab04",
    "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc",
    "0x976EA74026E726554dB657fA54763abd0C3a0aa9",
    "0x14dC79964da2C08b23698B3D3cc7Ca32193d9955",
    "0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f",
    "0xa0Ee7A142d267C1f36714E4a8F75612F20a79720",
]
// account[0-4]
let freelistAddress = [
    "0x3D64FB07e24a6543c3A5B9c08a55122910f67655",
    "0x45821AF32F0368fEeb7686c4CC10B7215E00Ab04",
    "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
    "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
]

const whiteListLeafNodes = whitelistAddress.map((addr) => keccak256(addr))
const freeListLeafNodes = freelistAddress.map((addr) => keccak256(addr))
const whiteListMerkleTree = new MerkleTree(whiteListLeafNodes, keccak256, {
    sortPairs: true,
})
const freeListMerkleTree = new MerkleTree(freeListLeafNodes, keccak256, {
    sortPairs: true,
})

// console.log("Whitelist Merkle Tree\n", whitelistMerkleTree.toString());

function getWhitelistRootHash() {
    const whiteListRootHash = whiteListMerkleTree.getHexRoot()
    return whiteListRootHash
}

function getFreelistRootHash() {
    const freeListRootHash = freeListMerkleTree.getHexRoot()
    return freeListRootHash
}

function getWhitelistProof(wAddress) {
    const wIndex = whitelistAddress.indexOf(wAddress)
    const wClaimAddress = whiteListLeafNodes[wIndex]
    const wHexProof = whiteListMerkleTree.getHexProof(wClaimAddress)
    //   console.log(`whiteList Proof for Address - leafNodes[${index}]\n`, hexProof);
    return wHexProof
}

function getFreelistProof(fAddress) {
    const fIndex = freelistAddress.indexOf(fAddress)
    const fClaimAddress = freeListLeafNodes[fIndex]
    const fHexProof = freeListMerkleTree.getHexProof(fClaimAddress)
    //   console.log(`freeList Proof for Address - leafNodes[${index}]\n`, hexProof);
    return fHexProof
}

console.log(`Whitelist Root: ${getWhitelistRootHash()}`)
console.log(`Freelist Root: ${getFreelistRootHash()}`)

console.log(
    `Freelist Proof: ${getFreelistProof(
        "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
    )}`
)

module.exports = {
    getWhitelistRootHash,
    getFreelistRootHash,
    getWhitelistProof,
    getFreelistProof,
}

0x00314e565e0574cb412563df634608d76f5c59d9f817e85966100ec1d48005c0,
    0x975f9edd1da8a193f4281170fb2cb66be905a61001f063759188081df2ffb006,
    0x1d2c6d0de38c77d2a15f6d241121ec032404625e87566d8a742d3dc2f924263d
