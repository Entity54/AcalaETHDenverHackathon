import React,{useState,useEffect,useContext} from 'react';


// import { getMsg } from '../../../../ntt54_accounts.js';         
import { getAccountBalances, getBasicInfo, get_AdminAccounts, get_RegisteredERC20, get_WillBeneficiaries, get_RegisteredAccountTokenAllowance,
	approveERC20forSC, registerNewOwnerAccount, registerAccountToken } from '../../../../ntt54_accounts.js';        


// export default function SwiperSlider2() {
const AcPortfolio = ({ updateData, accountbalances, currentAccount, clickedAccount, provider, wallet, ntt54Will }) => {
	const [myPortfolio, setMyPortfolio] = useState(null);

	const approveToken = async (token) => {
		console.log(`AcPortfolio Approve has been clicked for token: `,token);
		// {name: 'Acala Dollar', ticker: 'AUSD', NumTokens: '1081.130593005285', value: '0', allowance: '0.0'}
		approveERC20forSC(token.ticker)
		.then((res) => {
			console.log(`approveToken  has been completed`);
			updateData();
		})
		.catch((er) => console.log(`Error in approveToken: `,er));

	}

	const registerToken = async (token) => {
		console.log(`AcPortfolio registerToken has been clicked for token: `,token);
		// {name: 'Acala Dollar', ticker: 'AUSD', NumTokens: '1081.130593005285', value: '0', allowance: '0.0'}
		registerAccountToken(clickedAccount, token.ticker, ntt54Will)
		.then((res) => {
			console.log(`registerToken  has been completed`);
			updateData();
		})
		.catch((er) => console.log(`Error in registerAccountToken: `,er));

	}

	const refreshData = (_portfolio) =>{
	
		if (_portfolio && _portfolio.length>0)
		{
			// const numOfData = _portfolio.length;
			// console.log(`PORTFOLIO numOfData: ${numOfData}`)
				// let sum = 0;
				// _portfolio.forEach(item => sum += Number(item.Value) );
				// setTotalPortfolioValue(sum);

			return _portfolio.map((token, index) => {
				return (
					<div key={index} className="bg-gradient-1 coin-holding flex-wrap" style={{height:"70px", marginBottom:"15px", backgroundColor:""}}>
						<div className="col-xl-1 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
									<div className="ms-3">
										<p className="mb-0 op-6" >{token.name}</p>
									</div>
								</div>
							</div>
						</div>
						<div className="col-xl-1 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
									<div className="ms-3">
										<p className="mb-0 op-6">{token.ticker}</p>
									</div>
								</div>
							</div>
						</div>
						<div className="col-xl-2 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
									<div className="ms-3">
										<p className="mb-0 op-6">{token.NumTokens}</p>
									</div>
								</div>
							</div>
						</div>
						<div className="col-xl-1 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
									<p className="mb-0 ms-2 font-w400 text-black">${token.value}</p>	
								</div>
							</div>
						</div>
						<div className="col-xl-2 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
									<p className="mb-0 ms-2 font-w400 text-black">{token.allowance}</p>	
								</div>
							</div>
						</div>
						<div className="col-xl-1 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
									<p className="mb-0 ms-2 font-w400" style={{color:`${token.status===true?"#36FC00":"red"}`}} >{token.status===true?"Registered":"Unregistered"}</p>	
								</div>
							</div>
						</div>
						<div className="col-xl-1 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
									{/* <p className="mb-0 ms-2 font-w400 text-black">APPROVE</p>	 */}
									<button className="btn btn-success me-3 mb-2 rounded" style={{border: "none", color:"black"}}  onClick = { () => approveToken(_portfolio[index]) }>Approve</button> 
								</div>
							</div>
						</div>
						<div className="col-xl-1 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
									{/* <p className="mb-0 ms-2 font-w400 text-black">APPROVE</p>	 */}
									<button className="btn btn-warning me-3 mb-2 rounded" style={{border: "none", color:"black"}}  onClick = { () => registerToken(_portfolio[index]) }>Register</button> 
								</div>
							</div>
						</div>
					</div>
				)

			});

		}
		else return <tr><td>Loading data...</td></tr>

	}

	useEffect(() => {
		// console.log(`Running useEffect for MyPortoflio`);
		setMyPortfolio( refreshData(accountbalances) );
	}, [accountbalances]);




	

	return (
		<>
			<div className="card">
				<div className="card-header border-0 pb-0">
					<h4 className="mb-0 fs-20 text-black">Account Token Holdings</h4>
				</div>

				<div className="card-body" style={{overflowY: "scroll", height:"400px"}}>
					{myPortfolio}
				</div>
			</div>
		
		</>
    )
}
export default AcPortfolio; 
