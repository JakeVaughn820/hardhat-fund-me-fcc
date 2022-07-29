// deploy/00_deploy_fund-me.ts
import { DeployFunction } from "hardhat-deploy/types"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import { developmentChains, networkConfig } from "../helper-hardhat-config"
import verify from "../utils/verify"

const deployFundMe: DeployFunction = async function ({
    getNamedAccounts,
    deployments,
    network,
}: HardhatRuntimeEnvironment) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    let ethUsdPriceFeedAddress: string

    // if the contract doesn't exist, we deploy a minimal version of
    // it for our local testing
    if (developmentChains.includes(network.name)) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[network.name]["ethUsdPriceFeed"]!
    }

    // Deploy FundMe
    log("----------------------------------------------------")
    log("Deploying FundMe and waiting for confirmations...")
    const args = [ethUsdPriceFeedAddress]
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: args, //Price Feed Address
        log: true,
        waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
    })
    log(`FundMe deployed at ${fundMe.address}`)
    log("----------------------------------------------------")

    // Verify FundMe on EtherScan
    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        // verify
        await verify(fundMe.address, args)
    }
}

export default deployFundMe
deployFundMe.tags = ["all", "fundme"]
