import React, { lazy, Suspense, useEffect, useState, useCallback } from 'react';

import { ethers } from 'ethers';  
import { Contract } from 'ethers';
// import { ACA, AUSD, DEX, Schedule, Oracle, EVM, DOT, LP_ACA_AUSD, LP_DOT_AUSD, LP_LDOT_AUSD, LP_RENBTC_AUSD, LDOT, RENBTC }  from '@acala-network/contracts/utils/Address';
// import { formatUnits, parseUnits } from 'ethers/lib/utils';

// import TokenContract from '@acala-network/contracts/build/contracts/Token.json';
import ntt54Will_raw from './Abis/ntt54Will';      


//METAMASK
import detectEthereumProvider from '@metamask/detect-provider'; // FOR METAMASK TO BE USED This function detects most providers injected at window.ethereum

// import ntt54_ERC20_raw from './Abis/ntt54_ERC20';      
// import ntt54_Oracle_raw from './Abis/ntt54_Oracle';    //Address in AMTC7 0xdB0A4192d9b0130E2e5DB945380441DeE7099eDb

// import {setup, getSCabstractions} from './Setup.js';
// import {getAllData, getAccountBalance} from './ntt54Oracle.js';
import { getSchedulerCounter, getMsg, setInstances, getAccountBalances } from './ntt54_accounts.js';         


/// Components
import Index from "./jsx";
/// Style
import "./vendor/bootstrap-select/dist/css/bootstrap-select.min.css";
import "./css/style.css";



// ************ ntt54Will ************
// const ntt54Will_address = "0xd66d0E6ccA5825eC3fEdbe4CAac301A9d79A30a0";
const ntt54Will_address = "0xD98d06454590B1508dFf6F3DDb63594A89fD28Bd";
// ************ ntt54Will ************




function App (props) {
    const [provider,setProvider] = useState(null);
    const [chainId,setChainId] = useState(null);
    const [willAdmin,setWillAdmin] = useState(null);
    const [currentAccount,setCurrentAccount] = useState(null);
    const [wallet,setWallet] = useState(null);
    const [ntt54Will,setNtt54Will] = useState(null);

     
    const [schedulerTrigger,setSchedulerTrigger] = useState("");

    
    const [setupSpecs,setSetupSpecs]            = useState({ wallet: null, provider: null, pair: null, connected: "Not connected", walletAddress: null });
    const [blockChainSpecs,setBlockChainSpecs]  = useState({ networkName: undefined, chainID: undefined, blockNumber: undefined, gasPrice: undefined});
    const [blockHeader, setBlockHeader]         = useState({ number: undefined , hash: undefined, size: undefined });
    const [oracleData,setOracleData] = useState({ _tickers: undefined, _tiks: undefined, timestamp: undefined, _prices: undefined, mcs: undefined, tokenAddresses: undefined, tickersStrings: undefined, tiksString: undefined, pricesBaseCur: undefined });
    const [oracleSC, setOracleSC]                = useState({ sc_ntt54_Oracle: undefined , singer_sc_ntt54_Oracle: undefined, address: undefined});

    const [evm_api_state,setEvm_Api_State] = useState(false);
    const [accountList, setAccountList] = useState();  //stores the list of accounts from the extensions
    const [accountBalance, setAccountBalance] = useState();
    const [portfolio, setPortfolio] = useState(undefined);

    const [blockTimestamp, setBlockTimestamp]   = useState(undefined);
    const [selectedAccountName, setSelectedAccountName] = useState("");

    //THESE ARE USED TO RESTRICT UPDATING PORTFOLIO BANALNCE TO ONCE EVERY portfolioUpdateBlockNumberFrequency BLOCKS INSTEAD OF EVERY BLOCK
    const [lastupdate_blocknumber, setLastupdate_blocknumber]   = useState(0);
    const [portfolioUpdateBlockNumberFrequency, setPortfolioUpdateBlockNumberFrequency]   = useState(20);

    

    // const fetchOraclePrices = async (oracleSC) => {
    //   console.log(`fetchOraclePrices is RUN   xxxxxxxxx `);
    //   if (oracleSC)
    //   {
    //     const {_tickers, _tiks, timestamp, _prices, mcs, tokenAddresses, tickersStrings, tiksString, pricesBaseCur} = await getAllData(oracleSC);
    //     setOracleData( {_tickers, _tiks, timestamp, _prices, mcs, tokenAddresses, tickersStrings, tiksString, pricesBaseCur});
    //     console.log(`tickersStrings : `,tickersStrings[0],`  `,tickersStrings[1]);
    //   }
    // }
 

  //#region Setup MetaMask
  useEffect(() => {
      const listenMMAccount = async () => {

          const basicInfo = async (provider, wallet, account) => {
            const balanceAccount_BigNumber = await provider.getBalance(account);
            const balanceAccount =  ethers.utils.formatUnits( balanceAccount_BigNumber, 18 );
            const walletBalance = await wallet.getBalance(); // { BigNumber: "42" }
            const walletChainID = await wallet.getChainId(); //AMTC7 595 or 0x253   Returns the chain ID this wallet is connected to.  
            const gasPrice = await wallet.getGasPrice(); // 1000000000 Returns the current gas price. BigNumber   
            const nonce = await wallet.getTransactionCount(); //NONCE 73
            
            // console.log(`999999999999 nonce:${nonce}    99999999999999999999999`)
            // const nonce3 = await provider.getTransactionCount("0xd60135d1d501fb45b7dd2b3761e4225cf80f96a6");
            // console.log(`999999999999 nonce3:${nonce3}    99999999999999999999999`)
            // const nonce2 = await provider.getTransactionCount("0xd60135d1d501fb45b7dd2b3761e4225cf80f96a6");
            // console.log(`999999999999 nonce2:${nonce2}    99999999999999999999999`)

            console.log(`MetaMask Setup ***> account:${account} balanceAccount: ${balanceAccount} Wallet address that signs transactions: ${await wallet.getAddress()} walletBalance: ${ ethers.utils.formatUnits( walletBalance, 18 )} walletChainID: ${walletChainID} nonce:${nonce}`);
            console.log(`MetaMask Setup ***>  (await provider.getNetwork()).chainId: ${(await provider.getNetwork()).chainId} getBlockNumber: ${await provider.getBlockNumber()} gasPrice: ${gasPrice.toString()}`);
           
            // //set instances
            const ntt54_Will = new Contract(ntt54Will_address    , ntt54Will_raw.abi  , wallet);
            const will_Admin  = await ntt54_Will.willAdmin();
            setWillAdmin(will_Admin);
            setNtt54Will(ntt54_Will);
            console.log(`Will Administrators: ${will_Admin}`);

            // ACAinstance     = new Contract(ACA    , TokenContract.abi, wallet);
            // AUSDinstance    = new Contract(AUSD   , TokenContract.abi, wallet);
            // DOTinstance     = new Contract(DOT    , TokenContract.abi, wallet);
            // LDOTinstance    = new Contract(LDOT   , TokenContract.abi, wallet);
            // RENBTCinstance  = new Contract(RENBTC , TokenContract.abi, wallet);

            await setInstances(will_Admin, wallet, provider, ntt54_Will);
          }

          let provider, wallet, mm_acounts, account;
          const _provider = await detectEthereumProvider();
          if (_provider) {
            provider = new ethers.providers.Web3Provider(window.ethereum, "any");   
            setProvider(provider);
           
            provider.on("network", (newNetwork, oldNetwork) => {
                if (oldNetwork) {
                    window.location.reload();
                }
            });

            mm_acounts = await _provider.request({ method: 'eth_requestAccounts' });
            console.log(`MetaMask Accounts Array: `,mm_acounts);
            setCurrentAccount(mm_acounts[0]);
            account = mm_acounts[0];

            const mm_chainId = await _provider.request({ method: 'eth_chainId' });
            setChainId(mm_chainId);
            console.log(`MetaMask mm_chainId: `,mm_chainId);

            wallet = provider.getSigner(); 
            setWallet(wallet)

            basicInfo(provider, wallet, account);

            window.ethereum.on('accountsChanged', handleAccountsChanged);
            function handleAccountsChanged(accounts) {
              if (accounts.length === 0) {
                // MetaMask is locked or the user has not connected any accounts
                console.log('Please connect to MetaMask.');
              } else if (accounts[0] !== currentAccount) {
                account = accounts[0]
                setCurrentAccount(accounts[0]);
                wallet = provider.getSigner(); 
                setWallet(wallet)
          
                basicInfo(provider, wallet, account);

                console.log(`******* current account: ${accounts[0]}`);
              }
            }

          } 
          else {  console.log('Please install MetaMask!');  }
      }
      listenMMAccount();
  }, []);
  //#endregion Setup MetaMask


  useEffect( async () => {
      if (provider && currentAccount)
      {
          // const runSetup = async () => {
          // const { provider, wallet, account } = await setup("AMTC7", true);
          setEvm_Api_State(true);
          setAccountList([currentAccount]);
            const balanceAccount_BigNumber = await provider.getBalance(currentAccount);
            const balanceAccount =  ethers.utils.formatUnits( balanceAccount_BigNumber, 18 );
            setAccountBalance(balanceAccount);
          // ntt54_ERC20 , ntt54_Oracle
          // const ntt54_OracleSCAddress = "0x357C23877e32C6E01a7518F7e37d15aC338cdf0c";
          // const sc_ntt54_Oracle =  new ethers.Contract(ntt54_OracleSCAddress, ntt54_Oracle_raw.abi, provider);
          // const singer_sc_ntt54_Oracle = sc_ntt54_Oracle.connect(wallet);
          // console.log(`APP.JS  ***>  sc_ntt54_Oracle Address : `,sc_ntt54_Oracle.address); 
          // console.log(`APP.JS  ***>  singer_sc_ntt54_Oracle ***> `,singer_sc_ntt54_Oracle);
            // const _setupSpecs = { wallet, provider, pair:"", connected: "Connected to AMTC7", walletAddress: await wallet.getAddress() };
            // setSetupSpecs(_setupSpecs);
            // setBlockChainSpecs({ networkName: "AcalaMandalaTC7", chainID: (await provider.getNetwork()).chainId, blockNumber: await provider.getBlockNumber(), gasPrice: (await provider.getGasPrice()).toString() });
          // setBlockChainSpecs({ networkName: (await provider.getNetwork()).name, chainID: (await provider.getNetwork()).chainId, blockNumber: await provider.getBlockNumber(), gasPrice: (await provider.getGasPrice()).toString() });
          // setOracleSC({sc_ntt54_Oracle, singer_sc_ntt54_Oracle, address: ntt54_OracleSCAddress})
          // fetchOraclePrices(sc_ntt54_Oracle); 
          // setEvm_Api_State(true);
        // }
        // runSetup();
      }
  }, [provider, currentAccount]);   

   
  //#region on Oracle Update
  // useEffect(async () => {
        
  //       if (blockHeader.number && (Number(blockHeader.number) - lastupdate_blocknumber) > portfolioUpdateBlockNumberFrequency)
  //       {
  //         console.log(`=====>  AN UPDATE OF PORTFOLIO BALANCES FOR ALL ERC20 FOR THE ACCOUNT WILL NOW RUN`);
  //         setLastupdate_blocknumber(Number(blockHeader.number));

  //         if (oracleData.tokenAddresses && accountList.length>0 && accountBalance && setupSpecs.provider) {
  //           const accountAllBalances = await getAccountBalance(oracleData, accountList[0], accountBalance,  setupSpecs.provider );
  //           // console.log(`accountAllBalances[0] : ${accountAllBalances[0].name} ${accountAllBalances[0].ticker} ${accountAllBalances[0].NumTokens} ${accountAllBalances[0].Value}`);
  //           // console.log(`accountAllBalances[1] : ${accountAllBalances[1].name} ${accountAllBalances[1].ticker} ${accountAllBalances[1].NumTokens} ${accountAllBalances[1].Value}`);
  //           setPortfolio(accountAllBalances);
  //         }
  //       }
  //       else 
  //       {
  //         const nextPortolfioUpdateBlockNumber = lastupdate_blocknumber + portfolioUpdateBlockNumberFrequency;
  //         console.log(`=====> lastupdate_blocknumber:${lastupdate_blocknumber} portfolioUpdateBlockNumberFrequency:${portfolioUpdateBlockNumberFrequency} blockHeader.number:${blockHeader.number} PORTFOLIO BALANCE WILL UPDATE at block #${nextPortolfioUpdateBlockNumber}.`);
  //       }

  //   }, [oracleData,blockHeader]);
  //#endregion

  //#region  parachain events setup WORKING BUT COMMENTED OUT FOR DEVELOPMENT
  useEffect(() => {
    let scheduler_Counter = "";
    const pingOnScheduler = async (blockNumber) => {

      if (ntt54Will && blockNumber%10 === 0)
      {
        console.log(`RuNninG getSchedulerCounter on ${blockNumber}`);
        const schedulerCounter = await getSchedulerCounter(ntt54Will);
        if (scheduler_Counter!==schedulerCounter)
        {
          scheduler_Counter=schedulerCounter;
          console.log(`Scheduler has just checked the will. Update balances`);
          setSchedulerTrigger(scheduler_Counter);
        }
      }

    }


    const parachain = async (provider) => {
        console.log(`||||||||||||||||||||=========> App.js AcalamandalaTC7 Parachain is run at  Timestmap: ${new Date()}`);

        //Subscribe to the new headers on-chain.   
        provider.on("block", async (blockNumber) => {
            console.log(`AcalamandalaTC7 PROVIDER EVENT block blockNumber: ${blockNumber}`);
            setBlockHeader({number: `${blockNumber}`, hash: `header.hash`, size: "header.size"});

            // fetchOraclePrices( oracleSC.sc_ntt54_Oracle ); 
            pingOnScheduler(blockNumber);
            
        });
    }

    if (provider) 
    {
      const jsonRpcProvider = new ethers.providers.JsonRpcProvider("https://tc7-eth.aca-dev.network");
      parachain(jsonRpcProvider).catch((er) => { console.log(`APP.JS parachain Error: `,er);  });
      // parachain(provider).catch((er) => { console.log(`APP.JS parachain Error: `,er);  });
    }
    else console.log(`App.js => setupSpecs.provider is undefined`);
  // }, []);  
  }, [provider,ntt54Will]);  
  //#endregion  parachain events setup


    
		return (
			<>
                <Suspense fallback={
                    <div id="preloader">
                        <div className="sk-three-bounce">
                            <div className="sk-child sk-bounce1"></div>
                            <div className="sk-child sk-bounce2"></div>
                            <div className="sk-child sk-bounce3"></div>
                        </div>
                    </div>  
                   }
                >
                    <Index schedulerTrigger={schedulerTrigger} willAdmin={willAdmin} ntt54Will_address={ntt54Will_address} currentAccount={currentAccount} provider={provider} wallet={wallet} ntt54Will={ntt54Will}
                           setupSpecs={setupSpecs} oracleData={oracleData} portfolio={portfolio} evm_api_state={evm_api_state} 
                           blockChainSpecs={blockChainSpecs} blockHeader={blockHeader} blockTimestamp={blockTimestamp} 
                           accountList={accountList} selectedAccountName={selectedAccountName} />
                </Suspense>
            </>
        );
	
};


export default App;