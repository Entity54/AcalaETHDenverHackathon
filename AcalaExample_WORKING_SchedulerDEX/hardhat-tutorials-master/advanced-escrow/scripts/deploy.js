const { txParams } = require("../utils/transactionHelper");

async function main() {
  const ethParams = await txParams();

  const [deployer] = await ethers.getSigners();

  const AdvancedEscrow = await ethers.getContractFactory("AdvancedEscrow");
  const instance = await AdvancedEscrow.deploy({
    gasPrice: ethParams.txGasPrice,
    gasLimit: ethParams.txGasLimit,
  });

  console.log("AdvancedEscrow address:", instance.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

// AdvancedEscrow is deployed at address: 0x9793Ed0ebeAC0122e0a6F87A4A8b2fec293100d2