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



import { set_WillGeneralMessage, set_Will, void_Will, getWillStats, getWillState, getWillStage } from '../../../ntt54_accounts.js';         

// import QuickTransfer from '../Boltz/Home/QuickTransfer';

const CoinChart = loadable(() =>
  pMinDelay(import("../Boltz/MyWallet/CoinChart"), 1000)
);

const MyWallet = ({ currentAccount, provider, wallet, ntt54Will }) => {
	const { background } = useContext(ThemeContext);

	const [finalMsg  , setFinalMsg]           = useState("");
	const [trigger1dt, setTrigger1dt]         = useState("");
	const [trigger2dt, setTrigger2dt]         = useState("");
	const [trigger3dt, setTrigger3dt]         = useState("");
	const [lastCalldt, setLastCalldt]         = useState("");
	const [initBtn_Disabled, setInitBtn_Disabled] = useState(false);
	const [voidBtn_Disabled, setVoidBtn_Disabled] = useState(true);


	const [willState  , setWillState]   = useState(false);
	const [willStage  , setWillStage]   = useState("");



	const [willIssueBlockNum  , setWillIssueBlockNum]   = useState("");
	const [willIssueTimeStamp , setWillIssueTimeStamp]  = useState("");
	const [willGeneralMessage , setWillGeneralMessage]  = useState("");
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


	const initiate_Will = async (_action) => {
		console.log(`Intiting Will. Please wait...`);
		setInitBtn_Disabled(true);

		// set_WillGeneralMessage(finalMsg, ntt54Will)
		set_WillGeneralMessage(finalMsg,trigger1dt,trigger2dt,trigger3dt,lastCalldt,ntt54Will)
		.then((res) => {
			console.log(`Tx to set_WillGeneralMessage is mined.`);
			// return set_Will(trigger1dt,trigger2dt,trigger3dt,lastCalldt,ntt54Will)
			return set_Will(ntt54Will);
		})
		.then((res) => {
			console.log(`Tx to set_Will is mined.`);
			setVoidBtn_Disabled(false);
			readWillValues();
		})
		.catch((er) => console.log(`Error in initiate_Will: `,er));

	}

	const voidWill = async (_action) => {
		console.log(`Voiding existing Will. Please wait...`);
		setVoidBtn_Disabled(true);

		void_Will(ntt54Will)
		.then((res) => {
			console.log(`Tx to void_Will is mined.`);
			setInitBtn_Disabled(false);
			readWillValues();
		})
		.catch((er) => console.log(`Error in approveToken: `,er));
	}


	const readWillValues = async () => {
		console.log(`InitiateWill Reading Will Specs. Please wait...`);
		const willSpecs = await getWillStats(ntt54Will);
		const will_State = await getWillState(ntt54Will);
		if (will_State) { setInitBtn_Disabled(true); setVoidBtn_Disabled(false); }
		else { setInitBtn_Disabled(false); setVoidBtn_Disabled(true); }
		const will_Stage = await getWillStage(ntt54Will);
		setWillIssueBlockNum(willSpecs.willIssueBlockNum);
		setWillIssueTimeStamp(willSpecs.willIssueTimeStamp);
		setWillGeneralMessage(willSpecs.willGeneralMessage);
		setTriggerPoint1(willSpecs.triggerPoint1);
;		setTriggerPoint2(willSpecs.triggerPoint2);
		setTriggerPoint3(willSpecs.triggerPoint3);
		setLastCallPoint(willSpecs.lastCallPoint);
		setWillState(will_State);
		setWillStage(will_Stage);
		console.log(`InitiateWill willSpecs: `,willSpecs);
	}

	useEffect(() => {
		readWillValues();
	},[])



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
			<div className="form-head mb-sm-3 mb-3 d-flex align-items-center flex-wrap mt-3 text-head">
				<h2 className="font-w600 mb-0 me-auto mb-2">Will Initiation</h2>
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
			<div className="row">
				<div className="col-xl-1 col-xxl-4">
					<div className="swiper-box">
						{/* <BeneficiariesSlider getClickedCard={getClickedCard} detailedBeneficiariesArray={detailedBeneficiariesArray} willBeneficiaries={willBeneficiaries} currentAccount={currentAccount} provider={provider} wallet={wallet} ntt54Will={ntt54Will} allAdminAccounts={"allAdminAccounts"} /> */}
					</div>
				</div>
				<div className="col-xl-10 col-xxl-8">
        				{/* <BenefiiarySettings detailedBeneficiariesArray={detailedBeneficiariesArray} requestingData={requestingData} collectBeneficiaryData={collectBeneficiaryData} currentAccount={currentAccount} clickedAccount={clickedAccount} provider={provider} wallet={wallet} ntt54Will={ntt54Will} /> */}

						<div className="card">
				<div className="card-header border-0 pb-0">
					<h4 className="mb-0 fs-20 text-black">Initiation Settings</h4>
				</div>

				{/* <div className="card-body" style={{overflowY: "scroll", height:"400px"}}> */}
				<div className="card-body" style={{height:"400px"}}>


				    {/* <div key={1} className="bg-gradient-1 coin-holding flex-wrap" style={{height:"90px", marginBottom:"15px", backgroundColor:""}}>
						<div className="col-xl-2 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
									<div className="ms-3">
										<p className="mb-0 op-6" >Message</p>
									</div>
								</div>
							</div>
						</div>
						<div className="col-xl-3 col-xxl-3"  style={{backgroundColor:""}}>
							<div className="mb-2" style={{backgroundColor:""}}> 
								<div className="d-flex align-items-center"  style={{backgroundColor:""}}>
									<div className="ms-3" style={{backgroundColor:"", width:"90%"}}>
										<input type="text" value = {nickname } placeholder="Nickname for beneficiary e.g. Entrietta Daughter" className="form-control" style={{color:"white", width:"100%"}} onChange={(event) => { 
										setNickname(event.target.value);
									   }
									} />
									</div>
								</div>
							</div>
						</div>
					    <div className="col-xl-5 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
								</div>
							</div>
						</div>
						<div className="col-xl-2 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
								</div>
							</div>
						</div>
					</div> */}
					

					<div className="bg-gradient-1 coin-holding flex-wrap" style={{height:"90px", marginBottom:"15px", backgroundColor:""}}>
						<div className="col-xl-2 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
									<div className="ms-3">
										<p className="mb-0 op-6" >Set Final Message</p>
									</div>
								</div>
							</div>
						</div>
						<div className="col-xl-9 col-xxl-3"  style={{backgroundColor:""}}>
							<div className="mb-2" style={{backgroundColor:""}}> 
								<div className="d-flex align-items-center"  style={{backgroundColor:""}}>
									<div className="ms-3" style={{backgroundColor:"", width:"90%"}}>
										<input type="text" value = {finalMsg } placeholder="e.g. This is my last will. It has been great fun coding in Substrate and Solidity." className="form-control" style={{color:"white", width:"100%"}} onChange={(event) => { 
										setFinalMsg(event.target.value);
									   }
									} />
									</div>
								</div>
							</div>
						</div>
					    <div className="col-xl-1 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
									{/* <button className="btn btn-outline-primary btn-success me-3 mb-2 rounded" style={{border: "none", color:"black", width:"150px"}}  onClick = { () => approveToken("_portfolio[index]") }>Edit</button>  */}
								</div>
							</div>
						</div>
						<div className="col-xl-1 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
									{/* <button className="btn btn-warning me-3 mb-2 rounded" style={{border: "none", color:"black", width:"150px"}}  onClick = { () => registerToken("_portfolio[index]") }>Save</button>  */}
								</div>
							</div>
						</div>
					</div>

					{/* <div key={3} className="bg-gradient-1 coin-holding flex-wrap" style={{height:"90px", marginBottom:"15px", backgroundColor:""}}>
						<div className="col-xl-2 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
									<div className="ms-3">
										<p className="mb-0 op-6" >Cash Percentage</p>
									</div>
								</div>
							</div>
						</div>
						<div className="col-xl-3 col-xxl-3"  style={{backgroundColor:""}}>
							<div className="mb-2" style={{backgroundColor:""}}> 
								<div className="d-flex align-items-center"  style={{backgroundColor:""}}>
									<div className="ms-3" style={{backgroundColor:"", width:"90%"}}>
										<input type="text" value = {cashPercentage } placeholder="25" className="form-control" style={{color:"white", width:"100%"}} onChange={(event) => { 
										setCashPercentage(event.target.value);
									   }
									} />
									</div>
								</div>
							</div>
						</div>
					    <div className="col-xl-5 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
								</div>
							</div>
						</div>
						<div className="col-xl-2 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
								</div>
							</div>
						</div>
					</div> */}

					{/* <div key={4} className="bg-gradient-1 coin-holding flex-wrap" style={{height:"90px", marginBottom:"15px", backgroundColor:""}}>
						<div className="col-xl-2 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
									<div className="ms-3">
										<p className="mb-0 op-6" >Non Fungible Asset (NFT)</p>
									</div>
								</div>
							</div>
						</div>
						<div className="col-xl-3 col-xxl-3"  style={{backgroundColor:""}}>
							<div className="mb-2" style={{backgroundColor:""}}> 
								<div className="d-flex align-items-center"  style={{backgroundColor:""}}>
									<div className="ms-3" style={{backgroundColor:"", width:"90%"}}>
										<input type="text" value = {nftAddress } placeholder="0x12345679ABCDEF" className="form-control" style={{color:"white", width:"100%"}} onChange={(event) => { 
										setNftAddress(event.target.value);
									   }
									} />
									</div>
								</div>
							</div>
						</div>
					    <div className="col-xl-5 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
								</div>
							</div>
						</div>
						<div className="col-xl-2 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
								</div>
							</div>
						</div>
					</div> */}

					<div  className="bg-gradient-1 coin-holding flex-wrap" style={{height:"90px", marginBottom:"15px", backgroundColor:""}}>
						<div className="col-xl-2 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
									<div className="ms-3">
										<p className="mb-0 op-6" >Send 1st alert in #blocks after initiation</p>
									</div>
								</div>
							</div>
						</div>
						<div className="col-xl-1 col-xxl-3"  style={{backgroundColor:""}}>
							<div className="mb-2" style={{backgroundColor:""}}> 
								<div className="d-flex align-items-center"  style={{backgroundColor:""}}>
									<div className="ms-3" style={{backgroundColor:"", width:"90%"}}>
										<input type="number" step="1" value = {trigger1dt} placeholder="10" className="form-control" style={{color:"white",  textAlign:"center", backgroundColor:"#02BAB2" }} onChange={(event) => { 
										setTrigger1dt(event.target.value);
									   }
									} />
									</div>
								</div>
							</div>
						</div>

						<div className="col-xl-2 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
									<div className="ms-3">
										<p className="mb-0 op-6" >Send 2nd alert in #blocks after 1st alert</p>
									</div>
								</div>
							</div>
						</div>

						<div className="col-xl-1 col-xxl-3"  style={{backgroundColor:""}}>
							<div className="mb-2" style={{backgroundColor:""}}> 
								<div className="d-flex align-items-center"  style={{backgroundColor:""}}>
									<div className="ms-3" style={{backgroundColor:"", width:"90%"}}>
										<input type="number" step="1" value = {trigger2dt} placeholder="5" className="form-control" style={{color:"white",  textAlign:"center", backgroundColor:"#98A700"  }} onChange={(event) => { 
										setTrigger2dt(event.target.value);
									   }
									} />
									</div>
								</div>
							</div>
						</div>

						<div className="col-xl-2 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
									<div className="ms-3">
										<p className="mb-0 op-6" >Send 3rd alert in #blocks after 2nd alert</p>
									</div>
								</div>
							</div>
						</div>

						<div className="col-xl-1 col-xxl-1"  style={{backgroundColor:""}}>
							<div className="mb-2" style={{backgroundColor:""}}> 
								<div className="d-flex align-items-center"  style={{backgroundColor:""}}>
									<div className="ms-3" style={{backgroundColor:"", width:"90%"}}>
										<input type="number" step="1" value = {trigger3dt} placeholder="3" className="form-control" style={{color:"white", textAlign:"center", backgroundColor:"#835200" }} onChange={(event) => { 
										setTrigger3dt(event.target.value);
									   }
									} />
									</div>
								</div>
							</div>
						</div>

						<div className="col-xl-2 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
									<div className="ms-3">
										<p className="mb-0 op-6" >Transfer funds to SC and Last Call in #blocks after 3rd alert</p>
									</div>
								</div>
							</div>
						</div>

						<div className="col-xl-1 col-xxl-1"  style={{backgroundColor:""}}>
							<div className="mb-2" style={{backgroundColor:""}}> 
								<div className="d-flex align-items-center"  style={{backgroundColor:""}}>
									<div className="ms-3" style={{backgroundColor:"", width:"90%"}}>
										<input type="number" step="1" value = {lastCalldt} placeholder="2" className="form-control" style={{color:"white", textAlign:"center", backgroundColor:"#831200"  }} onChange={(event) => { 
										setLastCalldt(event.target.value);
									   }
									} />
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
					</div>

					<div  className="bg-gradient-1 coin-holding flex-wrap" style={{height:"90px", marginBottom:"15px", backgroundColor:""}}>
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
										<button disabled={initBtn_Disabled} className="btn btn-primary me-3 mb-1 mt-1 rounded" style={{border: "none", color:"white", width:"100%"}}  onClick = { () => initiate_Will() }>Initiate</button> 
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
										<button disabled={voidBtn_Disabled} className="btn btn-warning me-3 mb-1 mt-1 rounded" style={{border: "none", color:"black", width:"100%"}}  onClick = { () => voidWill() }>Void</button> 

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
					<h4 className="mb-0 fs-20 text-black" style={{marginTop:"50px"}}>Read Will Settings</h4>
				{/* </div> */}

					<div  className="bg-gradient-1 coin-holding flex-wrap" style={{height:"90px", marginBottom:"15px", backgroundColor:""}}>
						<div className="col-xl-2 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
									<div className="ms-3">
										<p className="mb-0 op-6" >Will State</p>
									</div>
								</div>
							</div>
						</div>
						<div className="col-xl-2 col-xxl-3"  style={{backgroundColor:""}}>
							<div className="mb-2" style={{backgroundColor:""}}> 
								<div className="d-flex align-items-center"  style={{backgroundColor:""}}>
									<div className="ms-3" style={{backgroundColor:"", width:"90%"}}>
										<input type="text" disabled readOnly value = {willState===true?"Active":"Not Activated"} placeholder="" className="form-control" style={{color:"white",  textAlign:"center",  }} />
									</div>
								</div>
							</div>
						</div>

						<div className="col-xl-2 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
									<div className="ms-3">
										<p className="mb-0 op-6" >Will Stage #</p>
									</div>
								</div>
							</div>
						</div>

						<div className="col-xl-2 col-xxl-3"  style={{backgroundColor:""}}>
							<div className="mb-2" style={{backgroundColor:""}}> 
								<div className="d-flex align-items-center"  style={{backgroundColor:""}}>
									<div className="ms-3" style={{backgroundColor:"", width:"90%"}}>
										<input type="number" step="1" disabled readOnly value = {willStage} placeholder="" className="form-control" style={{color:"white",  textAlign:"center",   }} />
									</div>
								</div>
							</div>
						</div>

						<div className="col-xl-2 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
									<div className="ms-3">
										{/* <p className="mb-0 op-6" >Trigger Point3 #</p> */}
									</div>
								</div>
							</div>
						</div>

						<div className="col-xl-2 col-xxl-1"  style={{backgroundColor:""}}>
							<div className="mb-2" style={{backgroundColor:""}}> 
								<div className="d-flex align-items-center"  style={{backgroundColor:""}}>
									<div className="ms-3" style={{backgroundColor:"", width:"90%"}}>
										{/* <input type="number" step="1" disabled value = {triggerPoint3} placeholder="" className="form-control" style={{color:"white", textAlign:"center", backgroundColor:"#835200" }} /> */}
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




						
					<div  className="bg-gradient-1 coin-holding flex-wrap" style={{height:"90px", marginBottom:"15px", backgroundColor:""}}>
						<div className="col-xl-2 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
									<div className="ms-3">
										<p className="mb-0 op-6" >Will Issued Block #</p>
									</div>
								</div>
							</div>
						</div>
						<div className="col-xl-3 col-xxl-3"  style={{backgroundColor:""}}>
							<div className="mb-2" style={{backgroundColor:""}}> 
								<div className="d-flex align-items-center"  style={{backgroundColor:""}}>
									<div className="ms-3" style={{backgroundColor:"", width:"90%"}}>
										<input type="number" step="1" disabled readOnly value = {willIssueBlockNum} placeholder="" className="form-control" style={{color:"white",  textAlign:"center",  }} />
									</div>
								</div>
							</div>
						</div>

						<div className="col-xl-2 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
									<div className="ms-3">
										<p className="mb-0 op-6" >Will Issued at Timestamp:</p>
									</div>
								</div>
							</div>
						</div>

						<div className="col-xl-3 col-xxl-3"  style={{backgroundColor:""}}>
							<div className="mb-2" style={{backgroundColor:""}}> 
								<div className="d-flex align-items-center"  style={{backgroundColor:""}}>
									<div className="ms-3" style={{backgroundColor:"", width:"90%"}}>
										<input type="text" disabled readOnly value = {willIssueTimeStamp} placeholder="" className="form-control" style={{color:"white",  textAlign:"center",   }} />
									</div>
								</div>
							</div>
						</div>

						<div className="col-xl-2 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
									<div className="ms-3">
										{/* <p className="mb-0 op-6" >Trigger Point3 #</p> */}
									</div>
								</div>
							</div>
						</div>

						<div className="col-xl-2 col-xxl-1"  style={{backgroundColor:""}}>
							<div className="mb-2" style={{backgroundColor:""}}> 
								<div className="d-flex align-items-center"  style={{backgroundColor:""}}>
									<div className="ms-3" style={{backgroundColor:"", width:"90%"}}>
										{/* <input type="number" step="1" disabled value = {triggerPoint3} placeholder="" className="form-control" style={{color:"white", textAlign:"center", backgroundColor:"#835200" }} /> */}
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





					<div className="bg-gradient-1 coin-holding flex-wrap" style={{height:"90px", marginBottom:"15px", backgroundColor:""}}>
						<div className="col-xl-2 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
									<div className="ms-3">
										<p className="mb-0 op-6" >Will Final Message</p>
									</div>
								</div>
							</div>
						</div>
						<div className="col-xl-9 col-xxl-3"  style={{backgroundColor:""}}>
							<div className="mb-2" style={{backgroundColor:""}}> 
								<div className="d-flex align-items-center"  style={{backgroundColor:""}}>
									<div className="ms-3" style={{backgroundColor:"", width:"90%"}}>
										<input type="text" disabled readOnly value = {willGeneralMessage } placeholder="read Will message" className="form-control" style={{color:"white", width:"100%"}}/>
									</div>
								</div>
							</div>
						</div>
					    <div className="col-xl-1 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
									{/* <button className="btn btn-outline-primary btn-success me-3 mb-2 rounded" style={{border: "none", color:"black", width:"150px"}}  onClick = { () => approveToken("_portfolio[index]") }>Edit</button>  */}
								</div>
							</div>
						</div>
						<div className="col-xl-1 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
									{/* <button className="btn btn-warning me-3 mb-2 rounded" style={{border: "none", color:"black", width:"150px"}}  onClick = { () => registerToken("_portfolio[index]") }>Save</button>  */}
								</div>
							</div>
						</div>
					</div>



					<div  className="bg-gradient-1 coin-holding flex-wrap" style={{height:"90px", marginBottom:"15px", backgroundColor:""}}>
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

						{/* <div className="col-xl-1 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
								</div>
							</div>
						</div> */}

					</div>




				</div>
			</div>







				</div>
			</div>
		</Fragment>
	)
}		
export default MyWallet;