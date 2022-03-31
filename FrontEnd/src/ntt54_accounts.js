//IT WORKS BUT HAVE TO CHANGE THE ADDRESS TO // const DEX = '0x0000000000000000000000000000000000000804'; 
import { ACA, AUSD, DEX, Schedule, Oracle, EVM, DOT, LP_ACA_AUSD, LP_DOT_AUSD, LP_LDOT_AUSD, LP_RENBTC_AUSD, LDOT, RENBTC }  from '@acala-network/contracts/utils/Address';
import { Contract } from 'ethers';
import { ethers } from 'ethers';  
import { formatUnits, parseUnits } from 'ethers/lib/utils';

import TokenContract from '@acala-network/contracts/build/contracts/Token.json';

// const DEXContract = require("@acala-network/contracts/build/contracts/DEX.json");
// const TokenContract = require("@acala-network/contracts/build/contracts/Token.json")
// const { formatUnits, parseUnits } = require("ethers/lib/utils");

import ntt54Will_raw from './Abis/ntt54Will';       
// ************ ntt54Will ************
// const ntt54Will_address = "0xd66d0E6ccA5825eC3fEdbe4CAac301A9d79A30a0";
const ntt54Will_address = "0xD98d06454590B1508dFf6F3DDb63594A89fD28Bd";
// ************ ntt54Will ************


let willAdmin, wallet, provider, ntt54Will;
let ACAinstance, AUSDinstance, DOTinstance, LDOTinstance, RENBTCinstance;
let tokenInstances = { 
      ACA   : ACAinstance, 
      AUSD  : AUSDinstance, 
      DOT   : DOTinstance,
      LDOT  : LDOTinstance, 
      RENBTC: RENBTCinstance 
};
const tokensArray = [ "ACA", "AUSD", "DOT", "LDOT", "RENBTC"];
const tokens= { ACA, AUSD, DOT, LDOT, RENBTC };






// const setInstances = async (_wallet, _ntt54Will, ACAinstance, AUSDinstance, DOTinstance, LDOTinstance, RENBTCinstance) => {
const setInstances = async (_willAdmin, _wallet, _provider, _ntt54Will) => {
  willAdmin = _willAdmin;
  wallet    = _wallet; 
  provider  = _provider;
  ntt54Will = _ntt54Will;

  // ntt54Will = _ntt54Will;
  console.log(`Setting instances for new wallet with address ${await wallet.getAddress()} `)
  // DEXinstance     = new Contract(DEX    , DEXContract.abi  , wallet);
  // ntt54Will       = new Contract(ntt54Will_address    , ntt54Will_raw.abi  , wallet);

  ACAinstance     = new Contract(ACA    , TokenContract.abi, wallet);
  AUSDinstance    = new Contract(AUSD   , TokenContract.abi, wallet);
  DOTinstance     = new Contract(DOT    , TokenContract.abi, wallet);
  LDOTinstance    = new Contract(LDOT   , TokenContract.abi, wallet);
  RENBTCinstance  = new Contract(RENBTC , TokenContract.abi, wallet);

  tokenInstances = { 
                    ACA   : ACAinstance, 
                    AUSD  : AUSDinstance, 
                    DOT   : DOTinstance,
                    LDOT  : LDOTinstance, 
                    RENBTC: RENBTCinstance 
                   };

  getBasicInfo();
}

const getBasicInfo = async () => {
  const willAdmin = await ntt54Will.willAdmin();
  // const treasuryAddress = await ntt54Will.treasuryAddress();
  const WILLFEES = await ntt54Will.WILLFEES();
  const PROJECTFEES = await ntt54Will.PROJECTFEES();
  console.log(` ****** ntt54Will admin: ${willAdmin} WILLFEES:${WILLFEES} PROJECTFEES:${PROJECTFEES} ****** `);

}

const get_AccountNonce = async (account, provider) => {
  console.log(`Runnning get_AccountNonce`);
  const nonce = await provider.getTransactionCount(account);
  console.log(`Runnning get_AccountNonce For account: ${account} nonce: ${nonce}`);
  return nonce;
}

const get_SmartContractNonce = async (provider) => {
  const nonce = await get_AccountNonce(ntt54Will_address, provider );
  return nonce;
}

const get_AdminAccounts = async (provider, ntt54Will) => {
  console.log("Running get_AdminAccounts");
  // const adminAccountsArray = await ntt54Will.adminAccounts[0];
  const adminAccountsArray = await ntt54Will.getAdminAccounts(); 

  let adminAccNonce = [];
  if (adminAccountsArray && adminAccountsArray.length>0)
  {
    for (let i=0; i<adminAccountsArray.length; i++)
    {
      const nonce = await get_AccountNonce(adminAccountsArray[i], provider);
      adminAccNonce.push({address: adminAccountsArray[i], nonce, status:"Registered"});
    }
  }
  console.log(`get_AdminAccounts => adminAccountsArray: `,adminAccountsArray);
  console.log(`get_AdminAccounts => adminAccNonce: `,adminAccNonce);

  return {adminAccountsArray, adminAccNonce, };
}

const get_RegisteredERC20 = async () => {
  console.log("Running get_RegisteredERC20");
  const assetsERC20sArray = await ntt54Will.getAssetsERC20s(); 
  console.log(`get_RegisteredERC20 => assetsERC20sArray: `,assetsERC20sArray);
  return assetsERC20sArray;
}

const get_WillBeneficiaries = async (ntt54Will) => {
  console.log("Running get_WillBeneficiaries");
  const willBeneficiariesArray = await ntt54Will.getWillBeneficiaries(); 
  console.log(`get_WillBeneficiaries => willBeneficiariesArray: `,willBeneficiariesArray);
  return willBeneficiariesArray;
}

const get_RegisteredAccountTokenAllowance = async (account) => {
  console.log("Running get_RegisteredAccountTokenAllowance");
  const allowance_ACA_WEI = await ntt54Will.getRegisteredAccountTokenAllowance(account, ACA); 
  const allowance_AUSD_WEI = await ntt54Will.getRegisteredAccountTokenAllowance(account, AUSD); 
  const allowance_DOT_WEI = await ntt54Will.getRegisteredAccountTokenAllowance(account, DOT); 
  const allowance_LDOT_WEI = await ntt54Will.getRegisteredAccountTokenAllowance(account, LDOT); 
  const allowance_RENBTC_WEI = await ntt54Will.getRegisteredAccountTokenAllowance(account, RENBTC); 

  const allowance_ACA    = formatUnits(allowance_ACA_WEI.toString()   , 12);
  const allowance_AUSD   = formatUnits(allowance_AUSD_WEI.toString()  , 12);
  const allowance_DOT    = formatUnits(allowance_DOT_WEI.toString()   , 10);
  const allowance_LDOT   = formatUnits(allowance_LDOT_WEI.toString()  , 10);
  const allowance_RENBTC = formatUnits(allowance_RENBTC_WEI.toString(), 12);

  console.log(`get_RegisteredAccountTokenAllowance has finished`);
  return [
    { ACA: allowance_ACA}, { AUSD: allowance_AUSD}, { DOT: allowance_DOT}, { LDOT: allowance_LDOT}, { RENBTC: allowance_RENBTC}
  ]
}


const getSmartContractFeesBalances = async (ntt54Will, willAdmin) => {
  if (willAdmin && ntt54Will)
  {
    console.log("Getting smart contract balances Please wait");
    const ACA_BalanceWEI   = await ntt54Will.feesBalances(ACA, willAdmin);
    const AUSD_BalanceWEI  = await ntt54Will.feesBalances(AUSD, willAdmin);
    const ACA_Balance      = formatUnits(ACA_BalanceWEI.toString()   , 12);
    const AUSD_Balance     = formatUnits(AUSD_BalanceWEI.toString()  , 12);
    return [{ name:"Acala", ticker: "ACA", NumTokens: ACA_Balance, value: "0", status: "deposited" }, { name:"Acala Dollar", ticker: "AUSD", NumTokens: AUSD_Balance, value: "0", status: "staked" } ]
  }
  else return null;
}


const getSmartContractAllBalances = async (ntt54Will) => {
  const balancesArray = await getAccountBalances(ntt54Will_address, ntt54Will);
  return balancesArray;
}

const getAdminFeeTokensBalances = async (willAdmin) => {
  if (willAdmin)
  {
    console.log("Getting smart contract balances Please wait");
    const ACA_BalanceWEI   = await ACAinstance.balanceOf(willAdmin);
    const AUSD_BalanceWEI  = await AUSDinstance.balanceOf(willAdmin);
    const ACA_Balance      = formatUnits(ACA_BalanceWEI.toString()   , 12);
    const AUSD_Balance     = formatUnits(AUSD_BalanceWEI.toString()  , 12);
    return [{ ticker: "ACA", NumTokens: ACA_Balance }, { ticker: "AUSD", NumTokens: AUSD_Balance } ]
  }
  else return null;
}


const getAccountBalances = async (accountAddress, ntt54Will) => {
  if (accountAddress && ntt54Will)
  {
    console.log("Getting account Balances Please wait");
    const ACA_BalanceWEI    = await ACAinstance.balanceOf(accountAddress);
    const AUSD_BalanceWEI   = await AUSDinstance.balanceOf(accountAddress);
    const DOT_BalanceWEI    = await DOTinstance.balanceOf(accountAddress);
    const LDOT_BalanceWEI   = await LDOTinstance.balanceOf(accountAddress);
    const RENBTC_BalanceWEI = await RENBTCinstance.balanceOf(accountAddress);

    const ACA_Balance    = formatUnits(ACA_BalanceWEI.toString()   , 12);
    const AUSD_Balance   = formatUnits(AUSD_BalanceWEI.toString()  , 12);
    const DOT_Balance    = formatUnits(DOT_BalanceWEI.toString()   , 10);
    const LDOT_Balance   = formatUnits(LDOT_BalanceWEI.toString()  , 10);
    const RENBTC_Balance = formatUnits(RENBTC_BalanceWEI.toString(), 12);
    console.log("Received account Balances.");

    console.log("Running get_RegisteredAccountTokenAllowance");
    const allowance_ACA_WEI = await ntt54Will.getRegisteredAccountTokenAllowance(accountAddress, ACA); 
    const allowance_AUSD_WEI = await ntt54Will.getRegisteredAccountTokenAllowance(accountAddress, AUSD); 
    const allowance_DOT_WEI = await ntt54Will.getRegisteredAccountTokenAllowance(accountAddress, DOT); 
    const allowance_LDOT_WEI = await ntt54Will.getRegisteredAccountTokenAllowance(accountAddress, LDOT); 
    const allowance_RENBTC_WEI = await ntt54Will.getRegisteredAccountTokenAllowance(accountAddress, RENBTC); 

    const allowance_ACA    = formatUnits(allowance_ACA_WEI.toString()   , 12);
    const allowance_AUSD   = formatUnits(allowance_AUSD_WEI.toString()  , 12);
    const allowance_DOT    = formatUnits(allowance_DOT_WEI.toString()   , 10);
    const allowance_LDOT   = formatUnits(allowance_LDOT_WEI.toString()  , 10);
    const allowance_RENBTC = formatUnits(allowance_RENBTC_WEI.toString(), 12);
    console.log(`get_RegisteredAccountTokenAllowance has finished`);

    const status_ACA    = await ntt54Will.registeredAccountToken(accountAddress , ACA);
    const status_AUSD   = await ntt54Will.registeredAccountToken(accountAddress , AUSD);
    const status_DOT    = await ntt54Will.registeredAccountToken(accountAddress , DOT);
    const status_LDOT   = await ntt54Will.registeredAccountToken(accountAddress , LDOT);
    const status_RENBTC = await ntt54Will.registeredAccountToken(accountAddress , RENBTC);

    return [
      { name:"Acala", ticker: "ACA", NumTokens: ACA_Balance, value: "0", allowance: allowance_ACA, status: status_ACA }, { name:"Acala Dollar", ticker: "AUSD", NumTokens: AUSD_Balance, value: "0",  allowance: allowance_AUSD, status: status_AUSD }, { name:"Polkadot", ticker: "DOT", NumTokens: DOT_Balance, value: "0",  allowance: allowance_DOT, status: status_DOT },
      { name:"Liquid DOT", ticker: "LDOT", NumTokens: LDOT_Balance, value: "0",  allowance: allowance_LDOT, status: status_LDOT }, { name:"Ren Bitcoin", ticker: "RENBTC", NumTokens: RENBTC_Balance, value: "0",  allowance: allowance_RENBTC, status: status_RENBTC }
    ]
  }
  else return null;

}

const getAccount_ACA_Balance = async (accountAddress) => {
  if (accountAddress)
  {
    console.log("Getting account ACA Balance Please wait");
    const ACA_BalanceWEI = await ACAinstance.balanceOf(accountAddress);
    const ACA_Balance    = formatUnits(ACA_BalanceWEI.toString()   , 12);
    return ACA_Balance;
  }
  else return null;
}


const getRegisteredAccount_ACA_Balance = async (accountAddress, ntt54Will) => {
  if (accountAddress && ntt54Will)
  {
    console.log("Getting registered account ACA Balance Please wait");
    const ACA_BalanceWEI = await ntt54Will.registeredAccountsBalance(accountAddress);
    const ACA_Balance    = formatUnits(ACA_BalanceWEI.toString()   , 18);
    return ACA_Balance;
  }
  else return null;
}


const approveERC20forSC = async (tokenTicker) => {
  console.log(`approveERC20forSC  Running approve for tokenTicker:${tokenTicker}`);
  return new Promise( async (resolve,reject) => {
    const tx = await tokenInstances[tokenTicker].approve(ntt54Will_address, "123456789654321");
    const account = await wallet.getAddress();
    tx.wait().then( message => {
       console.log(`approveERC20forSC from account:${account} has been completed message: `,message);
       resolve(message);
    })
    .catch( error => reject(error));

  })
}

const registerNewOwnerAccount = async (newAccountAddress, provider, ntt54Will) => {
  console.log("Running registerNewOwnerAccount");

  return new Promise( async (resolve,reject) => {
    const {adminAccountsArray} = await get_AdminAccounts(provider, ntt54Will);
    console.log(`We are now going to check if account ${newAccountAddress} to be registered is already registered here adminAccountsArray: `,adminAccountsArray);

    if (adminAccountsArray && adminAccountsArray.length > 0)
    {
      const accountFound = adminAccountsArray.find( element => element.toLowerCase() === newAccountAddress.toLowerCase());
      if (accountFound)
      {
        console.log(`Account ${newAccountAddress} has already been registered. It will not nbe registered again`);
        resolve(null);
        return;
      }
    }

    const tx = await ntt54Will.registerOwnerAccounts(newAccountAddress);
    tx.wait().then( message => {
      console.log(`registerNewOwnerAccount Account ${newAccountAddress} has been added to registerNewOwnerAccount message: `,message);
      resolve(message);
    })
    .catch( error => reject(error));

  })
}


const registerAccountToken = async (accountAddress, ticker,  ntt54Will) => {
  const tokenAddress = tokens[ticker];
  console.log(`Running registerAccountToken for ticker:${ticker} with tokenAddress:${tokenAddress}`);

  return new Promise( async (resolve,reject) => {
    
    const isAccountRegistered = await ntt54Will.registeredAccounts(accountAddress);
    console.log(`Account: ${accountAddress} isAccountRegistered:${isAccountRegistered}`);
    if (!isAccountRegistered)
    {
      console.log(`Account ${accountAddress} is not registered, so we cannot register any ERC20s`)
      resolve(null);
      return;
    }
     
    console.log(`Account ${accountAddress} is registered, so we can proceed and register any ERC20s`)
    const tx = await ntt54Will.registerAccountTokens(accountAddress, tokenAddress);
    tx.wait().then( message => {
      console.log(`registerAccountToken Account ${accountAddress} has registered: ${tokenAddress} message: `,message);
      resolve(message);
    })
    .catch( error => reject(error));

  })
}


const depositFees = async (ticker, amount,  ntt54Will) => {
  const tokenAddress = tokens[ticker];
  const amountWEI = parseUnits(amount,12);
  console.log(`Running depositFees for ticker:${ticker} with tokenAddress:${tokenAddress} amountWEI:${amountWEI} amount:${amount}`);

  return new Promise( async (resolve,reject) => {
    const tx = await ntt54Will.depositFees(tokenAddress, amountWEI);
    tx.wait().then( message => {
      console.log(`deposited fees for ticker:${ticker} tokenAddress:${tokenAddress} message: `,message);
      resolve(message);
    })
    .catch( error => reject(error));

  })
}


const addNewBeneficiary = async (beneficiaryAddress, beneneficiaryNickname, finalMessage, cashPercent, nftAssetAddress, multisig1, multisig2, multisig3, ntt54Will) => {
  const cashPercentWEI = parseInt(cashPercent); //parseUnits(cashPercent, 12);
  const assetAddress = nftAssetAddress===""? "0x0000000000000000000000000000000000000000" :nftAssetAddress;
  console.log(`Running addNewBeneficiary ${beneficiaryAddress} ${beneneficiaryNickname} ${finalMessage} ${assetAddress} for cashPercentWEI:${cashPercentWEI} nftAssetAddress:${nftAssetAddress} multisig1:${multisig1} multisig2:${multisig2} multisig3:${multisig3}`);

  return new Promise( async (resolve,reject) => {
    const tx = await ntt54Will.addWillBeneficiary(beneficiaryAddress, beneneficiaryNickname, finalMessage, cashPercentWEI, assetAddress );
    tx.wait().then( message => {
      console.log(`addNewBeneficiary beneficiaryAddress ${beneficiaryAddress} has been added message: `,message);
      resolve(message);
    })
    .catch( error => reject(error));

  })
}

const amendWillBeneficiaryCash = async (beneficiaryAddress, beneneficiaryNickname, finalMessage, cashPercent, nftAssetAddress, multisig1, multisig2, multisig3, ntt54Will) => {
  const cashPercentWEI = parseInt(cashPercent); // parseUnits(cashPercent, 12);
  const assetAddress = nftAssetAddress===""? "0x0000000000000000000000000000000000000000" :nftAssetAddress;
  console.log(`Running amendWillBeneficiaryCash ${beneficiaryAddress} ${beneneficiaryNickname} ${finalMessage} ${assetAddress} for cashPercentWEI:${cashPercentWEI}  nftAssetAddress:${nftAssetAddress} multisig1:${multisig1} multisig2:${multisig2} multisig3:${multisig3}`);

  return new Promise( async (resolve,reject) => {
    const tx = await ntt54Will.amendWillBeneficiaryCash(beneficiaryAddress, beneneficiaryNickname, finalMessage, cashPercentWEI );
    tx.wait().then( message => {
      console.log(`amendWillBeneficiaryCash beneficiaryAddress ${beneficiaryAddress} has been amended message: `,message);
      resolve(message);
    })
    .catch( error => reject(error));

  })
}

const removeWillBeneficiary = async (beneficiaryAddress, ntt54Will) => {
  console.log(`Running removeWillBeneficiary ${beneficiaryAddress}`);

  return new Promise( async (resolve,reject) => {
    const tx = await ntt54Will.removeWillBeneficiary(beneficiaryAddress);
    tx.wait().then( message => {
      console.log(`removeWillBeneficiary beneficiaryAddress ${beneficiaryAddress} has been removed message: `,message);
      resolve(message);
    })
    .catch( error => reject(error));

  })
}

const getBeneficiaryDetails = async (beneficiaryAddress, ntt54Will) => {
  if (ntt54Will && beneficiaryAddress)
  {
    console.log(`Getting BeneficiaryDetails for ${beneficiaryAddress}`);
    const beneficiaryDetails   = await ntt54Will.getBeneficiaryByAddress(beneficiaryAddress);
    console.log(`getBeneficiaryDetails> beneficiaryDetails: `,beneficiaryDetails)
    const b_address  = beneficiaryDetails[0];
    const b_nickname = beneficiaryDetails[1];
    const b_fmsg     = beneficiaryDetails[2];
    const b_percent  = beneficiaryDetails[3].toString(); //formatUnits(beneficiaryDetails[3],12);
    const b_nft      =  beneficiaryDetails[4];;
    const b_index    = (beneficiaryDetails[5]).toString();

    return {b_address, b_nickname, b_fmsg, b_percent, b_nft, b_index,};
  }
  else return null;
}


const getWillState = async (ntt54Will) => {
  if (ntt54Will)
  {
    const willState = await ntt54Will.willState();
    console.log(`willState ${willState}`);
    return willState;
  }
  else return null;
}

const getWillStats = async (ntt54Will) => {
  if (ntt54Will)
  {
    const willIssueBlockNum   = (await ntt54Will.willIssueBlockNum()).toString();
    const _willIssueTimeStamp = (await ntt54Will.willIssueTimeStamp()).mul(1000).toString();
    const willIssueTimeStamp  = _willIssueTimeStamp==="0"? "0": new Date(Number(_willIssueTimeStamp)).toISOString();
    const willGeneralMessage  =  await ntt54Will.willGeneralMessage();
    const trigger_dt1         = (await ntt54Will.trigger_dt1()).toString();
    const trigger_dt2         = (await ntt54Will.trigger_dt2()).toString();
    const trigger_dt3         = (await ntt54Will.trigger_dt3()).toString();
    const lastCall_dt4        = (await ntt54Will.lastCall_dt4()).toString();
    const triggerPoint1       = (await ntt54Will.triggerPoint1()).toString();
    const triggerPoint2       = (await ntt54Will.triggerPoint2()).toString();
    const triggerPoint3       = (await ntt54Will.triggerPoint3()).toString();
    const lastCallPoint       = (await ntt54Will.lastCallPoint()).toString();
   
    const willSpecs = {willIssueBlockNum, willIssueTimeStamp, willGeneralMessage, trigger_dt1, trigger_dt2
                      , trigger_dt3, lastCall_dt4, triggerPoint1, triggerPoint2, triggerPoint3, lastCallPoint,  }

    console.log(`willSpecs: `,willSpecs);
    return willSpecs;
  }
  else return null;
}

const getWillStage = async (ntt54Will) => {
  if (ntt54Will)
  {
    const willStage = await ntt54Will.willStage();
    console.log(`willStage ${willStage}`);
    return willStage;
  }
  else return null;
}

const getWillSwapState = async (ntt54Will) => {
  if (ntt54Will)
  {
    const willSwapState = await ntt54Will.willSwapState();
    console.log(`willSwapState: ${willSwapState}`);
    return willSwapState;
  }
  else return null;
}


const getInheritance_Cash = async (ntt54Will) => {
  if (ntt54Will)
  {
    const inheritance_Cash_WEI = await ntt54Will.inheritance_Cash();
    const inheritance_Cash = formatUnits(inheritance_Cash_WEI,12);
    console.log(`inheritance_Cash: ${inheritance_Cash}`);
    return inheritance_Cash;
  }
  else return null;
}

const getInheritance_Assets = async (ntt54Will) => {
  if (ntt54Will)
  {
    console.log("Running getInheritance_Assets");
    const inheritance_Assets = await ntt54Will.inheritance_Assets(); 
    console.log(`getInheritance_Assets => inheritance_Assets: `,inheritance_Assets);
    return inheritance_Assets;
  }
  else return null;
}


const getSchedulerCounter = async (ntt54Will) => {
  const schedulerCounter = await ntt54Will.schedulerCounter();
  console.log(`||||||||||||==> schedulerCounter: ${schedulerCounter.toString()}`);
  return schedulerCounter.toString();
}

// const helperToDelete = async (ntt54Will) => {
//   console.log(`Running checkWillStage`);
//   const blokcNum = await provider.getBlockNumber();
//   const help_willBeneficiaries_l = await ntt54Will.help_willBeneficiaries_l();
//   const help_distributedCash = await ntt54Will.help_distributedCash();
//   const help_cashAmount1 = await ntt54Will.help_cashAmount1();
//   const help_cashAmount2 = await ntt54Will.help_cashAmount2();
//   const distributionPoint = await ntt54Will.distributionPoint();
//   console.log(`||||||||||||==> Running distributionPoint:${distributionPoint} checkWillStage help_willBeneficiaries_l:${help_willBeneficiaries_l} help_distributedCash:${help_distributedCash} help_cashAmount1:${help_cashAmount1} help_cashAmount2:${help_cashAmount2}`);
//   console.log(`Running checkWillStage blokcNum ###############: `,blokcNum);
// }

const checkWillStage = async (ntt54Will) => {
  console.log(`Running checkWillStage`);
  const blokcNum = await provider.getBlockNumber();

  const help_willBeneficiaries_l = await ntt54Will.help_willBeneficiaries_l();
  const help_distributedCash = await ntt54Will.help_distributedCash();
  const help_cashAmount1 = await ntt54Will.help_cashAmount1();
  const help_cashAmount2 = await ntt54Will.help_cashAmount2();
  console.log(`Running checkWillStage help_willBeneficiaries_l:${help_willBeneficiaries_l} help_distributedCash:${help_distributedCash} help_cashAmount1:${help_cashAmount1} help_cashAmount2:${help_cashAmount2}`);

  console.log(`Running checkWillStage blokcNum ###############: `,blokcNum);

  
  return new Promise( async (resolve,reject) => {

    const gasPrice = await provider.getGasPrice();
    console.log(`gasPrice: `,gasPrice.toString());

    const tx_estimateGas = await ntt54Will.estimateGas.checkWillStage();
    console.log(`checkWillStage => tx_estimateGas: `,tx_estimateGas.toString()); //Returns the estimate units of gas that would be required to execute

    const tx = await ntt54Will.checkWillStage({gasPrice, gasLimit: tx_estimateGas});


    tx.wait().then( async message => {
      console.log(`checkWillStage has run message: `,message);
      const willStage = await getWillStage(ntt54Will);
      console.log(`checkWillStage has run willStage: `,willStage.toString());
      resolve(message);
    })
    .catch( error => reject(error));

  })
}


const aliveAndKicking = async (ntt54Will) => {
  console.log(`Running aliveAndKicking`);
  const blokcNum = await provider.getBlockNumber();
  console.log(`Running aliveAndKicking blokcNum ###############: `,blokcNum);

  return new Promise( async (resolve,reject) => {
    const tx = await ntt54Will.aliveAndKicking();
    tx.wait().then( message => {
      console.log(`aliveAndKicking has run message: `,message);
      resolve(message);
    })
    .catch( error => reject(error));

  })
}


const checkAdminBalance = async (ntt54Will) => {
  console.log(`Running checkAdminBalance`);
  const blokcNum = await provider.getBlockNumber();
  console.log(`Running aliveAndKicking blokcNum ###############: `,blokcNum);

  return new Promise( async (resolve,reject) => {
    const tx = await ntt54Will.checkAdminBalance();
    tx.wait().then( message => {
      console.log(`checkAdminBalance has run message: `,message);
      resolve(message);
    })
    .catch( error => reject(error));

  })
}



// const set_WillGeneralMessage = async (message, ntt54Will) => {
const set_WillGeneralMessage = async (message, _dt1, _dt2, _dt3, _lastCalldt, ntt54Will) => {

  let dt1 = parseInt(_dt1);
  let dt2 = parseInt(_dt2);
  let dt3 = parseInt(_dt3);
  let lastCalldt = parseInt(_lastCalldt);
  console.log(`Running set_Will dt1:${dt1} ${typeof dt1}`);
  console.log(`Running set_Will dt2:${dt2} ${typeof dt2}`);
  console.log(`Running set_Will dt3:${dt3} ${typeof dt3}`);
  console.log(`Running set_Will lastCalldt:${lastCalldt} ${typeof lastCalldt}`);

  console.log(`Running set_WillGeneralMessage. Make sure it is not longer than few charactets for storage purporse, otherwise prefer NFT address`);

  return new Promise( async (resolve,reject) => {
    // const tx = await ntt54Will.setWillGeneralMessage(message);
    const tx = await ntt54Will.setWillGeneralMessage(message, dt1, dt2, dt3, lastCalldt);

    tx.wait().then( msg => {
      console.log(`set_WillGeneralMessage has run msg: `,msg);
      resolve(message);
    })
    .catch( error => reject(error));

  })
}

// const set_Will = async (_dt1, _dt2, _dt3, _lastCalldt,  ntt54Will) => {
const set_Will = async (ntt54Will) => {

  console.log(`Running set_Will`);
  // const willState = await ntt54Will.willState();
  // console.log(`willState ${willState}`);

  // let dt1 = parseInt(_dt1);
  // let dt2 = parseInt(_dt2);
  // let dt3 = parseInt(_dt3);
  // let lastCalldt = parseInt(_lastCalldt);

  // let dt1 = parseUnits(_dt1,1);
  // let dt2 = parseUnits(_dt2,1);
  // let dt3 = parseUnits(_dt3,1);
  // let lastCalldt = parseUnits(_lastCalldt,1);

  // console.log(`Running set_Will dt1:${dt1} ${typeof dt1}`);
  // console.log(`Running set_Will dt2:${dt2} ${typeof dt2}`);
  // console.log(`Running set_Will dt3:${dt3} ${typeof dt3}`);
  // console.log(`Running set_Will lastCalldt:${lastCalldt} ${typeof lastCalldt}`);

  return new Promise( async (resolve,reject) => {
    // const tx = await ntt54Will.setWill(dt1, dt2, dt3, lastCalldt);
    const tx = await ntt54Will.setWill();

    tx.wait().then( message => {
      console.log(`set_Will has run message: `,message);
      resolve(message);
    })
    .catch( error => reject(error));

  })
}

const void_Will = async (ntt54Will) => {
  console.log(`Running voidWill`);

  return new Promise( async (resolve,reject) => {
    const tx = await ntt54Will.voidWill();
    tx.wait().then( message => {
      console.log(`voidWill has run message: `,message);
      resolve(message);
    })
    .catch( error => reject(error));

  })
}


const getBalanceSC = async (ntt54Will) => {
  if (ntt54Will)
  {
    console.log("Running getBalanceSC");
    const BalanceSC_WEI = await ntt54Will.getBalanceSC(); 
    const BalanceSC = formatUnits(BalanceSC_WEI,12);
    console.log(`getBalanceSC => BalanceSC: `,BalanceSC);
    return BalanceSC;
  }
  else return null;
}
const withdrawSC = async (ntt54Will) => {
  console.log(`Running withdrawSC`);

  return new Promise( async (resolve,reject) => {
    const tx = await ntt54Will.withdrawSC();
    tx.wait().then( message => {
      console.log(`withdrawSC has run message: `,message);
      resolve(message);
    })
    .catch( error => reject(error));

  })
}


     
//TODO AND TEST
// swapLiquidAssetToStable
// releaseWill
// SCHEDULER











//#region TO REMOVE
async function main () {
    // const [deployer] = await ethers.getSigners();

    // const initialBalance = await deployer.getBalance();
    // console.log("Initial account balance: %s ACA", formatUnits(initialBalance.toString(), 12));
    // console.log("Getting liquidity pools");
    // const initialAcaAusdLP = await instance.getLiquidityPool(ACA, AUSD);
    // const initialAcaDotLP = await instance.getLiquidityPool(ACA, DOT);
    // const initialDotAusdLP = await instance.getLiquidityPool(DOT, AUSD);
    // console.log("Initial ACA - AUSD liquidity pool: %s ACA - %s AUSD", formatUnits(initialAcaAusdLP[0].toString(), 12), formatUnits(initialAcaAusdLP[1].toString(), 12));
    // console.log("Initial ACA - DOT liquidity pool: %s ACA - %s DOT", formatUnits(initialAcaDotLP[0].toString(), 12), formatUnits(initialAcaDotLP[1].toString(), 12));
    // console.log("Initial DOT - AUSD liquidity pool: %s DOT - %s AUSD", formatUnits(initialDotAusdLP[0].toString(), 12), formatUnits(initialDotAusdLP[1].toString(), 12));
    // console.log("");
    // console.log("");
    // console.log("Getting liquidity pool token addresses");
    // const acaAusdLPTokenAddress = await instance.getLiquidityTokenAddress(ACA, AUSD);
    // const acaDotLPTokenAddress = await instance.getLiquidityTokenAddress(ACA, DOT);
    // const dotAusdLPTokenAddress = await instance.getLiquidityTokenAddress(DOT, AUSD);
    // console.log("Liquidity pool token address for ACA - AUSD:", acaAusdLPTokenAddress);
    // console.log("Liquidity pool token address for ACA - DOT:", acaDotLPTokenAddress);
    // console.log("Liquidity pool token address for DOT - AUSD:", dotAusdLPTokenAddress);
    // console.log("");
    // console.log("");
    // console.log("Getting expected swap target amounts");

    // const path1 = [ACA, AUSD];
    // const path2 = [ACA, AUSD, DOT];
    // const supply = initialAcaBalance.div(100);

    // const expectedTarget1 = await instance.getSwapTargetAmount(path1, supply);
    // const expectedTarget2 = await instance.getSwapTargetAmount(path2, supply);

    // console.log("Expected target when using path ACA -> AUSD: %s AUSD", formatUnits(expectedTarget1.toString(), 12));
    // console.log("Expected target when using path ACA -> AUSD -> DOT: %s DOT", formatUnits(expectedTarget2.toString(), 10));
    // console.log("");
    // console.log("");

    // console.log("Swapping with exact supply");
    // await instance.swapWithExactSupply(path1, supply, 1);
    // await instance.swapWithExactSupply(path2, supply, 1);

    // const halfwayAcaBalance = await ACAinstance.balanceOf(deployer.address);
    // const halfwayAusdBalance = await AUSDinstance.balanceOf(deployer.address);
    // const halfwayDotBalance = await DOTinstance.balanceOf(deployer.address);

    // console.log("Halfway %s ACA balance: %s ACA", deployer.address, formatUnits(halfwayAcaBalance.toString(), 12));
    // console.log("Halfway %s AUSD balance: %s AUSD", deployer.address, formatUnits(halfwayAusdBalance.toString(), 12));
    // console.log("Halfway %s DOT balance: %s DOT", deployer.address, formatUnits(halfwayDotBalance.toString(), 12));

    // console.log("%s AUSD balance increase was %s AUSD, while the expected increase was %s AUSD.", deployer.address, formatUnits(halfwayAusdBalance.sub(initialAusdBalance).toString(), 12), formatUnits(expectedTarget1.toString(), 12));
    // console.log("%s DOT balance increase was %s DOT, while the expected increase was %s DOT.", deployer.address, formatUnits(halfwayDotBalance.sub(initialDotBalance).toString(), 12), formatUnits(expectedTarget2.toString(), 12));
}
//#endregion TO REMOVE



const getMsg = () => {
  return "Hello World";
}  


export {
  getMsg,
  setInstances,
  getAccountBalances,
  getAccount_ACA_Balance,
  getBasicInfo,
  get_AccountNonce,
  get_AdminAccounts,
  get_RegisteredERC20,
  get_WillBeneficiaries,
  getRegisteredAccount_ACA_Balance,
  get_RegisteredAccountTokenAllowance,
  getSmartContractFeesBalances,
  getSmartContractAllBalances,
  get_SmartContractNonce,
  getAdminFeeTokensBalances,
  approveERC20forSC,
  registerNewOwnerAccount,
  registerAccountToken,
  depositFees,

  addNewBeneficiary,
  amendWillBeneficiaryCash,
  removeWillBeneficiary,
  getBeneficiaryDetails,
  checkWillStage,
  getWillStage,
  getWillState,
  getWillStats,
  getWillSwapState,
  getInheritance_Cash,
  getInheritance_Assets,
  aliveAndKicking,
  checkAdminBalance,
  set_WillGeneralMessage,
  set_Will,
  void_Will,
  getBalanceSC,
  withdrawSC,

  getSchedulerCounter,

  // helperToDelete,
}