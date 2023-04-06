const { time } = require("@nomicfoundation/hardhat-network-helpers")
const { ethers } = require("hardhat")
const { assert, expect } = require("chai")

describe("SE2H", function () {
    let deolpyer
    let SE2H
    let accounts
    const maxSupply = "5"
    const mintPrice = ethers.utils.parseEther("1")
    const timestamp = time.latest()
    const newTimestamp = time.increase(3600)

    beforeEach(async () => {
        accounts = await ethers.getSigners()
        deolpyer = accounts[0]
        const SE2HContract = await ethers.getContractFactory("SE2H")
        SE2H = await SE2HContract.deploy(maxSupply, mintPrice)
        await SE2H.deployed()
        await SE2H.setFreelistMerkleRoot(
            "0x2b85d524832129c6a94a63a0a02ef33b1bd4d48d10137036be706865852a14c2"
        )
        await SE2H.setWhitelistMerkleRoot(
            "0x975f9edd1da8a193f4281170fb2cb66be905a61001f063759188081df2ffb006"
        )
        await SE2H.setMintState()
    })

    describe("constructor", () => {
        it("MaxSupply,mintPrice is correct", async () => {
            assert.equal(await SE2H.getMaxSupply(), maxSupply)
            assert.equal(
                (await SE2H.getMintPrice()).toString(),
                mintPrice.toString()
            )
        })
    })

    describe("setFunc", () => {
        it("setReveal can set only once", async () => {
            await SE2H.setReveal()
            assert.equal(await SE2H.getReveal(), true)
            await expect(SE2H.setReveal()).to.be.reverted
        })
        it("Only owner can set", async () => {
            let player1 = accounts[1]
            const SE2H1 = await SE2H.connect(player1)
            await expect(SE2H1.setReveal()).to.be.reverted
            await expect(SE2H1.setMintTime(timestamp, newTimestamp)).to.be
                .reverted
            await expect(
                SE2H1.setFreelistMerkleRoot(
                    "0x2b85d524832129c6a94a63a0a02ef33b1bd4d48d10137036be706865852a14c2"
                )
            ).to.be.reverted
            await expect(
                SE2H1.setWhitelistMerkleRoot(
                    "0x975f9edd1da8a193f4281170fb2cb66be905a61001f063759188081df2ffb006"
                )
            ).to.be.reverted
            await expect(
                SE2H1.setNotRevealedURI(
                    "ipfs://QmRUAsEcEJZRYn8pjmyAgsDU5EYu2eAofYdX3qC9fo8yGd"
                )
            ).to.be.reverted
            await expect(
                SE2H1.setBaseURI(
                    "ipfs://QmRUAsEcEJZRYn8pjmyAgsDU5EYu2eAofYdX3qC9fo8yGd"
                )
            ).to.be.reverted
            await expect(SE2H1.setMintState()).to.be.reverted
            await expect(SE2H1.withdraw()).to.be.reverted
        })
        it("Set mint time correctly", async () => {
            await SE2H.setMintTime(timestamp, newTimestamp)
            assert.equal(await SE2H.getMintStartTime(), await timestamp)
            assert.equal(await SE2H.getMintEndTime(), await newTimestamp)
        })
        it("Start time cannot be later than end time", async () => {
            await expect(SE2H.setMintTime(newTimestamp, timestamp)).to.be
                .reverted
        })
    })

    describe("Freelist mint", () => {
        it("It will get MintIsOver() if end time is after block time", async () => {
            await SE2H.setMintTime()
            await expect(
                SE2H.freelistMint([
                    "0x975f9edd1da8a193f4281170fb2cb66be905a61001f063759188081df2ffb006",
                ])
            ).to.be.reverted
        })
        it("It will get MintNotStart() if start time is before block time", async () => {
            await SE2H.setMintTime()
            await expect(
                SE2H.freelistMint([
                    "0x975f9edd1da8a193f4281170fb2cb66be905a61001f063759188081df2ffb006",
                ])
            ).to.be.reverted
        })
    })
})
