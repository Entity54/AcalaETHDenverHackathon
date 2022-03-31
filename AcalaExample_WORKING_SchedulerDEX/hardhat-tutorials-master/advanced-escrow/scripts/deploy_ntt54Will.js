const { txParams } = require("../utils/transactionHelper");

async function main() {
  const ethParams = await txParams();

  const [deployer] = await ethers.getSigners();

  const ntt54Will = await ethers.getContractFactory("ntt54Will");
  const instance = await ntt54Will.deploy({
    gasPrice: ethParams.txGasPrice,
    gasLimit: ethParams.txGasLimit,
  });

  console.log("ntt54Will address:", instance.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });





// ntt54Will address: 0x4Ce1ee445AA4aF326B2771472684361D2e797eBd 

// ntt54Will address: 0x976580Dc40D23fB656ef2b0D192FD11a668aa7D6

//ADVANCED WITH DEX and Swaps working
// ntt54Will address: 0xCF478CE73aA2f3a94A0F0374DaF1c18f76892737

//ADVANCED WITH DEX and Swaps working Checking releaseWill  admin F512
// ntt54Will address: 0xDEbA5d1d978E53dc5577218a803583b817542151 HAS ISSUES

//Back to Bet account
// ntt54Will address: 0x1d6Fb955FD98Fe94E3345c243C4103Dc59d057Ea
// ntt54Will address: 0xF51C0A526dc72EcF8b6563C2e600B50fe1Ed68C8
// ntt54Will address: 0x9f8FFc97EeA1c15C0A51E1E824743179Da16B34E

// ntt54Will address: 0xf1A112f1f4fe25818df1F79f51F6578830382B3c

// ntt54Will address: 0xCaF7EA87Da50887D8723fCef23B3c0A5826f0Dc6

// ntt54Will address: 0x36aA095b9E0F8256f411F6e562E715564BA6a63F


// ntt54Will address: 0x1243B8F9fBeFf697969F09aed793E2E761D691F0

//WORKING FOR ALL STEPS
// ntt54Will address: 0x2aee99D71a1629eAd4F7E078e0A16B142267c40A

//WITH SCHEDULER
// ntt54Will address: 0xD859d8fad7F57aE773D652b5811a37a43B77De9a
// ntt54Will address: 0x65664f977A6807886735180Bb43897F61A819599





// ****** SUCCESFUL ******  
// ntt54Will address: 0xd66d0E6ccA5825eC3fEdbe4CAac301A9d79A30a0    USED AND RESET
// ntt54Will address: 0xD98d06454590B1508dFf6F3DDb63594A89fD28Bd    BLANK CURRENT
// ntt54Will address: 0xBa1E11f88dB6eE40bD8D4EE8D351110aa7EDe0E2    BLANK READY FOR USE
// ntt54Will address: 0x0e8cE392033E23a31c005a7F96F3De4CCFA39DcE    BLANK READY FOR USE
// ntt54Will address: 0x5F95f0cB00c03ED14E31011a879029D2987c3Ab4     BLANK READY FOR USE




