import React,{useState,useEffect,useContext} from 'react';

import { ThemeContext } from "../../../context/ThemeContext";
import Donut from "../Boltz/MyWallet/Donut";
import QuickTransfer from '../Boltz/Home/ntt54_QuickTransfer';

import { getSmartContractFeesBalances } from '../../../ntt54_accounts.js';         
 
const Portofolio = ({ willAdmin, ntt54Will_address, currentAccount, provider, wallet, ntt54Will, setupSpecs, portfolio, blockHeader, accountList }) =>{
	const { background } = useContext(ThemeContext);
	// const [myPortfolio, setMyPortfolio] = useState(null);
	// const [totalPortfolioValue, setTotalPortfolioValue] = useState(null);

	const [feesBalances, setFeesBalances] = useState([{ name:"Acala", ticker: "ACA", NumTokens: "0", value: "0", status: "" }, { name:"Acala Dollar", ticker: "AUSD", NumTokens: "0", value: "0", status: "" } ]);



	const getSmartContactBalances = async (ntt54Will, willAdmin) => {
		console.log(`Portfolio => getSmartContactBalances is running`);
		const feesBalance = await getSmartContractFeesBalances(ntt54Will, willAdmin);
		setFeesBalances(feesBalance);
		console.log(`Portfolio => getSmartContactBalances is complete`);
	}

	// const refreshData = (_portfolio) =>{
	
	// 	if (_portfolio)
	// 	{
	// 		// const numOfData = _portfolio.length;
	// 		// console.log(`PORTFOLIO numOfData: ${numOfData}`)
	// 		let sum = 0;
	// 		_portfolio.forEach(item => sum += Number(item.Value) );
	// 		setTotalPortfolioValue(sum);

	// 		return _portfolio.map((token, index) => {
	// 			return (
	// 				<div key={index} className="bg-gradient-1 coin-holding flex-wrap" style={{height:"70px", marginBottom:"15px", backgroundColor:""}}>
	// 					<div className="col-xl-3 col-xxl-3">

	// 						<div className="mb-2">
	// 							<div className="d-flex align-items-center">
	// 								<div className="ms-3">
	// 									<p className="mb-0 op-6" >{token.name}</p>
	// 								</div>
	// 							</div>
	// 						</div>
	// 					</div>
	// 					<div className="col-xl-3 col-xxl-3">

	// 						<div className="mb-2">
	// 							<div className="d-flex align-items-center">
	// 								<div className="ms-3">
	// 									<p className="mb-0 op-6">{token.ticker}</p>
	// 								</div>
	// 							</div>
	// 						</div>
	// 					</div>
	// 					<div className="col-xl-3 col-xxl-3">

	// 						<div className="mb-2">
	// 							<div className="d-flex align-items-center">
	// 								<div className="ms-3">
	// 									<p className="mb-0 op-6">{token.NumTokens}</p>
	// 								</div>
	// 							</div>
	// 						</div>
	// 					</div>
	// 					<div className="col-xl-3 col-xxl-3">

	// 						<div className="mb-2">
	// 							<div className="d-flex align-items-center">
	// 								<p className="mb-0 ms-2 font-w400 text-black">${token.Value}</p>	
	// 							</div>
	// 						</div>
	// 					</div>
	// 				</div>
	// 			)

	// 		});

	// 	}
	// 	else return <tr><td>Loading data...</td></tr>

	// }

	// useEffect(() => {
	// 	// console.log(`Running useEffect for MyPortoflio`);
	// 	setMyPortfolio( refreshData(portfolio) );
	// }, [portfolio]);

	useEffect(() => {
		if (ntt54Will && willAdmin) getSmartContactBalances(ntt54Will, willAdmin);
	}, [ntt54Will, willAdmin]);

	return(
		<>
			<div className="mb-sm-5 mb-3 d-flex flex-wrap align-items-center text-head">
				<h2 className="font-w600 mb-2 me-auto">Fees Breakdown</h2>
			</div>
			<div className="row">
				<div className="col-xl-6 col-xxl-8">

					<div className="card">
						<div className="card-header border-0 pb-0">
							<h4 className="mb-0 fs-20 text-black">Balances </h4>
							{/* <h4 className="mb-0 fs-20 text-black">Balances ${totalPortfolioValue?totalPortfolioValue:0}</h4> */}

						</div>

						<div className="card-body" style={{overflowY: "scroll", height:"400px"}}>
							{/* {"myPortfolio"} */}

						<div key={1} className="bg-gradient-1 coin-holding flex-wrap" style={{height:"70px", marginBottom:"15px", backgroundColor:""}}>
						<div className="col-xl-2 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
									<div className="ms-3">
										<p className="mb-0 op-6" >Acala</p>
									</div>
								</div>
							</div>
						</div>
						<div className="col-xl-2 col-xxl-3">

							<div className="mb-2">
								<div className="d-flex align-items-center">
									<div className="ms-3">
										<p className="mb-0 op-6">ACA</p>
									</div>
								</div>
							</div>
						</div>
						<div className="col-xl-2 col-xxl-3">

							<div className="mb-2">
								<div className="d-flex align-items-center">
									<div className="ms-3">
										<p className="mb-0 op-6">{feesBalances[0].NumTokens}</p>
									</div>
								</div>
							</div>
						</div>
						<div className="col-xl-2 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
									<p className="mb-0 ms-2 font-w400 text-black">${feesBalances[0].value}</p>	
								</div>
							</div>
						</div>
						<div className="col-xl-2 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
									<p className="mb-0 ms-2 font-w400 text-black">{feesBalances[0].status}</p>	
								</div>
							</div>
						</div>
					</div>

					<div key={2} className="bg-gradient-1 coin-holding flex-wrap" style={{height:"70px", marginBottom:"15px", backgroundColor:""}}>
						<div className="col-xl-2 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
									<div className="ms-3">
										<p className="mb-0 op-6" >Acala Dollar</p>
									</div>
								</div>
							</div>
						</div>
						<div className="col-xl-2 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
									<div className="ms-3">
										<p className="mb-0 op-6">AUSD</p>
									</div>
								</div>
							</div>
						</div>
						<div className="col-xl-2 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
									<div className="ms-3">
										<p className="mb-0 op-6">{feesBalances[1].NumTokens}</p>
									</div>
								</div>
							</div>
						</div>
						<div className="col-xl-2 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
									<p className="mb-0 ms-2 font-w400 text-black">${feesBalances[1].value}</p>	
								</div>
							</div>
						</div>
						<div className="col-xl-2 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
									<p className="mb-0 ms-2 font-w400 text-black">{feesBalances[1].status}</p>	
								</div>
							</div>
						</div>
					</div>

					<div style={{marginBottom:"10px"}}>
						{"Treasury Staking Rewards"}
					</div>
					<div key={3} className="bg-gradient-1 coin-holding flex-wrap" style={{height:"70px", marginBottom:"15px", backgroundColor:""}}>
						<div className="col-xl-2 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
									<div className="ms-3">
										<p className="mb-0 op-6" >NTT54</p>
									</div>
								</div>
							</div>
						</div>
						<div className="col-xl-2 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
									<div className="ms-3">
										<p className="mb-0 op-6">T54</p>
									</div>
								</div>
							</div>
						</div>
						<div className="col-xl-2 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
									<div className="ms-3">
										<p className="mb-0 op-6">{"0"}</p>
									</div>
								</div>
							</div>
						</div>
						<div className="col-xl-2 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
									<p className="mb-0 ms-2 font-w400 text-black">${"0"}</p>	
								</div>
							</div>
						</div>
						<div className="col-xl-2 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
									<p className="mb-0 ms-2 font-w400 text-black"></p>	
								</div>
							</div>
						</div>
					</div>


						</div>
					</div>

				</div>

				<div className="col-xl-6 col-xxl-12">
						<QuickTransfer getSmartContactBalances={getSmartContactBalances} willAdmin={willAdmin} ntt54Will_address={ntt54Will_address} currentAccount={currentAccount} provider={provider} wallet={wallet} ntt54Will={ntt54Will} setupSpecs={setupSpecs} portfolio={portfolio} blockHeader={blockHeader}/>
				</div>
			</div>	
		</>
	)
}
export default Portofolio; 