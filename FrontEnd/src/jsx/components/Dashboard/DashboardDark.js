import React,{useState,useContext, useEffect} from 'react';
import { ThemeContext } from "../../../context/ThemeContext";
import MARKET from "./MARKET";

import PerfectScrollbar from "react-perfect-scrollbar";
import { Link } from "react-router-dom";
// import React, { Fragment } from "react";







const DashboardDark = ({ setupSpecs, oracleData, blockHeader, accountList }) => {
	const { changeBackground, background } = useContext(ThemeContext);
	
	useEffect(() => {
		changeBackground({ value: "dark", label: "Dark" });

	}, []);

	return(
		<>
			<div className="row">
				<div className="row">
					<div className="col-xl-12">

						{/* <MARKET className="col-xl-12" blockHeader={blockHeader} oracleData={oracleData}/>	 */}

						<div className="row">



{/* <div className="col-xl-1 col-xxl-6 col-lg-6">
</div> */}

<div className="col-xl-12 col-xxl-6 col-lg-6">

  <div className="card">

	<div className="card-header border-1 pb-4">
	  <h4 className="card-title">Setting up you Will</h4>
	</div>

	<div className="card-body">
	  <PerfectScrollbar
		style={{ height: "780px" }}
		id="DZ_W_TimeLine"
		className="widget-timeline dz-scroll height370 ps ps--active-y"
	  >
		<ul className="timeline">
		  <li>
			<div className="timeline-badge primary"></div>
			<Link
			  className="timeline-panel text-muted"
			  to="/widget-basic"
			>
			  {/* <span>Register Accounts</span> */}
			  <strong className="text-primary">Register Accounts</strong>.

			  <p className="mb-0">
				Head to Reigster Account to register one by one all your accounts
				The first on will be your admin you are already signed in 
				In this demo we have used 1 registered account the Will Administrator
				Bear in mind that the Registered Accounts notifies the will smart contract that 
				tokens can be transfered at Stage 3 from the account to the smart contract
				Until stage 3 we can use those accounts as we like.
				For each account we need to Approve and Register the tokens we want to be elgible for 
				the smart contract to transfer at stage 3. In this example we have used ACA and AUSD
				{" "}
				{/* <strong className="text-primary">$500</strong>. */}
			  </p>
			</Link>
		  </li>
		  <li>
			<div className="timeline-badge info"></div>
			<Link
			  className="timeline-panel text-muted"
			  to="/widget-basic"
			>
			  {/* <span>20 minutes ago</span> */}
			  <strong className="text-primary">Fees</strong>.
			  <p className="mb-0">
				The user must deposit ACA (recommened 2 ACA). This will be used by the scheduler to keep
				pinging the smart contract.
				(In the future the user will have to deposit also 2000 AUSD which will be staked)
				Fees are collected after final will stage and split equally (what is left) to beneficiaries
				{" "}
				{/* <strong className="text-info">#XF-2356.</strong> */}
			  </p>
			  {/* <p className="mb-0">
				Quisque a consequat ante Sit amet magna at volutapt...
			  </p> */}
			</Link>
		  </li>
		  <li>
			<div className="timeline-badge danger"></div>
			<Link
			  className="timeline-panel text-muted"
			  to="/widget-basic"
			>
			  {/* <span>30 minutes ago</span> */}
			  <strong className="text-primary">Register Beneficiaries</strong>
			  <p className="mb-0">
				Here the administrator can register the beneficiaries one by one 
				Place the beneficiary EVM address, nickname, message, percent of the cash inheritance to receive e.g. for 60% place 60
				(In the future NFTs assets to pass to benefiaries will be permitted and MultiSigs for non-adults, pets, institutions will be allowed)
				You can also amend beneficiaries' details or remove a beneficiary (click on beneficiary card to select). 
				In this example we have used 2 beneficiaries
				{" "}
				{/* <strong className="text-warning">Sell $250</strong> */}
			  </p>
			</Link>
		  </li>
		  <li>
			<div className="timeline-badge success"></div>
			<Link
			  className="timeline-panel text-muted"
			  to="/widget-basic"
			>
			  {/* <span>15 minutes ago</span> */}
			  <strong className="text-primary">Initiate Will</strong>
			  <p className="mb-0">
				Place a generic final message (not to exceed 64 characters)
				State the trigger point intervals 
				For example for dt1=10, dt2=10, dt3=10, LastCall=10 the following will occur
				As soon the user clicks Initate the Will is signed and Active at block number X e.g. 100
				At block number 110 if the smart contract has not received Proof of life then it will move to Stage 1
				At block number 120 if the smart contract has not received Proof of life then it will move to Stage 2
				At block number 130 if the smart contract has not received Proof of life then it will move to Stage 3
				   Now all registered tokens for each of the registered account will be transfered to the smart contract
				   If the will administrator is still alive and cliks Void button he cancels the Will and deposited funds are returned to the registered accounts that have been transfered from 
				At block number 140 if the smart contract has not received Proof of life then it will move to Stage 4
				   This is the point of no return. All tokens deposited to the smart contract (please note tokens deposited as fees ACA and AUSD are kept separate to maintain smart contract operation)
				   are swapped for Acala Dollar AUSD.
				At block number 145 (by default 5 blocks later than the swaps) all AUSD is split and transfered out of the smart contract to the beneficiaries as per the seetings established at Register Beneficiaries setup
                (in the future the smart contact will unstake any AUSD staked at Fees step and together with any remaining ACA will be transferred to the beneficiaries evenly)
                (couple of blocks later and the Will Smart contract resets deleting registered accounts of administrator and registered beneficiaries)
				{" "}
			  </p>
			</Link>
		  </li>
		  <li>
			<div className="timeline-badge warning"></div>
			<Link
			  className="timeline-panel text-muted"
			  to="/widget-basic"
			>
			  {/* <span>20 minutes ago</span> */}
			  <strong className="text-primary">Manage Will</strong>
			  <p className="mb-0">
				This is the Control dahsboard. This is the page the Will administrator visits and check state of the Will
				Clicking Proof of Life <span>Alive & Kicking</span> (only administrator can click this) the administrator informs the smart contract that he is alive 
				As long as this is clicked prior to Stage 3, all Trigger points are reset usign the orginal trigger intervals to be added to the current blovk number 
				the first 2 lines shows the fees balances of admin adn smart contract and the NONCE of these account 
				(smart contract has the functionality of detecting all administrator's registered accounts for the native ACA balance. If this decreases it means that either the account owner (will administrator)
				has transfer ACA out or has signed a transaction (The button check account exhibits this finctionality but it should only be clicked by an account other than the will adminstrator and his registered accounts only place here for demo))
				The next 4 lines show the balance across all tokens ACA, AUSD, DOT , LDOT, RENBTC for 
				will smart contract, administrator, Beneficiary 1 and Beneficiary 2
				(The button check Will Stage performs what is happening automatically by the scheduler )
				NONE OF THE BUTTONS NEED TO BE CLICKED AND WILL REMOVED IN FUTURE VERSION AS THE SCHEDULER PERFORMS THESE ACTIONS
			  </p>
			</Link>
		  </li>
		  <li>
			<div className="timeline-badge dark"></div>
			<Link
			  className="timeline-panel text-muted"
			  to="/widget-basic"
			>
			  {/* <span>20 minutes ago</span> */}
			  <strong className="text-primary">DEx</strong>
			  <p className="mb-0">
				A simple Acala DEX for the will admin and his beneficiaries to use. 
			  </p>
			</Link>
		  </li>
		</ul>
	  </PerfectScrollbar>
	</div>
  </div>
</div>
</div>

{/* <div className="col-xl-3 col-xxl-6 col-lg-6">
</div> */}

					</div>
				</div>
			</div>	
		</>
	)
}
export default DashboardDark;