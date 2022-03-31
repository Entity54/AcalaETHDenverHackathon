import React,{Fragment,useContext, useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import { Dropdown } from "react-bootstrap";
import loadable from "@loadable/component";
import pMinDelay from "p-min-delay";

//Import
import { ThemeContext } from "../../../context/ThemeContext";
// import Donut from "../Boltz/MyWallet/Donut";
// import WalletTab from "../Boltz/MyWallet/WalletTab";
import BeneficiariesSlider from "../Boltz/MyWallet/BeneficiariesSlider";
import BenefiiarySettings from "../Boltz/MyWallet/BenefiiarySettings";



import { getSchedulerCounter, get_WillBeneficiaries, aliveAndKicking, checkWillStage, checkAdminBalance, getWillStats, 
	     getWillState, getWillStage, getSmartContractFeesBalances, getRegisteredAccount_ACA_Balance, 
		 get_AdminAccounts, get_SmartContractNonce, getSmartContractAllBalances, getAccountBalances, 
		 getInheritance_Cash } from '../../../ntt54_accounts.js';         

// import QuickTransfer from '../Boltz/Home/QuickTransfer';

const CoinChart = loadable(() =>
  pMinDelay(import("../Boltz/MyWallet/CoinChart"), 1000)
);

const MyWallet = ({ schedulerTrigger, ntt54Will_address, willAdmin, currentAccount, provider, wallet, ntt54Will }) => {
	const { background } = useContext(ThemeContext);

	// const [finalMsg  , setFinalMsg]           = useState("");
	// const [trigger1dt, setTrigger1dt]         = useState("");
	// const [trigger2dt, setTrigger2dt]         = useState("");
	// const [trigger3dt, setTrigger3dt]         = useState("");
	// const [lastCalldt, setLastCalldt]         = useState("");
	// const [initBtn_Disabled, setInitBtn_Disabled] = useState(false);
	// const [voidBtn_Disabled, setVoidBtn_Disabled] = useState(true);

	const [willState  , setWillState]   = useState(false);
	const [willStage  , setWillStage]   = useState("");

	 
	const [sc_nonce  , setSC_nonce]   = useState("");


	const [feesBalances  , setFeesBalances]   = useState([]);

	const [scAllBalances  , setSCAllBalances]   = useState([]);


	const [adminACAbalance , setAdminACAbalance]   = useState("");

	const [adminRegisteredAccounts  , setAdminRegisteredAccounts]   = useState([]);

	const [willBeneficiaries, setWillBeneficiaries] = useState([]);
	const [beneficiariesBalances, setBeneficiariesBalances] = useState([]);

	const [registeredAccountsBalances, setRegisteredAccountsBalances] = useState([]);

	const [inheritanceCash , setInheritanceCash]   = useState("");


	// const [willIssueBlockNum  , setWillIssueBlockNum]   = useState("");
	// const [willIssueTimeStamp , setWillIssueTimeStamp]  = useState("");
	// const [willGeneralMessage , setWillGeneralMessage]  = useState("");
	const [triggerPoint1  , setTriggerPoint1]           = useState("");
	const [triggerPoint2  , setTriggerPoint2]           = useState("");
	const [triggerPoint3  , setTriggerPoint3]           = useState("");
	const [lastCallPoint  , setLastCallPoint]           = useState("");

	// const [nickname, setNickname]             = useState("");
	// const [cashPercentage, setCashPercentage] = useState("");
	// const [nftAddress, setNftAddress]         = useState("");

	// const [accountbalances, setAccountbalances] = useState([]);
	// const [allAdminAccounts, setAllAdminAccounts] = useState([]);

	// const [clickedAccount, setClickedAccount] = useState(null);
	// const [beneficiary, setBeneficiary] = useState("");
	// const [willBeneficiaries, setWillBeneficiaries] = useState([]);
	// const [detailedBeneficiariesArray, setDetailedBeneficiariesArray] = useState([]);
	// const [requestingData, setRequestingData] = useState(false);
	// const [action, setAction] = useState("");



	const getInheritanceCash = async () => {
		console.log(`getInheritanceCash is running`);
		const cash_AUSD = await getInheritance_Cash(ntt54Will);
		console.log(`getInheritanceCash => ************ cash_AUSD ************: `,cash_AUSD);
		setInheritanceCash(cash_AUSD);
	}

	const getWillBeneficiaries = async () => {
		console.log(`Beneficiaries => getRegisteredAccounts is running`);
		const willBeneficiariesArray = await get_WillBeneficiaries(ntt54Will);
		console.log(`Beneficiaries => willBeneficiariesArray: `,willBeneficiariesArray);
		setWillBeneficiaries(willBeneficiariesArray);
		return willBeneficiariesArray;
	}

	const get_Beneficiaries_Balances = async (willBeneficiariesArray) => {
		const numOfBeneficiaries = willBeneficiariesArray.length;
		if(numOfBeneficiaries===0) {
			setBeneficiariesBalances([]);
			return;
		}
		
        let benferiedDetailsArrray = [], count=0;
		const getDetails = async (beneficiaryAdr) => {
			console.log(`Retrieving details for beneficiary:${beneficiaryAdr}`);
			const beneficiaryDetails = await getAccountBalances(beneficiaryAdr, ntt54Will);
			console.log(`get_BeneficiaryDetails => Received ${beneficiaryAdr} beneficiaryDetails: `,beneficiaryDetails);
			if (beneficiaryDetails) benferiedDetailsArrray.push(beneficiaryDetails);
			count++
			 
			if (count < numOfBeneficiaries) getDetails( willBeneficiariesArray[count] );
			else setBeneficiariesBalances( benferiedDetailsArrray );
		}

		getDetails(willBeneficiariesArray[0]);

		//Sample
		// [
		// 	{ name:"Acala", ticker: "ACA", NumTokens: ACA_Balance, value: "0", allowance: allowance_ACA, status: status_ACA }, { name:"Acala Dollar", ticker: "AUSD", NumTokens: AUSD_Balance, value: "0",  allowance: allowance_AUSD, status: status_AUSD }, { name:"Polkadot", ticker: "DOT", NumTokens: DOT_Balance, value: "0",  allowance: allowance_DOT, status: status_DOT },
		// 	{ name:"Liquid DOT", ticker: "LDOT", NumTokens: LDOT_Balance, value: "0",  allowance: allowance_LDOT, status: status_LDOT }, { name:"Ren Bitcoin", ticker: "RENBTC", NumTokens: RENBTC_Balance, value: "0",  allowance: allowance_RENBTC, status: status_RENBTC }
		// ]
	}


	 
	//adminRegisteredAccounts => registeredAccountsArray = [{address: '0xd60135d1d501fb45B7dD2B3761E4225cF80f96A6', nonce: 157, status: 'Registered'}]
	const get_RegisteredAccountAllBalances = async (registeredAccountsArray) => {
		const numOfBeneficiaries = registeredAccountsArray.length;
		if(numOfBeneficiaries===0) {
			setRegisteredAccountsBalances([]);
			return;
		}
		
        let registeredAccountsDetailsArrray = [], count=0;
		const getDetails = async (registredAdr) => {
			console.log(`Retrieving details for beneficiary:${registredAdr}`);
			const registerDetails = await getAccountBalances(registredAdr, ntt54Will);
			console.log(`get_RegisteredAccountAllBalances => Received ${registredAdr} registerDetails: `,registerDetails);
			if (registerDetails) registeredAccountsDetailsArrray.push(registerDetails);
			count++
			 
			if (count < numOfBeneficiaries) getDetails( registeredAccountsArray[count].address );
			else setRegisteredAccountsBalances( registeredAccountsDetailsArrray );
		}

		getDetails(registeredAccountsArray[0].address);

		//Sample
		// [
		// 	{ name:"Acala", ticker: "ACA", NumTokens: ACA_Balance, value: "0", allowance: allowance_ACA, status: status_ACA }, { name:"Acala Dollar", ticker: "AUSD", NumTokens: AUSD_Balance, value: "0",  allowance: allowance_AUSD, status: status_AUSD }, { name:"Polkadot", ticker: "DOT", NumTokens: DOT_Balance, value: "0",  allowance: allowance_DOT, status: status_DOT },
		// 	{ name:"Liquid DOT", ticker: "LDOT", NumTokens: LDOT_Balance, value: "0",  allowance: allowance_LDOT, status: status_LDOT }, { name:"Ren Bitcoin", ticker: "RENBTC", NumTokens: RENBTC_Balance, value: "0",  allowance: allowance_RENBTC, status: status_RENBTC }
		// ]
	}




	const get_SmartContact_AllBalances = async () => {
		console.log(`get_SmartContact_AllBalances is running`);
		const balancesArray = await getSmartContractAllBalances(ntt54Will);
		console.log(`get_SmartContact_AllBalances is complete balancesArray: `,balancesArray);
		//Sample
		// return [
		// 	{ name:"Acala", ticker: "ACA", NumTokens: ACA_Balance, value: "0", allowance: allowance_ACA, status: status_ACA }, { name:"Acala Dollar", ticker: "AUSD", NumTokens: AUSD_Balance, value: "0",  allowance: allowance_AUSD, status: status_AUSD }, { name:"Polkadot", ticker: "DOT", NumTokens: DOT_Balance, value: "0",  allowance: allowance_DOT, status: status_DOT },
		// 	{ name:"Liquid DOT", ticker: "LDOT", NumTokens: LDOT_Balance, value: "0",  allowance: allowance_LDOT, status: status_LDOT }, { name:"Ren Bitcoin", ticker: "RENBTC", NumTokens: RENBTC_Balance, value: "0",  allowance: allowance_RENBTC, status: status_RENBTC }
		//   ]
		setSCAllBalances(balancesArray); // scAllBalances.length>0?scAllBalances[0].NumTokens:""
	}


	const aliveNkicking = async () => {
		console.log(`aliveNkicking. Please wait...`);

		aliveAndKicking(ntt54Will)
		.then((res) => {
			console.log(`Tx to aliveNkicking is mined.`);
			readWillValues();
		})
		.catch((er) => console.log(`Error in initiate_Will: `,er));
	}

	const check_WillStage = async () => {
		console.log(`check_WillStage. Please wait...`);

		checkWillStage(ntt54Will)
		.then((res) => {
			console.log(`Tx to check_WillStage is mined.`);
			readWillValues();
		})
		.catch((er) => console.log(`Error in check_WillStage: `,er));
	}


	//Get all registred accounts
	const getAdminAccounts = async () => {
		console.log(`getAdminAccounts is running`);
		const {adminAccountsArray, adminAccNonce} = await get_AdminAccounts(provider, ntt54Will);
		// setAdminRegisteredAccounts(adminAccountsArray);
		setAdminRegisteredAccounts(adminAccNonce);  //adminAccNonce[0].nonce
		// [{address: '0xd60135d1d501fb45B7dD2B3761E4225cF80f96A6', nonce: 157, status: 'Registered'}]
		console.log(`MANAGE WILL => getAdminAccounts => adminAccountsArray: `,adminAccountsArray);
		return adminAccNonce;
	}

    //CHECK SMART CONTRACT FEES BALANCE TO ENSURE SC HAS ENOUGH TO PAY FOR TRASNACTION FEES
	const get_SmartContactFeesBalances = async () => {
		console.log(`get_SmartContactFeesBalances is running`);
		const balances = await getSmartContractFeesBalances(ntt54Will, willAdmin);
		setFeesBalances(balances);
		const sc_nonce = await get_SmartContractNonce(provider)
		setSC_nonce(sc_nonce);
		console.log(`get_SmartContactFeesBalances is complete sc_nonce:${sc_nonce}`);
	}

    //CHECK REGISTERD ACCOUNT FOR BALANCE DECREASE AS PROOF OF LIFE
	const getRegisteredAccount_ACABalance = async (accountAdr) => {
		console.log(`getRegisteredAccount_ACABalance is running for account: ${accountAdr}`);
		const balance = await getRegisteredAccount_ACA_Balance(accountAdr,ntt54Will);
		setAdminACAbalance(balance);
	}

	const check_AdminBalance = async () => {
		console.log(`check_AdminBalance. Please wait...`);

		checkAdminBalance(ntt54Will)
		.then((res) => {
			console.log(`Tx to check_AdminBalance is mined.`);
			readWillValues();
		})
		.catch((er) => console.log(`Error in check_AdminBalance: `,er));
	}


	const readWillValues = async () => {
		console.log(`InitiateWill Reading Will Specs. Please wait...`);
		const willSpecs = await getWillStats(ntt54Will);
		const will_State = await getWillState(ntt54Will);
		// if (will_State) { setInitBtn_Disabled(true); setVoidBtn_Disabled(false); }
		// else { setInitBtn_Disabled(false); setVoidBtn_Disabled(true); }
		const will_Stage = await getWillStage(ntt54Will);
		// setWillIssueBlockNum(willSpecs.willIssueBlockNum);
		// setWillIssueTimeStamp(willSpecs.willIssueTimeStamp);
		// setWillGeneralMessage(willSpecs.willGeneralMessage);
		setTriggerPoint1(willSpecs.triggerPoint1);
		setTriggerPoint2(willSpecs.triggerPoint2);
		setTriggerPoint3(willSpecs.triggerPoint3);
		setLastCallPoint(willSpecs.lastCallPoint);
		setWillState(will_State);
		setWillStage(will_Stage);
		console.log(`InitiateWill willSpecs: `,willSpecs);
		
		console.log(`Updating Smart Contract Balances`);
		await get_SmartContactFeesBalances();
		
		console.log(`Getting Admin accounts and nonces`);  //This is for UX. The actual sc reades decrease in balance as we do next
		const admin_RegisteredAccounts = await getAdminAccounts();

		console.log(`Getting Beneficiary accounts`); 
		const will_Beneficiaries = await getWillBeneficiaries();

		console.log(`Updating registred accoun willAdmin ACA Balances`);
		await getRegisteredAccount_ACABalance(willAdmin);        //TODO we should add all Registered admin accounts as any decrease in their native token balance proves LIFE

		console.log(`Reading all smart contract balances`);
		await get_SmartContact_AllBalances()

		console.log(`Reading all beneficiaries balances`);
		await get_Beneficiaries_Balances(will_Beneficiaries);

		console.log(`Reading all registred account balances`);
		await get_RegisteredAccountAllBalances(admin_RegisteredAccounts);      

		console.log(`Reading Inheritance Cash`);
		await getInheritanceCash();

		console.log(`RuNninG getSchedulerCounter `);
		await getSchedulerCounter(ntt54Will);
	}
	

	useEffect(async () => {
		if (ntt54Will && provider && willAdmin && ntt54Will_address)
		{
			await readWillValues();
		}
	},[ntt54Will, provider, willAdmin, ntt54Will_address])


	useEffect(async () => {
		if (schedulerTrigger)
		{
			await readWillValues();
		}
	},[schedulerTrigger])
	 



	//#region
	// const startAction = async (_action) => {
	// 	setAction(_action)
	// 	setRequestingData(true);
	// }

	// const collectBeneficiaryData = (nickname, finalMsg, cashPercentage, nftAddress, multisig1, multisig2, multisig3) => {
	// 	console.log(`collectBeneficiaryData beneficiary:${beneficiary} nickname:${nickname} finalMsg:${finalMsg} nftAddress:${nftAddress} multisig1:${multisig1}  multisig2:${multisig2}  multisig3:${multisig3}`);
	// 	console.log(`collectBeneficiaryData cashPercentage:${cashPercentage} typeof:${typeof cashPercentage}`);
    //     const data = {beneficiary, nickname, finalMsg, cashPercentage, nftAddress, multisig1, multisig2, multisig3};
	// 	if (action==="register") registerNewBeneficiary(data);
	// 	else if (action==="amend") amendBeneficiary(data);
	// 	else if (action==="delete") deleteBeneficiary();
	// 	setRequestingData(false);
	// }

	// const registerNewBeneficiary = async (data) => {
	// 	console.log(`registerNewBeneficiary We will now register a new beneficiary${beneficiary} Please wait... `);
	// 	if (beneficiary!=="")
    //     {
	// 		const willBeneficiariesArray = await get_WillBeneficiaries(ntt54Will);
	// 		console.log(`Is beneficiary:${beneficiary} already registered in Beneficiaries => willBeneficiariesArray: `,willBeneficiariesArray);
	// 		const beneficiaryFound = willBeneficiariesArray.find( element => element.toLowerCase() === beneficiary.toLowerCase());
	// 		if (beneficiaryFound)
	// 		{
	// 			console.log(`Beneficiary:${beneficiary} has already registered.`);
	// 			return;
	// 		}
			
	// 		console.log(`Beneficiary:${beneficiary} is not registered.`);
	// 		addNewBeneficiary(data.beneficiary, data.nickname, data.finalMsg, data.cashPercentage, data.nftAddress, data.multisig1, data.multisig2, data.multisig3, ntt54Will)
	// 		.then((res) => {
	// 			console.log(`We have just called registerNewBeneficiary for ${beneficiary}`);
	// 			getWillBeneficiaries(ntt54Will);
	// 		})
	// 		.catch((er) => console.log(`Error in addNewBeneficiary: `,er));
	// 	}
	// }  

	// const amendBeneficiary = async (data) => {
	// 	console.log(`Amend beneficiary:${beneficiary} is Run data: `,data);
	// 	if (beneficiary!=="")
    //     {
	// 		const willBeneficiariesArray = await get_WillBeneficiaries(ntt54Will);
	// 		console.log(`Is beneficiary:${beneficiary} already registered in Beneficiaries => willBeneficiariesArray: `,willBeneficiariesArray);
	// 		const beneficiaryFound = willBeneficiariesArray.find( element => element.toLowerCase() === beneficiary.toLowerCase());
	// 		if (beneficiaryFound)
	// 		{
	// 			console.log(`Beneficiary:${beneficiary} has already registered.`);
	// 			amendWillBeneficiaryCash(data.beneficiary, data.nickname, data.finalMsg, data.cashPercentage, data.nftAddress, data.multisig1, data.multisig2, data.multisig3, ntt54Will)
	// 			.then((res) => {
	// 				console.log(`We have just called amendWillBeneficiaryCash for ${beneficiary}`);
	// 				getWillBeneficiaries(ntt54Will);
	// 			})
	// 			.catch((er) => console.log(`Error in amendBeneficiary: `,er));
				
	// 		}
	// 		else console.log(`Trying to amend a beneficiary that is not already registered`);
	// 	}
	// }

	// const deleteBeneficiary = async () => {
	// 	console.log(`Delete Benficiary: ${beneficiary} is Run`);
	// 	if (beneficiary!=="")
    //     {
	// 		const willBeneficiariesArray = await get_WillBeneficiaries(ntt54Will);
	// 		console.log(`Is beneficiary:${beneficiary} already registered in Beneficiaries => willBeneficiariesArray: `,willBeneficiariesArray);
	// 		const beneficiaryFound = willBeneficiariesArray.find( element => element.toLowerCase() === beneficiary.toLowerCase());
	// 		if (beneficiaryFound)
	// 		{
	// 			console.log(`Beneficiary:${beneficiary} has already registered.`);
	// 			removeWillBeneficiary(beneficiary, ntt54Will)
	// 			.then((res) => {
	// 				console.log(`We have just called removeWillBeneficiary for ${beneficiary}`);
	// 				getWillBeneficiaries(ntt54Will);
	// 			})
	// 			.catch((er) => console.log(`Error in deleteBeneficiary: `,er));
				
	// 		}
	// 		else console.log(`Trying to delete a beneficiary that is not already registered`);
	// 	}
	// }
	

	// const get_BeneficiaryDetails = async (willBeneficiariesArray) => {
	// 	const numOfBeneficiaries = willBeneficiariesArray.length;
	// 	if(numOfBeneficiaries===0) setDetailedBeneficiariesArray([]);
		
    //     let benferiedDetailsArrray = [], count=0;
	// 	const getDetails = async (beneficiaryAdr) => {
	// 		console.log(`Retrieving details for beneficiary:${beneficiaryAdr}`);
	// 		const beneficiaryDetails = await getBeneficiaryDetails(beneficiaryAdr, ntt54Will);
	// 		console.log(`get_BeneficiaryDetails => Received ${beneficiaryAdr} beneficiaryDetails: `,beneficiaryDetails);
	// 		if (beneficiaryDetails) benferiedDetailsArrray.push(beneficiaryDetails);
	// 		count++
			 
	// 		if (count < numOfBeneficiaries) getDetails( willBeneficiariesArray[count] );
	// 		else setDetailedBeneficiariesArray( benferiedDetailsArrray );
	// 	}

	// 	getDetails(willBeneficiariesArray[0]);
	// }

	// const getWillBeneficiaries = async (ntt54Will) => {
	// 	console.log(`Beneficiaries => getRegisteredAccounts is running`);
	// 	const willBeneficiariesArray = await get_WillBeneficiaries(ntt54Will);
	// 	console.log(`Beneficiaries => willBeneficiariesArray: `,willBeneficiariesArray);
	// 	setWillBeneficiaries(willBeneficiariesArray);

	// 	get_BeneficiaryDetails(willBeneficiariesArray);
	// }
    
	// //returns the clicked Account 
	// const getClickedCard = (indx) => {
	// 	console.log(`Beneficiaries The card with index:${indx} has been clicked`);
	// 	if (indx < detailedBeneficiariesArray.length) 
	// 	{
	// 		setBeneficiary(detailedBeneficiariesArray[indx].b_address);
	// 		setClickedAccount(detailedBeneficiariesArray[indx]);
	// 	}
	// }
	//#endregion

	// useEffect(() => {
	// 	console.log(`MYWALLET currentAccount: ${currentAccount}`);
	// 	if (ntt54Will) getWillBeneficiaries(ntt54Will);
	// },[wallet, provider, ntt54Will])


	return(
		<Fragment>
			<div className="form-head mb-sm-3 mb-3 d-flex align-items-center flex-wrap mt-0 text-head">
				<h2 className="font-w600 mb-0 me-auto mb-2">Manage Will</h2>
				{/* <Link to={"#"} className="btn btn-outline-primary me-3 mb-2 rounded">
					<input type="text" value = {beneficiary} placeholder="Beneficiary Address" className="form-control" style={{color:"white", width:"550px"}} onChange={(event) => { 
										setBeneficiary(event.target.value);
									   }
									} />
				</Link> */}
				{/* <Link to={"#"} className="btn btn-primary me-3 mb-2 rounded">
					<button className="btn-primary" style={{border: "none", color:"white"}}  onClick = { () => startAction("register") }>Initiate</button> 
				</Link>
				<Link to={"#"} className="btn btn-primary me-3 mb-2 rounded">
					<button className="btn-primary" style={{border: "none", color:"white"}}  onClick = { () => startAction("amend") }>Void</button> 
				</Link> */}
				{/* <Link to={"#"} className="btn btn-primary me-3 mb-2 rounded">
					<button className="btn-primary" style={{border: "none", color:"white"}}  onClick = { () => startAction("delete") }>Remove   Beneficiary</button> 
				</Link> */}
			</div>
			<div className="row" style={{height:"1360px"}}>
				<div className="col-xl-1 col-xxl-4">
					<div className="swiper-box">
						{/* <BeneficiariesSlider getClickedCard={getClickedCard} detailedBeneficiariesArray={detailedBeneficiariesArray} willBeneficiaries={willBeneficiaries} currentAccount={currentAccount} provider={provider} wallet={wallet} ntt54Will={ntt54Will} allAdminAccounts={"allAdminAccounts"} /> */}
					</div>
				</div>
				<div className="col-xl-10 col-xxl-8">
        				{/* <BenefiiarySettings detailedBeneficiariesArray={detailedBeneficiariesArray} requestingData={requestingData} collectBeneficiaryData={collectBeneficiaryData} currentAccount={currentAccount} clickedAccount={clickedAccount} provider={provider} wallet={wallet} ntt54Will={ntt54Will} /> */}

						<div className="card">
				<div className="card-header border-0 pb-0">
					<h4 className="mb-0 fs-20 text-black">Control Dashboard</h4>
				</div>

				{/* <div className="card-body" style={{overflowY: "scroll", height:"400px"}}> */}
				<div className="card-body" style={{height:"400px"}}>

					{/* <div  className="bg-gradient-1 coin-holding flex-wrap" style={{height:"190px", marginBottom:"15px", backgroundColor:""}}> */}
					{/* <div  className="bg-gradient-1 coin-holding flex-wrap" style={{height:"190px", marginBottom:"15px", backgroundColor:"",}}> */}
					<div style={{backgroundColor:"", height:"180px", textAlign:"center", marginBottom:"0px", marginTop:"-70px"}}>
						<button  className="btn btn-primary me-3 mb-1 mt-1 " style={{border: "none", color:"white", height:"170px", width:"170px", borderRadius:"50%", marginTop:"", backgroundColor:"#831200"}}  onClick = { () => aliveNkicking() }> <h4>Proof of Life </h4>Alive & Kicking</button> 

							{/* <div className="col-xl-3 col-xxl-3" style={{}}>
							
								<div className="mb-2">
									<div className="d-flex align-items-center">
										<div className="ms-3">
											<p className="mb-0 op-6"></p>
										</div>
									</div>
								</div>
							</div> */}

							{/* <div className="col-xl-6 col-xxl-3" style={{backgroundColor:"red", align:"center", marginTop:"0px", padding:"0px"}}> */}
								{/* <div className="mb-2">
									<div className="d-flex align-items-center">
										<div className="ms-3"> */}
											{/* <p className="mb-0 op-6" >Balance </p> */}
											{/* <div className="ms-3" style={{backgroundColor:"", width:"90%"}}> */}
												{/* <button  className="btn btn-primary me-3 mb-1 mt-1 " style={{border: "none", color:"white", width:"100%", borderRadius:"50%"}}  onClick = { () => initiate_Will() }>Check Accounts</button>  */}
											{/* </div> */}
											
										{/* </div>
									</div>
								</div> */}
							{/* </div> */}

							{/* <div className="col-xl-3 col-xxl-3">
								<div className="mb-2">
									<div className="d-flex align-items-center">
									</div>
								</div>
							</div> */}
						</div>

					{/* </div> */}

				<div  className="bg-gradient-1 coin-holding flex-wrap" style={{height:"80px", marginBottom:"15px", backgroundColor:""}}>
						<div className="col-xl-2 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
									<div className="ms-3">
										<p className="mb-0 op-6">Admin Account</p>
									</div>
								</div>
							</div>
						</div>
						<div className="col-xl-4 col-xxl-3"  style={{backgroundColor:""}}>
							<div className="mb-2" style={{backgroundColor:""}}> 
								<div className="d-flex align-items-center"  style={{backgroundColor:""}}>
									<div className="ms-0" style={{backgroundColor:"", width:"100%"}}>
										<input type="text" disabled readOnly value = {willAdmin} placeholder="" className="form-control" style={{color:"white",  textAlign:"center", backgroundColor:"" }} />
									</div>
								</div>
							</div>
						</div>

						<div className="col-xl-1 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
									<div className="ms-3">
										<p className="mb-0 op-6" >Balance</p>
									</div>
								</div>
							</div>
						</div>

						<div className="col-xl-2 col-xxl-3"  style={{backgroundColor:""}}>
							<div className="mb-2" style={{backgroundColor:""}}> 
								<div className="d-flex align-items-center"  style={{backgroundColor:""}}>
									<div className="ms-3" style={{backgroundColor:"", width:"90%"}}>
										<input type="number" step="1" disabled readOnly value = {adminACAbalance} placeholder="" className="form-control" style={{color:"white",  textAlign:"center", backgroundColor:""  }} />
									</div>
								</div>
							</div>
						</div>

						<div className="col-xl-1 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
									<div className="ms-3">
										<p className="mb-0 op-6" >Nonce</p>
									</div>
								</div>
							</div>
						</div>

						<div className="col-xl-2 col-xxl-3"  style={{backgroundColor:""}}>
							<div className="mb-2" style={{backgroundColor:""}}> 
								<div className="d-flex align-items-center"  style={{backgroundColor:""}}>
									<div className="ms-3" style={{backgroundColor:"", width:"90%"}}>
										<input type="text" disabled readOnly value = {adminRegisteredAccounts.length>0? adminRegisteredAccounts[0].nonce:""} placeholder="" className="form-control" style={{color:"white",  textAlign:"center", backgroundColor:""  }} />
									</div>
								</div>
							</div>
						</div>

						{/* <div className="col-xl-4 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
									<div className="ms-3">
										<p className="mb-0 op-6" >Last checkecked: {"2022 02:20:40 GMT+03:00"}</p>
									</div>
								</div>
							</div>
						</div> */}

						{/* <div className="col-xl-2 col-xxl-1"  style={{backgroundColor:""}}>
							<div className="mb-2" style={{backgroundColor:""}}> 
								<div className="d-flex align-items-center"  style={{backgroundColor:""}}>
									<div className="ms-3" style={{backgroundColor:"", width:"90%"}}>
										<input type="number" step="1" disabled readOnly value = {triggerPoint3} placeholder="" className="form-control" style={{color:"white", textAlign:"center", backgroundColor:"#835200" }} />
									</div>
								</div>
							</div>
						</div> */}

						{/* <div className="col-xl-1 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
									<div className="ms-3">
										<p className="mb-0 op-6" >Direction: </p>
									</div>
								</div>
							</div>
						</div> */}

						{/* <div className="col-xl-2 col-xxl-1"  style={{backgroundColor:""}}>
							<div className="mb-2" style={{backgroundColor:""}}> 
								<div className="d-flex align-items-center"  style={{backgroundColor:""}}>
									<div className="ms-3" style={{backgroundColor:"", width:"90%"}}>
										<input type="number" step="1" disabled readOnly value = {lastCallPoint} placeholder="" className="form-control" style={{color:"white", textAlign:"center", backgroundColor:"#831200"  }} />
									</div>
								</div>
							</div>
						</div> */}

						{/* <div className="col-xl-1 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
								</div>
							</div>
						</div> */}

					</div>

					<div  className="bg-gradient-1 coin-holding flex-wrap" style={{height:"80px", marginBottom:"15px", backgroundColor:""}}>
						<div className="col-xl-2 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
									<div className="ms-3">
										<p className="mb-0 op-6">Will Smart Contract </p>
									</div>
								</div>
							</div>
						</div>
						<div className="col-xl-4 col-xxl-3"  style={{backgroundColor:""}}>
							<div className="mb-2" style={{backgroundColor:""}}> 
								<div className="d-flex align-items-center"  style={{backgroundColor:""}}>
									<div className="ms-0" style={{backgroundColor:"", width:"100%"}}>
										<input type="text" disabled readOnly value = {ntt54Will_address} placeholder="" className="form-control" style={{color:"white",  textAlign:"center", backgroundColor:"" }} />
									</div>
								</div>
							</div>
						</div>

						<div className="col-xl-1 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
									<div className="ms-3">
										<p className="mb-0 op-6" >Balance Fees</p>
									</div>
								</div>
							</div>
						</div>

						<div className="col-xl-2 col-xxl-3"  style={{backgroundColor:""}}>
							<div className="mb-2" style={{backgroundColor:""}}> 
								<div className="d-flex align-items-center"  style={{backgroundColor:""}}>
									<div className="ms-3" style={{backgroundColor:"", width:"90%"}}>
										<input type="number" step="1" disabled readOnly value = {feesBalances.length>0?feesBalances[0].NumTokens:""} placeholder="" className="form-control" style={{color:"white",  textAlign:"center", backgroundColor:""  }} />
									</div>
								</div>
							</div>
						</div>

						<div className="col-xl-1 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
									<div className="ms-3">
										<p className="mb-0 op-6" >Nonce</p>
									</div>
								</div>
							</div>
						</div>

						<div className="col-xl-2 col-xxl-3"  style={{backgroundColor:""}}>
							<div className="mb-2" style={{backgroundColor:""}}> 
								<div className="d-flex align-items-center"  style={{backgroundColor:""}}>
									<div className="ms-3" style={{backgroundColor:"", width:"90%"}}>
										<input type="text" disabled readOnly value = {sc_nonce} placeholder="" className="form-control" style={{color:"white",  textAlign:"center", backgroundColor:""  }} />
									</div>
								</div>
							</div>
						</div>

						{/* <div className="col-xl-4 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
									<div className="ms-3">
										<p className="mb-0 op-6" >Last checkecked: {"2022 02:20:40 GMT+03:00"}</p>
									</div>
								</div>
							</div>
						</div> */}

						{/* <div className="col-xl-2 col-xxl-1"  style={{backgroundColor:""}}>
							<div className="mb-2" style={{backgroundColor:""}}> 
								<div className="d-flex align-items-center"  style={{backgroundColor:""}}>
									<div className="ms-3" style={{backgroundColor:"", width:"90%"}}>
										<input type="number" step="1" disabled readOnly value = {triggerPoint3} placeholder="" className="form-control" style={{color:"white", textAlign:"center", backgroundColor:"#835200" }} />
									</div>
								</div>
							</div>
						</div> */}

						{/* <div className="col-xl-1 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
									<div className="ms-3">
										<p className="mb-0 op-6" >Direction: </p>
									</div>
								</div>
							</div>
						</div> */}

						{/* <div className="col-xl-2 col-xxl-1"  style={{backgroundColor:""}}>
							<div className="mb-2" style={{backgroundColor:""}}> 
								<div className="d-flex align-items-center"  style={{backgroundColor:""}}>
									<div className="ms-3" style={{backgroundColor:"", width:"90%"}}>
										<input type="number" step="1" disabled readOnly value = {lastCallPoint} placeholder="" className="form-control" style={{color:"white", textAlign:"center", backgroundColor:"#831200"  }} />
									</div>
								</div>
							</div>
						</div> */}

						{/* <div className="col-xl-1 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
								</div>
							</div>
						</div> */}

					</div>

					<div  className="bg-gradient-1 coin-holding flex-wrap" style={{height:"80px", marginBottom:"15px", backgroundColor:""}}>
						<div className="col-xl-2 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
									<div className="ms-3">
										<p className="mb-0 op-6">Will Smart Contract </p>
									</div>
								</div>
							</div>
						</div>
						<div className="col-xl-4 col-xxl-3"  style={{backgroundColor:""}}>
							<div className="mb-2" style={{backgroundColor:""}}> 
								<div className="d-flex align-items-center"  style={{backgroundColor:""}}>
									<div className="ms-0" style={{backgroundColor:"", width:"100%"}}>
										<input type="text" disabled readOnly value = {ntt54Will_address} placeholder="" className="form-control" style={{color:"white",  textAlign:"center", backgroundColor:"", fontSize:"" }} />
									</div>
								</div>
							</div>
						</div>

						<div className="col-xl-1 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
									<div className="ms-3">
										<p className="mb-0 op-6" >All Balances</p>
									</div>
								</div>
							</div>
						</div>

						<div className="col-xl-1 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
									<div className="ms-3">
										<p className="mb-0 op-6"><span style={{color:"white", marginRight:"10px"}}>{scAllBalances.length>0?Number(scAllBalances[0].NumTokens).toFixed(2):""}</span>ACA</p>
									</div>
								</div>
							</div>
						</div>
						<div className="col-xl-1 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
									<div className="ms-3">
										<p className="mb-0 op-6"><span style={{color:"white", marginRight:"10px"}}>{scAllBalances.length>0?Number(scAllBalances[1].NumTokens).toFixed(2):""}</span> AUSD</p>
									</div>
								</div>
							</div>
						</div>
						<div className="col-xl-1 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
									<div className="ms-3">
										<p className="mb-0 op-6"><span style={{color:"white", marginRight:"10px"}}>{scAllBalances.length>0?Number(scAllBalances[2].NumTokens).toFixed(2):""}</span> DOT</p>
									</div>
								</div>
							</div>
						</div>

						<div className="col-xl-1 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
									<div className="ms-3">
										<p className="mb-0 op-6"><span style={{color:"white", marginRight:"10px"}}>{scAllBalances.length>0?Number(scAllBalances[3].NumTokens).toFixed(2):""}</span> LDOT</p>
									</div>
								</div>
							</div>
						</div>

						<div className="col-xl-1 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
									<div className="ms-3">
										<p className="mb-0 op-6"><span style={{color:"white", marginRight:"10px"}}>{scAllBalances.length>0?Number(scAllBalances[4].NumTokens).toFixed(2):""}</span>RENBTC</p>
									</div>
								</div>
							</div>
						</div>

					</div>


					<div  className="bg-gradient-1 coin-holding flex-wrap" style={{height:"80px", marginBottom:"15px", backgroundColor:""}}>
						<div className="col-xl-2 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
									<div className="ms-3">
										<p className="mb-0 op-6">Admin </p>
									</div>
								</div>
							</div>
						</div>
						<div className="col-xl-4 col-xxl-3"  style={{backgroundColor:""}}>
							<div className="mb-2" style={{backgroundColor:""}}> 
								<div className="d-flex align-items-center"  style={{backgroundColor:""}}>
									<div className="ms-0" style={{backgroundColor:"", width:"100%"}}>
										<input type="text" disabled readOnly value = {willAdmin} placeholder="" className="form-control" style={{color:"white",  textAlign:"center", backgroundColor:"", fontSize:"" }} />
									</div>
								</div>
							</div>
						</div>

						<div className="col-xl-1 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
									<div className="ms-3">
										<p className="mb-0 op-6" >All Balances</p>
									</div>
								</div>
							</div>
						</div>

						<div className="col-xl-1 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
									<div className="ms-3">
										<p className="mb-0 op-6"><span style={{color:"white", marginRight:"10px"}}>{
											registeredAccountsBalances.length>0? Number(registeredAccountsBalances[0][0]["NumTokens"]).toFixed(2):""
										}</span>ACA</p>
									</div>
								</div>
							</div>
						</div>
						<div className="col-xl-1 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
									<div className="ms-3">
										<p className="mb-0 op-6"><span style={{color:"white", marginRight:"10px"}}>{
											registeredAccountsBalances.length>0? Number(registeredAccountsBalances[0][1]["NumTokens"]).toFixed(2):""
										}</span> AUSD</p>
									</div>
								</div>
							</div>
						</div>
						<div className="col-xl-1 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
									<div className="ms-3">
										<p className="mb-0 op-6"><span style={{color:"white", marginRight:"10px"}}>{
											registeredAccountsBalances.length>0? Number(registeredAccountsBalances[0][2]["NumTokens"]).toFixed(2):""
										}</span> DOT</p>
									</div>
								</div>
							</div>
						</div>

						<div className="col-xl-1 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
									<div className="ms-3">
										<p className="mb-0 op-6"><span style={{color:"white", marginRight:"10px"}}>{
											registeredAccountsBalances.length>0? Number(registeredAccountsBalances[0][3]["NumTokens"]).toFixed(2):""
										}</span> LDOT</p>
									</div>
								</div>
							</div>
						</div>

						<div className="col-xl-1 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
									<div className="ms-3">
										<p className="mb-0 op-6"><span style={{color:"white", marginRight:"10px"}}>{
											registeredAccountsBalances.length>0? Number(registeredAccountsBalances[0][4]["NumTokens"]).toFixed(2):""
										}</span>RENBTC</p>
									</div>
								</div>
							</div>
						</div>

					</div>

					<div  className="bg-gradient-1 coin-holding flex-wrap" style={{height:"80px", marginBottom:"15px", backgroundColor:""}}>
						<div className="col-xl-2 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
									<div className="ms-3">
										<p className="mb-0 op-6">Beneficiary 1</p>
									</div>
								</div>
							</div>
						</div>
						<div className="col-xl-4 col-xxl-3"  style={{backgroundColor:""}}>
							<div className="mb-2" style={{backgroundColor:""}}> 
								<div className="d-flex align-items-center"  style={{backgroundColor:""}}>
									<div className="ms-0" style={{backgroundColor:"", width:"100%"}}>
										<input type="text" disabled readOnly value = {
										willBeneficiaries.length>0?willBeneficiaries[0]:""	
									  } placeholder="" className="form-control" style={{color:"white",  textAlign:"center", backgroundColor:"", fontSize:"" }} />
									</div>
								</div>
							</div>
						</div>

						<div className="col-xl-1 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
									<div className="ms-3">
										<p className="mb-0 op-6" >All Balances</p>
									</div>
								</div>
							</div>
						</div>

						<div className="col-xl-1 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
									<div className="ms-3">
										<p className="mb-0 op-6"><span style={{color:"white", marginRight:"10px"}}>{
										beneficiariesBalances.length>0? Number(beneficiariesBalances[0][0]["NumTokens"]).toFixed(2):""
										}</span>ACA</p>
									</div>
								</div>
							</div>
						</div>
						<div className="col-xl-1 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
									<div className="ms-3">
										<p className="mb-0 op-6"><span style={{color:"white", marginRight:"10px"}}>{
											beneficiariesBalances.length>0? Number(beneficiariesBalances[0][1]["NumTokens"]).toFixed(2):""
										}</span> AUSD</p>
									</div>
								</div>
							</div>
						</div>
						<div className="col-xl-1 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
									<div className="ms-3">
										<p className="mb-0 op-6"><span style={{color:"white", marginRight:"10px"}}>{
											beneficiariesBalances.length>0? Number(beneficiariesBalances[0][2]["NumTokens"]).toFixed(2):""
										}</span> DOT</p>
									</div>
								</div>
							</div>
						</div>

						<div className="col-xl-1 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
									<div className="ms-3">
										<p className="mb-0 op-6"><span style={{color:"white", marginRight:"10px"}}>{
											beneficiariesBalances.length>0? Number(beneficiariesBalances[0][3]["NumTokens"]).toFixed(2):""
										}</span> LDOT</p>
									</div>
								</div>
							</div>
						</div>

						<div className="col-xl-1 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
									<div className="ms-3">
										<p className="mb-0 op-6"><span style={{color:"white", marginRight:"10px"}}>{
											beneficiariesBalances.length>0? Number(beneficiariesBalances[0][4]["NumTokens"]).toFixed(2):""
										}</span>RENBTC</p>
									</div>
								</div>
							</div>
						</div>

					</div>

						<div  className="bg-gradient-1 coin-holding flex-wrap" style={{height:"80px", marginBottom:"15px", backgroundColor:""}}>
						<div className="col-xl-2 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
									<div className="ms-3">
										<p className="mb-0 op-6">Beneficiary 2</p>
									</div>
								</div>
							</div>
						</div>
						<div className="col-xl-4 col-xxl-3"  style={{backgroundColor:""}}>
							<div className="mb-2" style={{backgroundColor:""}}> 
								<div className="d-flex align-items-center"  style={{backgroundColor:""}}>
									<div className="ms-0" style={{backgroundColor:"", width:"100%"}}>
										<input type="text" disabled readOnly value = {
												willBeneficiaries.length>1?willBeneficiaries[1]:""	
											} placeholder="" className="form-control" style={{color:"white",  textAlign:"center", backgroundColor:"", fontSize:"" }} />
									</div>
								</div>
							</div>
						</div>

						<div className="col-xl-1 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
									<div className="ms-3">
										<p className="mb-0 op-6" >All Balances</p>
									</div>
								</div>
							</div>
						</div>

						<div className="col-xl-1 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
									<div className="ms-3">
										<p className="mb-0 op-6"><span style={{color:"white", marginRight:"10px"}}>{
											beneficiariesBalances.length>1? Number(beneficiariesBalances[1][0]["NumTokens"]).toFixed(2):""
										}</span>ACA</p>
									</div>
								</div>
							</div>
						</div>
						<div className="col-xl-1 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
									<div className="ms-3">
										<p className="mb-0 op-6"><span style={{color:"white", marginRight:"10px"}}>{
											beneficiariesBalances.length>1? Number(beneficiariesBalances[1][1]["NumTokens"]).toFixed(2):""
										}</span> AUSD</p>
									</div>
								</div>
							</div>
						</div>
						<div className="col-xl-1 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
									<div className="ms-3">
										<p className="mb-0 op-6"><span style={{color:"white", marginRight:"10px"}}>{
											beneficiariesBalances.length>1? Number(beneficiariesBalances[1][2]["NumTokens"]).toFixed(2):""
										}</span> DOT</p>
									</div>
								</div>
							</div>
						</div>

						<div className="col-xl-1 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
									<div className="ms-3">
										<p className="mb-0 op-6"><span style={{color:"white", marginRight:"10px"}}>{
											beneficiariesBalances.length>1? Number(beneficiariesBalances[1][3]["NumTokens"]).toFixed(2):""
										}</span> LDOT</p>
									</div>
								</div>
							</div>
						</div>

						<div className="col-xl-1 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
									<div className="ms-3">
										<p className="mb-0 op-6"><span style={{color:"white", marginRight:"10px"}}>{
										  	beneficiariesBalances.length>1? Number(beneficiariesBalances[1][4]["NumTokens"]).toFixed(2):""
										}</span>RENBTC</p>
									</div>
								</div>
							</div>
						</div>

					</div>

					



					<div  className="bg-gradient-1 coin-holding flex-wrap" style={{height:"80px", marginBottom:"15px", backgroundColor:""}}>
						<div className="col-xl-3 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
									<div className="ms-3">
										<p className="mb-0 op-6" ></p>
									</div>
								</div>
							</div>
						</div>
						<div className="col-xl-3 col-xxl-3"  style={{backgroundColor:""}}>
							<div className="mb-2" style={{backgroundColor:""}}> 
								<div className="d-flex align-items-center"  style={{backgroundColor:""}}>
									<div className="ms-3" style={{backgroundColor:"", width:"90%"}}>
										<button  className="btn btn-primary me-3 mb-1 mt-1 rounded" style={{border: "none", color:"white", width:"100%"}}  onClick = { () => check_AdminBalance() }>Check Accounts</button> 
									</div>
								</div>
							</div>
						</div>

						<div className="col-xl-3 col-xxl-3"  style={{backgroundColor:""}}>
							<div className="mb-2" style={{backgroundColor:""}}> 
								<div className="d-flex align-items-center"  style={{backgroundColor:""}}>
									<div className="ms-3" style={{backgroundColor:"", width:"90%"}}>
										{/* <input type="text" value = {multisig2} placeholder="0x12345679ABCDEF2" className="form-control" style={{color:"white", }} onChange={(event) => { 
										setMultisi2(event.target.value);
									   }
									} /> */}
										<button  className="btn btn-secondary me-3 mb-1 mt-1 rounded" style={{border: "none", color:"black", width:"100%"}}  onClick = { () => check_WillStage() }>Check Will Stage</button> 

									</div>
								</div>
							</div>
						</div>

						<div className="col-xl-3 col-xxl-3"  style={{backgroundColor:""}}>
							<div className="mb-2" style={{backgroundColor:""}}> 
								<div className="d-flex align-items-center"  style={{backgroundColor:""}}>
									<div className="ms-3" style={{backgroundColor:"", width:"90%"}}>
										{/* <input type="text" value = {multisig3} placeholder="0x12345679ABCDE3" className="form-control" style={{color:"white", }} onChange={(event) => { 
										setMultisi3(event.target.value);
									   }
									} /> */}
									</div>
								</div>
							</div>
						</div>

						{/* <div className="col-xl-1 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
								</div>
							</div>
						</div> */}
					</div>

				{/* <div className="card-header border-0 pb-0"> */}
					<h4 className="mb-0 fs-20 text-black" style={{marginTop:"0px"}}>Will Settings</h4>
				{/* </div> */}

					<div  className="bg-gradient-1 coin-holding flex-wrap" style={{height:"80px", marginBottom:"15px", backgroundColor:""}}>
						<div className="col-xl-1 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
									<div className="ms-3">
										<p className="mb-0 op-6" >Will State</p>
									</div>
								</div>
							</div>
						</div>
						<div className="col-xl-1 col-xxl-3"  style={{backgroundColor:""}}>
							<div className="mb-2" style={{backgroundColor:""}}> 
								<div className="d-flex align-items-center"  style={{backgroundColor:""}}>
									<div className="ms-3" style={{backgroundColor:"", width:"90%"}}>
										<input type="text" disabled readOnly value = {willState===true?"Active":"Not Activated"} placeholder="" className="form-control" style={{color:"white",  textAlign:"center",  }} />
									</div>
								</div>
							</div>
						</div>

						<div className="col-xl-1 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
									<div className="ms-3">
										<p className="mb-0 op-6" >Will Stage #</p>
									</div>
								</div>
							</div>
						</div>

						<div className="col-xl-1 col-xxl-3"  style={{backgroundColor:""}}>
							<div className="mb-2" style={{backgroundColor:""}}> 
								<div className="d-flex align-items-center"  style={{backgroundColor:""}}>
									<div className="ms-3" style={{backgroundColor:"", width:"90%"}}>
										<input type="number" step="1" disabled readOnly value = {willStage} placeholder="" className="form-control" style={{color:"white",  textAlign:"center",   }} />
									</div>
								</div>
							</div>
						</div>

						{/* <div className="col-xl-2 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
									<div className="ms-3">
										<p className="mb-0 op-6" >Trigger Point3 #</p>
									</div>
								</div>
							</div>
						</div>

						<div className="col-xl-2 col-xxl-1"  style={{backgroundColor:""}}>
							<div className="mb-2" style={{backgroundColor:""}}> 
								<div className="d-flex align-items-center"  style={{backgroundColor:""}}>
									<div className="ms-3" style={{backgroundColor:"", width:"90%"}}>
										<input type="number" step="1" disabled value = {triggerPoint3} placeholder="" className="form-control" style={{color:"white", textAlign:"center", backgroundColor:"#835200" }} />
									</div>
								</div>
							</div>
						</div>

						<div className="col-xl-2 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
									<div className="ms-3">
									</div>
								</div>
							</div>
						</div> */}



						<div className="col-xl-1 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
									<div className="ms-3">
										<p className="mb-0 op-6">#Trigger Point 1</p>
									</div>
								</div>
							</div>
						</div>
						<div className="col-xl-1 col-xxl-3"  style={{backgroundColor:""}}>
							<div className="mb-2" style={{backgroundColor:""}}> 
								<div className="d-flex align-items-center"  style={{backgroundColor:""}}>
									<div className="ms-3" style={{backgroundColor:"", width:"90%"}}>
										<input type="number" step="1" disabled readOnly value = {triggerPoint1} placeholder="" className="form-control" style={{color:"white",  textAlign:"center", backgroundColor:"#02BAB2" }} />
									</div>
								</div>
							</div>
						</div>

						<div className="col-xl-1 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
									<div className="ms-3">
										<p className="mb-0 op-6">#Trigger Point 2</p>
									</div>
								</div>
							</div>
						</div>

						<div className="col-xl-1 col-xxl-3"  style={{backgroundColor:""}}>
							<div className="mb-2" style={{backgroundColor:""}}> 
								<div className="d-flex align-items-center"  style={{backgroundColor:""}}>
									<div className="ms-3" style={{backgroundColor:"", width:"90%"}}>
										<input type="number" step="1" disabled readOnly value = {triggerPoint2} placeholder="" className="form-control" style={{color:"white",  textAlign:"center", backgroundColor:"#98A700"  }} />
									</div>
								</div>
							</div>
						</div>

						<div className="col-xl-1 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
									<div className="ms-3">
										<p className="mb-0 op-6" >#Trigger Point 3</p>
									</div>
								</div>
							</div>
						</div>

						<div className="col-xl-1 col-xxl-1"  style={{backgroundColor:""}}>
							<div className="mb-2" style={{backgroundColor:""}}> 
								<div className="d-flex align-items-center"  style={{backgroundColor:""}}>
									<div className="ms-3" style={{backgroundColor:"", width:"90%"}}>
										<input type="number" step="1" disabled readOnly value = {triggerPoint3} placeholder="" className="form-control" style={{color:"white", textAlign:"center", backgroundColor:"#835200" }} />
									</div>
								</div>
							</div>
						</div>

						<div className="col-xl-1 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
									<div className="ms-3">
										<p className="mb-0 op-6" >#Last Call Point</p>
									</div>
								</div>
							</div>
						</div>

						<div className="col-xl-1 col-xxl-1"  style={{backgroundColor:""}}>
							<div className="mb-2" style={{backgroundColor:""}}> 
								<div className="d-flex align-items-center"  style={{backgroundColor:""}}>
									<div className="ms-3" style={{backgroundColor:"", width:"90%"}}>
										<input type="number" step="1" disabled readOnly value = {lastCallPoint} placeholder="" className="form-control" style={{color:"white", textAlign:"center", backgroundColor:"#831200"  }} />
									</div>
								</div>
							</div>
						</div>

						{/* <div className="col-xl-2 col-xxl-1"  style={{backgroundColor:""}}>
							<div className="mb-2" style={{backgroundColor:""}}> 
								<div className="d-flex align-items-center"  style={{backgroundColor:""}}>
									<div className="ms-3" style={{backgroundColor:"", width:"90%"}}>
									</div>
								</div>
							</div>
						</div> */}



						{/* <div className="col-xl-2 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
								</div>
							</div>
						</div> */}
					</div>


					{/* <div  className="bg-gradient-1 coin-holding flex-wrap" style={{height:"80px", marginBottom:"15px", backgroundColor:""}}>
						<div className="col-xl-1 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
									<div className="ms-3">
										<p className="mb-0 op-6" >Trigger Point1 #</p>
									</div>
								</div>
							</div>
						</div>
						<div className="col-xl-2 col-xxl-3"  style={{backgroundColor:""}}>
							<div className="mb-2" style={{backgroundColor:""}}> 
								<div className="d-flex align-items-center"  style={{backgroundColor:""}}>
									<div className="ms-3" style={{backgroundColor:"", width:"90%"}}>
										<input type="number" step="1" disabled readOnly value = {triggerPoint1} placeholder="" className="form-control" style={{color:"white",  textAlign:"center", backgroundColor:"#02BAB2" }} />
									</div>
								</div>
							</div>
						</div>

						<div className="col-xl-1 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
									<div className="ms-3">
										<p className="mb-0 op-6" >Trigger Point2 #</p>
									</div>
								</div>
							</div>
						</div>

						<div className="col-xl-2 col-xxl-3"  style={{backgroundColor:""}}>
							<div className="mb-2" style={{backgroundColor:""}}> 
								<div className="d-flex align-items-center"  style={{backgroundColor:""}}>
									<div className="ms-3" style={{backgroundColor:"", width:"90%"}}>
										<input type="number" step="1" disabled readOnly value = {triggerPoint2} placeholder="" className="form-control" style={{color:"white",  textAlign:"center", backgroundColor:"#98A700"  }} />
									</div>
								</div>
							</div>
						</div>

						<div className="col-xl-1 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
									<div className="ms-3">
										<p className="mb-0 op-6" >Trigger Point3 #</p>
									</div>
								</div>
							</div>
						</div>

						<div className="col-xl-2 col-xxl-1"  style={{backgroundColor:""}}>
							<div className="mb-2" style={{backgroundColor:""}}> 
								<div className="d-flex align-items-center"  style={{backgroundColor:""}}>
									<div className="ms-3" style={{backgroundColor:"", width:"90%"}}>
										<input type="number" step="1" disabled readOnly value = {triggerPoint3} placeholder="" className="form-control" style={{color:"white", textAlign:"center", backgroundColor:"#835200" }} />
									</div>
								</div>
							</div>
						</div>

						<div className="col-xl-1 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
									<div className="ms-3">
										<p className="mb-0 op-6" >Last Call Point #</p>
									</div>
								</div>
							</div>
						</div>

						<div className="col-xl-2 col-xxl-1"  style={{backgroundColor:""}}>
							<div className="mb-2" style={{backgroundColor:""}}> 
								<div className="d-flex align-items-center"  style={{backgroundColor:""}}>
									<div className="ms-3" style={{backgroundColor:"", width:"90%"}}>
										<input type="number" step="1" disabled readOnly value = {lastCallPoint} placeholder="" className="form-control" style={{color:"white", textAlign:"center", backgroundColor:"#831200"  }} />
									</div>
								</div>
							</div>
						</div>

						<div className="col-xl-1 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
								</div>
							</div>
						</div>

					</div> */}




				</div>
			</div>







				</div>
			</div>
		</Fragment>
	)
}		
export default MyWallet;