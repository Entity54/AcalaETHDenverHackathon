import React,{Fragment,useContext, useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import { Dropdown } from "react-bootstrap";
import loadable from "@loadable/component";
import pMinDelay from "p-min-delay";

//Import
import { ThemeContext } from "../../../context/ThemeContext";
// import Donut from "../Boltz/MyWallet/Donut";
// import WalletTab from "../Boltz/MyWallet/WalletTab";
import SwiperSlider2 from "../Boltz/MyWallet/SwiperSlider2";
import AcPortfolio from "../Boltz/MyWallet/AcPortfolio";



import { getAccountBalances, getBasicInfo, get_AccountNonce, get_AdminAccounts, get_RegisteredERC20, get_WillBeneficiaries, get_RegisteredAccountTokenAllowance,
	registerNewOwnerAccount } from '../../../ntt54_accounts.js';         

// import QuickTransfer from '../Boltz/Home/QuickTransfer';

const CoinChart = loadable(() =>
  pMinDelay(import("../Boltz/MyWallet/CoinChart"), 1000)
);

const MyWallet = ({ currentAccount, provider, wallet, ntt54Will }) => {
	const { background } = useContext(ThemeContext);
	// const [crrency1, setCrrency1] = useState("Monthly (2021)");

	const [clickedAccount, setClickedAccount] = useState(null);
	const [accountbalances, setAccountbalances] = useState([]);
	const [newAccountToRegister, setNewAccountToRegister] = useState("");

	const [allAdminAccounts, setAllAdminAccounts] = useState([]);

	const updateData = async () => {
		const balances = await getAccountBalances(clickedAccount, ntt54Will);
		setAccountbalances(balances);
	}

	const registerNewAccount = async () => {
		console.log(`We will now register a new account ${newAccountToRegister} Please wait... `);

		// await get_AdminAccounts();
		// await get_RegisteredERC20();
		// await get_WillBeneficiaries();
		// const allowancesForAccount = await get_RegisteredAccountTokenAllowance(clickedAccount);
		// console.log(`MyWallet: allowancesForAccount: `,allowancesForAccount);
		
		if (newAccountToRegister!=="")
		{
			registerNewOwnerAccount(newAccountToRegister, provider, ntt54Will)
			.then((res) => {
				console.log(`We have just called registerNewOwnerAccount for ${newAccountToRegister}`);
			
				getRegisteredAccounts(provider, ntt54Will);
			})
			.catch((er) => console.log(`Error in approveToken: `,er));
		}
	}  

	//returns adminAccounts  which is the registered accounts that assets will be transfered to SC
	const getRegisteredAccounts = async (provider, ntt54Will) => {

		console.log(`MyWallet => getRegisteredAccounts is running`);
		const {adminAccountsArray, adminAccNonce } = await get_AdminAccounts(provider, ntt54Will);
		console.log(`MyWallet => adminAccountsArray: `,adminAccountsArray);
    
		let clickedAndRegisteredAccounts = [];
		const accountFound = adminAccountsArray.find( element => element.toLowerCase() === currentAccount.toLowerCase());
		if (!accountFound)
		{
		  console.log(`Account ${currentAccount} has not been registered.`);
		  const nonce = await get_AccountNonce(currentAccount,provider);
		  clickedAndRegisteredAccounts.push({address: currentAccount, nonce, status:"Unregistered"})
		}
		console.log(`Ready to create clickedAndRegisteredAccounts`);
		clickedAndRegisteredAccounts.push(...adminAccNonce);
		setAllAdminAccounts(clickedAndRegisteredAccounts);
	}
    
	//returns the clicked Account 
	const getClickedAccount = () => {

	}


	useEffect(async () => {
		if (wallet && ntt54Will)
		{
			updateData();
		}

	},[clickedAccount])

	useEffect(() => {
		console.log(`MYWALLET currentAccount: ${currentAccount}`);
		if (wallet && provider && ntt54Will)
		{
			setClickedAccount(currentAccount);
			getRegisteredAccounts(provider, ntt54Will);
		}
	},[wallet, provider, ntt54Will])


	return(
		<Fragment>
			<div className="form-head mb-sm-3 mb-3 d-flex align-items-center flex-wrap mt-3 text-head">
				<h2 className="font-w600 mb-0 me-auto mb-2">Registered Accounts</h2>
				<Link to={"#"} className="btn btn-outline-primary me-3 mb-2 rounded">
					{/* <i className="las la-calendar scale5 me-2"></i>Filter Periode */}
					<input type="text" value = {newAccountToRegister } placeholder="New Account to Register" className="form-control" style={{color:"white", width:"550px"}} onChange={(event) => { 
										setNewAccountToRegister(event.target.value);
									   }
									} />
				</Link>
				<Link to={"#"} className="btn btn-primary me-3 mb-2 rounded">
					{/* <i className="las la-calendar scale5 me-2"></i>Filter Periode */}
					{/* <button className="btn-primary" style={{border: "none", backgroundColor:"#4E0891", color:"white"}} disabled = { swapWithExactSupply_IsSubmiting } onClick = { () => faucetMyAccount() }>Register Account</button>  */}
					<button className="btn-primary" style={{border: "none", color:"white"}}  onClick = { () => registerNewAccount() }>Register Account</button> 
				</Link>
			</div>
			<div className="row">
				<div className="col-xl-3 col-xxl-4">
					<div className="swiper-box">
						<SwiperSlider2  currentAccount={currentAccount} provider={provider} wallet={wallet} ntt54Will={ntt54Will} allAdminAccounts={allAdminAccounts} />
					</div>
				</div>

				<div className="col-xl-9 col-xxl-8">

        				<AcPortfolio updateData={updateData} accountbalances={accountbalances} currentAccount={currentAccount} clickedAccount={clickedAccount} provider={provider} wallet={wallet} ntt54Will={ntt54Will} />
 

						{/* <div className="card">
							<div className="card-header border-0 pb-0">
								<h4 className="mb-0 fs-20 text-black">Total Value ${totalPortfolioValue?totalPortfolioValue:0}</h4>
							</div>

							<div className="card-body" style={{overflowY: "scroll", height:"400px"}}>
								{myPortfolio}
							</div>
						</div> */}
				</div>


				{/* <div className="col-xl-9 col-xxl-8">
					<div className="row">
						<div className="col-xl-12">
							<div className="d-block d-sm-flex mb-4">
								<h4 className="mb-0 text-black fs-24 me-auto">Card Details</h4>
								<div className="d-flex mt-sm-0">
									<Link to={"#"} className="btn-link me-3">Generate Number</Link>
									<Link to={"#"} className="btn-link text-light">Edit</Link>
								</div>
							</div>
						</div>	
						<div className="col-xl-12">
							<div className="card">
								<div className="card-body">
									<div className="row align-items-end">
										<div className="col-xl-6 col-lg-12 col-xxl-12">
											<div className="row">
												<div className="col-sm-6">
													<div className="mb-4">
														<p className="mb-2">Card Name</p>
														<h4 className="text-black">Main Balance</h4>
													</div>
													<div className="mb-4">
														<p className="mb-2">Valid Date</p>
														<h4 className="text-black">08/21</h4>
													</div>
													<div>
														<p className="mb-2">Card Number</p>
														<h4 className="text-black">**** **** **** 1234</h4>
													</div>
												</div>
												<div className="col-sm-6">
													<div className="mb-4">
														<p className="mb-2">Bank Name</p>
														<h4 className="text-black">ABC Center Bank</h4>
													</div>
													<div className="mb-4">
														<p className="mb-2">Card Holder</p>
														<h4 className="text-black">Marquezz Silalahi</h4>
													</div>
													<div>
														<p className="mb-2">Card Theme</p>
														<div className="btn-group theme-colors" data-toggle="buttons">
															<input type="radio" className="btn-check position-absolute"  name="btnradio" id="btnradio1" checked />
															<label className="btn btn-info" htmlFor="btnradio1"><i className="las la-check-circle"></i></label>
															<input type="radio" className="btn-check" name="btnradio" id="btnradio2" />
															<label className="btn btn-warning" htmlFor="btnradio2"><i className="las la-check-circle"></i></label>
															<input type="radio" className="btn-check" name="btnradio" id="btnradio3" />
															<label className="btn btn-success" htmlFor="btnradio3"><i className="las la-check-circle"></i></label>
															<input type="radio" className="btn-check" name="btnradio" id="btnradio4" />
															<label className="btn btn-secondary" htmlFor="btnradio4"><i className="las la-check-circle"></i></label>
															<input type="radio" className="btn-check" name="btnradio" id="btnradio5" />
															<label className="btn btn-primary" htmlFor="btnradio5"><i className="las la-check-circle"></i></label>
														</div>
													</div>
												</div>
											</div>
										</div>
										<div className="col-xl-6 col-lg-12 col-xxl-12 mb-lg-0 mb-3">
											<p>Monthly Limits</p>
											<div className="row">
												<div className="col-sm-4 mb-sm-0 mb-4 text-center">
													<div className="d-inline-block position-relative donut-chart-sale mb-3">
														{background.value === "dark" ? (
														  <Donut
															value={66}
															backgroundColor="#FF6826"
															backgroundColor2="#F0F0F0"
														  />
														) : (
														  <Donut value={66} backgroundColor="#2258bf" />
														)}
														<small>66%</small>
													</div>
													<h5 className="fs-18 text-black">Main Limits</h5>
													<span>$10,000</span>
												</div>
												<div className="col-sm-4 mb-sm-0 mb-4 text-center">
													<div className="d-inline-block position-relative donut-chart-sale mb-3">
														{background.value === "dark" ? (
														  <Donut
															value={31}
															backgroundColor="#1DC624"
															backgroundColor2="#F0F0F0"
														  />
														) : (
														  <Donut value={31} backgroundColor="#1DC624" />
														)}
														<small>31%</small>
													</div>
													<h5 className="fs-18 text-black">Seconds</h5>
													<span>$500</span>
												</div>
												<div className="col-sm-4 text-center">
													<div className="d-inline-block position-relative donut-chart-sale mb-3">
														{background.value === "dark" ? (
														  <Donut
															value={25}
															backgroundColor="#9E9E9E"
															backgroundColor2="#F0F0F0"
														  />
														) : (
														  <Donut value={25} backgroundColor="#f04444" />
														)}
														<small>25%</small>
													</div>
													<h5 className="fs-18 text-black">Others</h5>
													<span>$100</span>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="col-xl-12">
							<div className="card">
								<div className="card-header d-block d-sm-flex border-0 pb-sm-0 pb-0 align-items-center">
									<div className="me-auto mb-sm-0 mb-3">
										<h4 className="fs-20 text-black">Overview Balance</h4>
										<p className=" fs-12">Lorem ipsum dolor sit amet, consectetur</p>
									</div>
									<Dropdown>
										<Dropdown.Toggle variant="" className="form-control style-1 default-select">{crrency1}</Dropdown.Toggle>
										<Dropdown.Menu>
											<Dropdown.Item onClick={() => setCrrency1("Monthly (2021)")}>Monthly (2021)</Dropdown.Item>
											<Dropdown.Item onClick={() => setCrrency1("Daily (2021)")}>Daily (2021)</Dropdown.Item>
											<Dropdown.Item onClick={() => setCrrency1("Weekly (2021)")}>Weekly (2021)</Dropdown.Item>
										 </Dropdown.Menu>
									</Dropdown>
								</div>
								<div className="card-body pt-3">
									<div className="flex-wrap mb-sm-4 mb-2 align-items-center">
										<div className="d-flex align-items-center">
											<span className="fs-32 text-black font-w600 pe-3">$557,235.31</span>
											<span className="fs-22 text-success">7% <i className="fa fa-caret-up scale5 ms-2 text-success" aria-hidden="true"></i></span>
										</div>
										<p className="mb-0 text-black me-auto">Last Week <span className="text-success">$563,443</span></p>
									</div>
									<div id="chartTimeline" className="timeline-chart market-line">
										<CoinChart />	
									</div>
								</div>
							</div>
						</div>
					</div>
				</div> */}
				{/* <div className="col-xl-6 col-xxl-12 mt-4">
					<div className="row">
						<div className="col-xl-12">
							<WalletTab  activeMenu ="Wallet Activity" />
						</div>
					</div>
				</div> */}
				{/* <div className="col-xl-6 col-xxl-12 mt-4">
					<div className="row">
						<div className="col-xl-12">
							<QuickTransfer />
						</div>
					</div>
				</div> */}
			</div>
		</Fragment>
	)
}		
export default MyWallet;