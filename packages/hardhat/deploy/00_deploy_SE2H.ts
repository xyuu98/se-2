import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
// import { time } from "@nomicfoundation/hardhat-network-helpers"

/**
 * Deploys a contract named "SE2H" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deploySE2H: DeployFunction = async function (
    hre: HardhatRuntimeEnvironment
) {
    /*
    On localhost, the deployer account is the one that comes with Hardhat, which is already funded.

    When deploying to live networks (e.g `yarn deploy --network goerli`), the deployer account
    should have sufficient balance to pay for the gas fees for contract creation.

    You can generate a random account with `yarn generate` which will fill DEPLOYER_PRIVATE_KEY
    with a random private key in the .env file (then used on hardhat.config.ts)
    You can run the `yarn account` command to check your balance in every network.
  */
    const { deployer } = await hre.getNamedAccounts()
    const { deploy } = hre.deployments

    await deploy("SE2H", {
        from: deployer,
        // Contract constructor arguments
        args: ["20", "100000000000000000"],
        log: true,
        // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
        // automatically mining the contract deployment transaction. There is no effect on live networks.
        autoMine: true,
        waitConfirmations: 1,
    })

    // Get the deployed contract
    const SE2H = await hre.ethers.getContract("SE2H", deployer)
    //Set uri
    await SE2H.setNotRevealedURI(
        "ipfs://QmRUAsEcEJZRYn8pjmyAgsDU5EYu2eAofYdX3qC9fo8yGd/"
    )
    // await SE2H.setBaseURI(
    //     "ipfs://QmQpPgQaxhcaLsrAWiqTLNzBpXsfeGx9xdM2o8ZAG5xHyW/"
    // )
    await SE2H.setFreelistMerkleRoot(
        "0x8527c842a3751c5a160fea7402d1ee111e8b615882f52cfe2235093f30d4d8d2"
    )
    await SE2H.setWhitelistMerkleRoot(
        "0x41f8b0811f71cfa28beff1bda2fc1644f0568541fcf57da5006c818c3ac7b6d9"
    )
    // await SE2H.setMintTime(time.latest(), time.increase(3600))
    // await SE2H.setMintState()
}

// ["0x00314e565e0574cb412563df634608d76f5c59d9f817e85966100ec1d48005c0","0x975f9edd1da8a193f4281170fb2cb66be905a61001f063759188081df2ffb006","0x1d2c6d0de38c77d2a15f6d241121ec032404625e87566d8a742d3dc2f924263d"]

export default deploySE2H

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags SE2H
deploySE2H.tags = ["all", "SE2H"]
