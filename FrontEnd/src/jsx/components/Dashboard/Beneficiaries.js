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



import { get_WillBeneficiaries, addNewBeneficiary, amendWillBeneficiaryCash, removeWillBeneficiary, getBeneficiaryDetails } from '../../../ntt54_accounts.js';         

// import QuickTransfer from '../Boltz/Home/QuickTransfer';

const CoinChart = loadable(() =>
  pMinDelay(import("../Boltz/MyWallet/CoinChart"), 1000)
);

const MyWallet = ({ currentAccount, provider, wallet, ntt54Will }) => {
	const { background } = useContext(ThemeContext);

	// const [accountbalances, setAccountbalances] = useState([]);
	// const [allAdminAccounts, setAllAdminAccounts] = useState([]);

	const [clickedAccount, setClickedAccount] = useState(null);
	const [beneficiary, setBeneficiary] = useState("");
	const [willBeneficiaries, setWillBeneficiaries] = useState([]);
	const [detailedBeneficiariesArray, setDetailedBeneficiariesArray] = useState([]);
	const [requestingData, setRequestingData] = useState(false);
	const [action, setAction] = useState("");


	const startAction = async (_action) => {
		setAction(_action)
		setRequestingData(true);
	}

	const collectBeneficiaryData = (nickname, finalMsg, cashPercentage, nftAddress, multisig1, multisig2, multisig3) => {
		console.log(`collectBeneficiaryData beneficiary:${beneficiary} nickname:${nickname} finalMsg:${finalMsg} nftAddress:${nftAddress} multisig1:${multisig1}  multisig2:${multisig2}  multisig3:${multisig3}`);
		console.log(`collectBeneficiaryData cashPercentage:${cashPercentage} typeof:${typeof cashPercentage}`);
        const data = {beneficiary, nickname, finalMsg, cashPercentage, nftAddress, multisig1, multisig2, multisig3};
		if (action==="register") registerNewBeneficiary(data);
		else if (action==="amend") amendBeneficiary(data);
		else if (action==="delete") deleteBeneficiary();
		setRequestingData(false);
	}

	const registerNewBeneficiary = async (data) => {
		console.log(`registerNewBeneficiary We will now register a new beneficiary${beneficiary} Please wait... `);
		if (beneficiary!=="")
        {
			const willBeneficiariesArray = await get_WillBeneficiaries(ntt54Will);
			console.log(`Is beneficiary:${beneficiary} already registered in Beneficiaries => willBeneficiariesArray: `,willBeneficiariesArray);
			const beneficiaryFound = willBeneficiariesArray.find( element => element.toLowerCase() === beneficiary.toLowerCase());
			if (beneficiaryFound)
			{
				console.log(`Beneficiary:${beneficiary} has already registered.`);
				return;
			}
			
			console.log(`Beneficiary:${beneficiary} is not registered.`);
			addNewBeneficiary(data.beneficiary, data.nickname, data.finalMsg, data.cashPercentage, data.nftAddress, data.multisig1, data.multisig2, data.multisig3, ntt54Will)
			.then((res) => {
				console.log(`We have just called registerNewBeneficiary for ${beneficiary}`);
				getWillBeneficiaries(ntt54Will);
			})
			.catch((er) => console.log(`Error in addNewBeneficiary: `,er));
		}
	}  

	const amendBeneficiary = async (data) => {
		console.log(`Amend beneficiary:${beneficiary} is Run data: `,data);
		if (beneficiary!=="")
        {
			const willBeneficiariesArray = await get_WillBeneficiaries(ntt54Will);
			console.log(`Is beneficiary:${beneficiary} already registered in Beneficiaries => willBeneficiariesArray: `,willBeneficiariesArray);
			const beneficiaryFound = willBeneficiariesArray.find( element => element.toLowerCase() === beneficiary.toLowerCase());
			if (beneficiaryFound)
			{
				console.log(`Beneficiary:${beneficiary} has already registered.`);
				amendWillBeneficiaryCash(data.beneficiary, data.nickname, data.finalMsg, data.cashPercentage, data.nftAddress, data.multisig1, data.multisig2, data.multisig3, ntt54Will)
				.then((res) => {
					console.log(`We have just called amendWillBeneficiaryCash for ${beneficiary}`);
					getWillBeneficiaries(ntt54Will);
				})
				.catch((er) => console.log(`Error in amendBeneficiary: `,er));
				
			}
			else console.log(`Trying to amend a beneficiary that is not already registered`);
		}
	}

	const deleteBeneficiary = async () => {
		console.log(`Delete Benficiary: ${beneficiary} is Run`);
		if (beneficiary!=="")
        {
			const willBeneficiariesArray = await get_WillBeneficiaries(ntt54Will);
			console.log(`Is beneficiary:${beneficiary} already registered in Beneficiaries => willBeneficiariesArray: `,willBeneficiariesArray);
			const beneficiaryFound = willBeneficiariesArray.find( element => element.toLowerCase() === beneficiary.toLowerCase());
			if (beneficiaryFound)
			{
				console.log(`Beneficiary:${beneficiary} has already registered.`);
				removeWillBeneficiary(beneficiary, ntt54Will)
				.then((res) => {
					console.log(`We have just called removeWillBeneficiary for ${beneficiary}`);
					getWillBeneficiaries(ntt54Will);
				})
				.catch((er) => console.log(`Error in deleteBeneficiary: `,er));
				
			}
			else console.log(`Trying to delete a beneficiary that is not already registered`);
		}
	}
	

	const get_BeneficiaryDetails = async (willBeneficiariesArray) => {
		const numOfBeneficiaries = willBeneficiariesArray.length;
		if(numOfBeneficiaries===0) setDetailedBeneficiariesArray([]);
		
        let benferiedDetailsArrray = [], count=0;
		const getDetails = async (beneficiaryAdr) => {
			console.log(`Retrieving details for beneficiary:${beneficiaryAdr}`);
			const beneficiaryDetails = await getBeneficiaryDetails(beneficiaryAdr, ntt54Will);
			console.log(`get_BeneficiaryDetails => Received ${beneficiaryAdr} beneficiaryDetails: `,beneficiaryDetails);
			if (beneficiaryDetails) benferiedDetailsArrray.push(beneficiaryDetails);
			count++
			 
			if (count < numOfBeneficiaries) getDetails( willBeneficiariesArray[count] );
			else setDetailedBeneficiariesArray( benferiedDetailsArrray );
		}

		getDetails(willBeneficiariesArray[0]);
	}

	const getWillBeneficiaries = async (ntt54Will) => {
		console.log(`Beneficiaries => getRegisteredAccounts is running`);
		const willBeneficiariesArray = await get_WillBeneficiaries(ntt54Will);
		console.log(`Beneficiaries => willBeneficiariesArray: `,willBeneficiariesArray);
		setWillBeneficiaries(willBeneficiariesArray);

		get_BeneficiaryDetails(willBeneficiariesArray);
	}
    
	//returns the clicked Account 
	const getClickedCard = (indx) => {
		console.log(`Beneficiaries The card with index:${indx} has been clicked`);
		if (indx < detailedBeneficiariesArray.length) 
		{
			setBeneficiary(detailedBeneficiariesArray[indx].b_address);
			setClickedAccount(detailedBeneficiariesArray[indx]);
		}
	}

	useEffect(() => {
		console.log(`MYWALLET currentAccount: ${currentAccount}`);
		if (ntt54Will) getWillBeneficiaries(ntt54Will);
	},[wallet, provider, ntt54Will])


	return(
		<Fragment>
			<div className="form-head mb-sm-3 mb-3 d-flex align-items-center flex-wrap mt-3 text-head">
				<h2 className="font-w600 mb-0 me-auto mb-2">Beneficiaries</h2>
				<Link to={"#"} className="btn btn-outline-primary me-3 mb-2 rounded">
					<input type="text" value = {beneficiary} placeholder="Beneficiary Address" className="form-control" style={{color:"white", width:"550px"}} onChange={(event) => { 
										setBeneficiary(event.target.value);
									   }
									} />
				</Link>
				<Link to={"#"} className="btn btn-primary me-3 mb-2 rounded">
					<button className="btn-primary" style={{border: "none", color:"white"}}  onClick = { () => startAction("register") }>Register Beneficiary</button> 
				</Link>
				<Link to={"#"} className="btn btn-primary me-3 mb-2 rounded">
					<button className="btn-primary" style={{border: "none", color:"white"}}  onClick = { () => startAction("amend") }>Amend    Beneficiary</button> 
				</Link>
				<Link to={"#"} className="btn btn-primary me-3 mb-2 rounded">
					<button className="btn-primary" style={{border: "none", color:"white"}}  onClick = { () => startAction("delete") }>Remove   Beneficiary</button> 
				</Link>
			</div>
			<div className="row">
				<div className="col-xl-3 col-xxl-4">
					<div className="swiper-box">
						<BeneficiariesSlider getClickedCard={getClickedCard} detailedBeneficiariesArray={detailedBeneficiariesArray} willBeneficiaries={willBeneficiaries} currentAccount={currentAccount} provider={provider} wallet={wallet} ntt54Will={ntt54Will} allAdminAccounts={"allAdminAccounts"} />
					</div>
				</div>
				<div className="col-xl-9 col-xxl-8">
        				<BenefiiarySettings detailedBeneficiariesArray={detailedBeneficiariesArray} requestingData={requestingData} collectBeneficiaryData={collectBeneficiaryData} currentAccount={currentAccount} clickedAccount={clickedAccount} provider={provider} wallet={wallet} ntt54Will={ntt54Will} />
				</div>
			</div>
		</Fragment>
	)
}		
export default MyWallet;