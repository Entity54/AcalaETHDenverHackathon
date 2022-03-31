 //***** Smart Contract Address *****/
 const scAddress = "0xD98d06454590B1508dFf6F3DDb63594A89fD28Bd";   
 //*****/

const { calcEthereumTransactionParams } = require("@acala-network/eth-providers");
const { ACA, AUSD, DOT } = require("@acala-network/contracts/utils/Address");
const { Contract } = require("ethers");
const { formatUnits, parseUnits } = require("ethers/lib/utils");

const TokenContract = require("@acala-network/contracts/build/contracts/Token.json");
// const ntt54_boilerSchedule = require("../artifacts/contracts/ntt54_boilerSchedule.sol/ntt54_boilerSchedule.json");
const ntt54WillArtifact = require("../artifacts/contracts/ntt54Will.sol/ntt54Will.json");

 
const txFeePerGas = '199999946752';
const storageByteDeposit = '100000000000000';


async function main() {

  let blockNumber = await ethers.provider.getBlockNumber();
  const ethParams = calcEthereumTransactionParams({
    gasLimit: '21000010',
    validUntil: (blockNumber + 100).toString(),
    storageLimit: '640010',
    txFeePerGas,
    storageByteDeposit
  });

  //Instantiate smart contract
  console.log("Getting signers");
  const [initiator, initiator2] = await ethers.getSigners();
  const initiatorAddress = await initiator.getAddress();
  const initiator2Address = await initiator2.getAddress();

  console.log(`Address of the initiator is: ${initiatorAddress} initiator2Address: ${initiator2Address}`);
  
  const instance = new Contract(scAddress, ntt54WillArtifact.abi, initiator);
  console.log("ntt54Will is deployed at address:", instance.address);


  const willAdmin = await instance.willAdmin();
  let willState = await instance.willState();
  console.log(`willAdmin: ${willAdmin} willState:${willState}`);

  // console.log("setting willState");
  // let setWillState = await instance.setWillState(false);
  // willState = await instance.willState();
  // console.log(`willAdmin: ${willAdmin} willState:${willState}`);


  // function setWill(string memory message, uint _trigger_dt1, 
    // uint _trigger_dt2, uint _trigger_dt3, uint _lastCall_dt4) external returns(bool){

  //********* */  
  // let tx = await instance.setWill_2("Hello29", 10, 5, 4, 3);
  // let tx = await instance.setWill("Helo 54", 10, 5, 4, 3);





  // let tx2 = await instance.setWillGeneralMessage("Hello folks. Thats is all. Enjoyed Substrate and Solidity");
  // console.log(`General Message has now been stored. Moving on to setWill`);

  // let tx = await instance.setWill(10, 5, 4, 3);

  // console.log("setting willState");

  // let setWillState = await instance.setWillState(true);
  // willState = await instance.willState();
  // console.log(`willAdmin: ${willAdmin} willState:${willState}`);
  //********* */  


  // console.log(`setWill is run`);

  // let willIssueBlockNum = await instance.willIssueBlockNum();
  // console.log(`willIssueBlockNum: ${willIssueBlockNum} is run`);
  // let willIssueTimeStamp = await instance.willIssueTimeStamp();
  // console.log(`willIssueTimeStamp: ${willIssueTimeStamp} is run`);

  // let willGeneralMessage = await instance.willGeneralMessage();
  // console.log(`willGeneralMessage: ${willGeneralMessage} is run`);

  // let trigger_dt1 = await instance.trigger_dt1();
  // console.log(`trigger_dt1: ${trigger_dt1.toString()} is run`);

  // let trigger_dt2 = await instance.trigger_dt2();
  // console.log(`trigger_dt2: ${trigger_dt2.toString()} is run`);

  // let trigger_dt3 = await instance.trigger_dt3();
  // console.log(`trigger_dt3: ${trigger_dt3.toString()} is run`);

  // let lastCall_dt4 = await instance.lastCall_dt4();
  // console.log(`lastCall_dt4: ${lastCall_dt4.toString()} is run`);

  // let triggerPoint1 = await instance.triggerPoint1();
  // console.log(`triggerPoint1: ${triggerPoint1.toString()} is run`);

  // let triggerPoint2 = await instance.triggerPoint2();
  // console.log(`triggerPoint2: ${triggerPoint2.toString()} is run`);

  // let triggerPoint3 = await instance.triggerPoint3();
  // console.log(`triggerPoint3: ${triggerPoint3.toString()} is run`);

  
}

main()
  .then(() => {
    // process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    // process.exit(1);
  });