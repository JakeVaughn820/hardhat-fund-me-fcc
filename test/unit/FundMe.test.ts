import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { network, deployments, ethers } from "hardhat"
import { developmentChains } from "../../helper-hardhat-config"
import { assert, expect } from "chai"
import { FundMe, MockV3Aggregator } from "../../typechain-types"

describe("FundMe", async function () {
    let fundMe: FundMe
    let deployer: SignerWithAddress
    let MockV3Aggregator: MockV3Aggregator
    const sendValue = ethers.utils.parseEther("1") // 1 ETH
    beforeEach(async () => {
        if (!developmentChains.includes(network.name)) {
            throw "You need to be on a development chain to run tests"
        }
        // deploy fundMe contract using Hardhat-deploy
        const accounts = await ethers.getSigners()
        deployer = accounts[0]
        await deployments.fixture(["all"])
        fundMe = await ethers.getContract("FundMe", deployer)
        MockV3Aggregator = await ethers.getContract(
            "MockV3Aggregator",
            deployer
        )
    })

    describe("constructor", async function () {
        it("sets the aggregator addresses correctly", async function () {
            const response = await fundMe.priceFeed()
            assert.equal(response, MockV3Aggregator.address)
        })
    })

    describe("fund", async function () {
        it("Fails if you don't send enough eth", async function () {
            await expect(fundMe.fund()).to.be.revertedWith(
                "You need to spend more ETH!"
            )
        })

        it("Updates the amount funded data structure", async function () {
            await fundMe.fund({ value: sendValue })
            const response = await fundMe.addressToAmountFunded(
                deployer.address
            )
            assert.equal(response.toString, sendValue.toString)
        })
        it("Adds funder to array of funders", async () => {
            await fundMe.fund({ value: sendValue })
            const response = await fundMe.funders(0)
            assert.equal(response, deployer.address)
        })
    })

    describe("withdraw", async function () {
        beforeEach(async () => {
            await fundMe.fund({ value: sendValue })
        })
        it("", async function () {
            await expect(fundMe.fund()).to.be.revertedWith(
                "You need to spend more ETH!"
            )
        })
    })
})
