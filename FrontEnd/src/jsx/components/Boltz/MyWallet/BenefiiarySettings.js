import React,{useState,useEffect,useContext} from 'react';
import {Link} from 'react-router-dom';


// import { getMsg } from '../../../../ntt54_accounts.js';         
import { getAccountBalances, getBasicInfo, get_AdminAccounts, get_RegisteredERC20, get_WillBeneficiaries, get_RegisteredAccountTokenAllowance,
	approveERC20forSC, registerNewOwnerAccount, registerAccountToken } from '../../../../ntt54_accounts.js';        


// export default function SwiperSlider2() {
const AcPortfolio = ({ requestingData, collectBeneficiaryData, currentAccount, clickedAccount, ntt54Will }) => {

	const [nickname, setNickname]             = useState("");
	const [finalMsg, setFinalMsg]             = useState("");
	const [cashPercentage, setCashPercentage] = useState("");
	const [nftAddress, setNftAddress]         = useState("");
	const [multisig1, setMultisi1]            = useState("");
	const [multisig2, setMultisi2]            = useState("");
	const [multisig3, setMultisi3]            = useState("");

	useEffect(() => {
		console.log(`Beneficiary settings requestingData: ${requestingData}`);
		if (requestingData) collectBeneficiaryData(nickname, finalMsg, cashPercentage, nftAddress, multisig1, multisig2, multisig3);
	},[requestingData])
    
	 
	useEffect(() => {
		console.log(`Beneficiary settings clickedAccount: ${clickedAccount}`);
		if (clickedAccount)
		{
			//[ {b_address, b_nickname, b_fmsg, b_percent, b_nft, b_index,} ]
			setNickname(clickedAccount.b_nickname)
			setFinalMsg(clickedAccount.b_fmsg)
			setCashPercentage(clickedAccount.b_percent)
			setNftAddress(clickedAccount.b_nft)
		}
	},[clickedAccount])

	//#region
	// const refreshData = (_portfolio) =>{
	
	// 	if (_portfolio && _portfolio.length>0)
	// 	{
	// 		// const numOfData = _portfolio.length;
	// 		// console.log(`PORTFOLIO numOfData: ${numOfData}`)
	// 			// let sum = 0;
	// 			// _portfolio.forEach(item => sum += Number(item.Value) );
	// 			// setTotalPortfolioValue(sum);

	// 		return _portfolio.map((token, index) => {
	// 			return (
	// 				<div key={index} className="bg-gradient-1 coin-holding flex-wrap" style={{height:"70px", marginBottom:"15px", backgroundColor:""}}>
	// 					<div className="col-xl-1 col-xxl-3">
	// 						<div className="mb-2">
	// 							<div className="d-flex align-items-center">
	// 								<div className="ms-3">
	// 									<p className="mb-0 op-6" >{"token.NickName"}</p>
	// 								</div>
	// 							</div>
	// 						</div>
	// 					</div>
	// 					<div className="col-xl-1 col-xxl-3">
	// 						<div className="mb-2">
	// 							<div className="d-flex align-items-center">
	// 								<div className="ms-3">
	// 									<p className="mb-0 op-6">{"token.cashPercent"}</p>
	// 								</div>
	// 							</div>
	// 						</div>
	// 					</div>
	// 					<div className="col-xl-5 col-xxl-3">
	// 						<div className="mb-2">
	// 							<div className="d-flex align-items-center">
	// 								<div className="ms-3">
	// 									<p className="mb-0 op-6">{"token.FinalMessage"}</p>
	// 								</div>
	// 							</div>
	// 						</div>
	// 					</div>
	// 					<div className="col-xl-3 col-xxl-3">
	// 						<div className="mb-2">
	// 							<div className="d-flex align-items-center">
	// 								<p className="mb-0 ms-2 font-w400 text-black">${"token.NFTaddress"}</p>	
	// 							</div>
	// 						</div>
	// 					</div>
	// 					<div className="col-xl-2 col-xxl-3">
	// 						<div className="mb-2">
	// 							<div className="d-flex align-items-center">
	// 								<p className="mb-0 ms-2 font-w400 text-black">{token.Multigi1}</p>	
	// 							</div>
	// 						</div>
	// 					</div>
	// 					<div className="col-xl-1 col-xxl-3">
	// 						<div className="mb-2">
	// 							<div className="d-flex align-items-center">
	// 								<p className="mb-0 ms-2 font-w400 text-black">{token.Multigi2}</p>	
	// 								{/* <p className="mb-0 ms-2 font-w400" style={{color:`${token.status===true?"#36FC00":"red"}`}} >{token.status===true?"Registered":"Unregistered"}</p>	 */}
	// 							</div>
	// 						</div>
	// 					</div>
	// 					<div className="col-xl-1 col-xxl-3">
	// 						<div className="mb-2">
	// 							<div className="d-flex align-items-center">
	// 								{/* <p className="mb-0 ms-2 font-w400 text-black">APPROVE</p>	 */}
	// 								<button className="btn btn-success me-3 mb-2 rounded" style={{border: "none", color:"black"}}  onClick = { () => approveToken(_portfolio[index]) }>Edit</button> 
	// 							</div>
	// 						</div>
	// 					</div>
	// 					<div className="col-xl-1 col-xxl-3">
	// 						<div className="mb-2">
	// 							<div className="d-flex align-items-center">
	// 								{/* <p className="mb-0 ms-2 font-w400 text-black">APPROVE</p>	 */}
	// 								<button className="btn btn-warning me-3 mb-2 rounded" style={{border: "none", color:"black"}}  onClick = { () => registerToken(_portfolio[index]) }>Save</button> 
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
	// 	setMyPortfolio( refreshData(accountbalances) );
	// }, [accountbalances]);
	//#endregion


	return (
		<>
			<div className="card">
				<div className="card-header border-0 pb-0">
					<h4 className="mb-0 fs-20 text-black">Beneficiary Inheritance Settings</h4>
				</div>

				<div className="card-body" style={{overflowY: "scroll", height:"400px"}}>

				    <div key={1} className="bg-gradient-1 coin-holding flex-wrap" style={{height:"90px", marginBottom:"15px", backgroundColor:""}}>
						<div className="col-xl-2 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
									<div className="ms-3">
										<p className="mb-0 op-6" >Nickname</p>
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
									{/* <button className="btn btn-outline-primary btn-success me-3 mb-2 rounded" style={{border: "none", color:"black", width:"150px"}}  onClick = { () => approveToken("_portfolio[index]") }>Edit</button>  */}
								</div>
							</div>
						</div>
						<div className="col-xl-2 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
									{/* <button className="btn btn-warning me-3 mb-2 rounded" style={{border: "none", color:"black", width:"150px"}}  onClick = { () => registerToken("_portfolio[index]") }>Save</button>  */}
								</div>
							</div>
						</div>
					</div>

					<div key={2} className="bg-gradient-1 coin-holding flex-wrap" style={{height:"90px", marginBottom:"15px", backgroundColor:""}}>
						<div className="col-xl-2 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
									<div className="ms-3">
										<p className="mb-0 op-6" >Final Message</p>
									</div>
								</div>
							</div>
						</div>
						<div className="col-xl-9 col-xxl-3"  style={{backgroundColor:""}}>
							<div className="mb-2" style={{backgroundColor:""}}> 
								<div className="d-flex align-items-center"  style={{backgroundColor:""}}>
									<div className="ms-3" style={{backgroundColor:"", width:"90%"}}>
										<input type="text" value = {finalMsg } placeholder="e.g. To my beloved daughter. Invest your funds wisely and learn Substrate and Solidity" className="form-control" style={{color:"white", width:"100%"}} onChange={(event) => { 
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

					<div key={3} className="bg-gradient-1 coin-holding flex-wrap" style={{height:"90px", marginBottom:"15px", backgroundColor:""}}>
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
									{/* <button className="btn btn-outline-primary btn-success me-3 mb-2 rounded" style={{border: "none", color:"black", width:"150px"}}  onClick = { () => approveToken("_portfolio[index]") }>Edit</button>  */}
								</div>
							</div>
						</div>
						<div className="col-xl-2 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
									{/* <button className="btn btn-warning me-3 mb-2 rounded" style={{border: "none", color:"black", width:"150px"}}  onClick = { () => registerToken("_portfolio[index]") }>Save</button>  */}
								</div>
							</div>
						</div>
					</div>

					<div key={4} className="bg-gradient-1 coin-holding flex-wrap" style={{height:"90px", marginBottom:"15px", backgroundColor:""}}>
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
					</div>

					<div key={5} className="bg-gradient-1 coin-holding flex-wrap" style={{height:"90px", marginBottom:"15px", backgroundColor:""}}>
						<div className="col-xl-2 col-xxl-3">
							<div className="mb-2">
								<div className="d-flex align-items-center">
									<div className="ms-3">
										<p className="mb-0 op-6" >MultiSig Account Signers</p>
									</div>
								</div>
							</div>
						</div>
						<div className="col-xl-3 col-xxl-3"  style={{backgroundColor:""}}>
							<div className="mb-2" style={{backgroundColor:""}}> 
								<div className="d-flex align-items-center"  style={{backgroundColor:""}}>
									<div className="ms-3" style={{backgroundColor:"", width:"90%"}}>
										<input type="text" value = {multisig1} placeholder="0x12345679ABCDEF1" className="form-control" style={{color:"white", }} onChange={(event) => { 
										setMultisi1(event.target.value);
									   }
									} />
									</div>
								</div>
							</div>
						</div>

						<div className="col-xl-3 col-xxl-3"  style={{backgroundColor:""}}>
							<div className="mb-2" style={{backgroundColor:""}}> 
								<div className="d-flex align-items-center"  style={{backgroundColor:""}}>
									<div className="ms-3" style={{backgroundColor:"", width:"90%"}}>
										<input type="text" value = {multisig2} placeholder="0x12345679ABCDEF2" className="form-control" style={{color:"white", }} onChange={(event) => { 
										setMultisi2(event.target.value);
									   }
									} />
									</div>
								</div>
							</div>
						</div>

						<div className="col-xl-3 col-xxl-3"  style={{backgroundColor:""}}>
							<div className="mb-2" style={{backgroundColor:""}}> 
								<div className="d-flex align-items-center"  style={{backgroundColor:""}}>
									<div className="ms-3" style={{backgroundColor:"", width:"90%"}}>
										<input type="text" value = {multisig3} placeholder="0x12345679ABCDE3" className="form-control" style={{color:"white", }} onChange={(event) => { 
										setMultisi3(event.target.value);
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


					{/* {myPortfolio} */}
				</div>
			</div>
		
		</>
    )
}
export default AcPortfolio; 
