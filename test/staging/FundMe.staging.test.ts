import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { network, deployments, ethers, getNamedAccounts } from "hardhat"
import { developmentChains } from "../../helper-hardhat-config"
import { assert } from "chai"
import { FundMe } from "../../typechain-types"

developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe Staging Tests", async function () {
          let fundMe: FundMe
          let deployer: SignerWithAddress
          const sendValue = ethers.utils.parseEther("1")

          this.beforeEach(async function () {
              const accounts = await ethers.getSigners()
              deployer = accounts[0]
              fundMe = await ethers.getContract("FundMe", deployer)
          })

          it("allows people to fund and withdraw", async function () {
              await (await fundMe.fund({ value: sendValue })).wait(1)
              await (
                  await fundMe.withdraw({
                      gasLimit: 100000,
                  })
              ).wait(1)
              const endingFundMeBalance = await fundMe.provider.getBalance(
                  fundMe.address
              )
              assert.equal(endingFundMeBalance.toString(), "0")
          })
      })
