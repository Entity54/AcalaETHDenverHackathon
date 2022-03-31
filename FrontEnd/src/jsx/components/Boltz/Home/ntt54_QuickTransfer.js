import React,{useState,useEffect} from 'react';
import {Link} from 'react-router-dom';
import TestimonialOwl from './TestimonialOwl';
import {Dropdown} from 'react-bootstrap';

import {getAllData, getAccountBalance, transfer_nativeToken, transfer_ERC20} from '../../../../ntt54Oracle.js';
import { getAdminFeeTokensBalances, depositFees } from '../../../../ntt54_accounts.js';        

const portfolio = [{ticker: "ACA"}, {ticker: "AUSD"}];
 
// const QuickTransfer = ({setupSpecs, portfolio, icons, tickSymbols, blockHeader, customerPortfolio}) => {
const QuickTransfer = ({ getSmartContactBalances, willAdmin, ntt54Will_address, currentAccount, provider, wallet, ntt54Will, setupSpecs, icons, tickSymbols, blockHeader, customerPortfolio}) => {

	const [baseCurrency, setBaseCurrency] = useState("AUSD");	
	const [tokenDropDowns, setTokenDropDowns] = useState(null);
	const [baseCurrencyPlaceHolder, setBaseCurrencyPlaceHolder] = useState("");	
    const [inputTranferAmount, setInputTranferAmount] = useState("");
    const [transfer_IsSubmiting, setTransfer_IsSubmiting] = useState(false);
    const [transactionMessage, setTransactionMessage] = useState("...........");

	// const [baseCurrencyIconIndex, setBaseCurrencyIconIndex] = useState(0);	
	// const [sendToAddress, setSendToAddress] = useState("");	


	// const provideAddressToSendCoins = (adr) => {
	// 	setSendToAddress(adr);
	// };

	const getAdmin_Fee_TokenBalances = async () => {
		const balances = await getAdminFeeTokensBalances(willAdmin);
		if (baseCurrency==="ACA") setBaseCurrencyPlaceHolder(balances[0].NumTokens);
		else if (baseCurrency==="AUSD") setBaseCurrencyPlaceHolder(balances[1].NumTokens);
	}

	const settingBaseCurrency = (tokSymbl) => {
		setBaseCurrency(tokSymbl);
	};


	const transferBalance = async () => {
		console.log(`QuickTransfer transferBalance baseCurrency: `,baseCurrency,`  inputTranferAmount: `,inputTranferAmount);
    	// const amount = inputTranferAmount; //.toString();
		console.log(`==>>> transferBalance inputTranferAmount: ${inputTranferAmount} typeof inputTranferAmount: ${typeof inputTranferAmount}`);
        
        if (ntt54Will && inputTranferAmount!=="0" && inputTranferAmount!=="" && willAdmin)
		{
			setTransfer_IsSubmiting(true);
			setTransactionMessage(`Deposit transaction submitted at BlockNumber: ${blockHeader.number}`);

			depositFees(baseCurrency, inputTranferAmount, ntt54Will)
			.then((res) => {
				console.log(`We have just called depositFees for baseCurrency: ${baseCurrency} inputTranferAmount:${inputTranferAmount}`);
     			setTransfer_IsSubmiting(false);
				setInputTranferAmount("");
				getAdmin_Fee_TokenBalances();
				getSmartContactBalances(ntt54Will,willAdmin);
			})
			.catch((er) => console.log(`Error in approveToken: `,er));

			// if ( baseCurrency==='PRING' )
			// {
			// 	const receipt = await transfer_nativeToken(setupSpecs.wallet, amount, sendToAddress);
			// 	setTransfer_IsSubmiting(false);
			// 	setInputTranferAmount("");
			// }
			// else 
			// {
			// 	console.log(`ntt54_QuickTranfer transferBalance for ${baseCurrency} with tokenAddress: ${portfolio[baseCurrencyIconIndex].tokenAddress}`);
			// 	const receipt = await transfer_ERC20(setupSpecs.wallet, portfolio[baseCurrencyIconIndex].tokenAddress, amount, sendToAddress);
				
			//     receipt.wait().then( resolveMsg => {
			// 			console.log(`ntt54_QuickTransfer ERC20 Transfer The transaction is mined now txReceipt: `,resolveMsg);
			// 	})
			// 	.catch(er => {
			// 		console.log("ntt54_QuickTransfer ERC20 Transfer has thrown the folowing errro: ",er);
		  	// 	});

			// 	setTransfer_IsSubmiting(false);
			// 	setInputTranferAmount("");
			// }
		}

	};

	useEffect(() => {
		// if (portfolio) setBaseCurrencyPlaceHolder(portfolio[baseCurrencyIconIndex].NumTokens);
		// else setBaseCurrencyPlaceHolder("");
		getAdmin_Fee_TokenBalances();
	},[baseCurrency,portfolio]);


	const refreshData = (_portfolio) =>{
		if (_portfolio)
		{
			return _portfolio.map((token, index) => {
				return (
					<Dropdown.Item key={index} onClick={() => { 
						settingBaseCurrency(token.ticker);
						// setBaseCurrencyIconIndex(index);
					} }>{token.ticker}</Dropdown.Item>
				)
			});
		}
		else return <>Loading data...</> 
	}

	useEffect(() => {
		// console.log(`Running useEffect for ntt54_QuickTransfer`);
		setTokenDropDowns( refreshData(portfolio) );
		getAdmin_Fee_TokenBalances();
	}, []);
    // }, [portfolio]);


	return(
		<>
			<div className="card">
				<div className="card-header d-sm-flex d-block pb-0 border-0">
					<div>
						<h4 className="fs-20 text-black">Deposit</h4>
					</div>
					<div  onClick = {() => setInputTranferAmount(baseCurrencyPlaceHolder)}>
						<span className="fs-20" style={{color:"#a7adba"}}>{baseCurrencyPlaceHolder===""?"":`Max: ${baseCurrencyPlaceHolder}`}</span>
					</div>
				</div>
				
				<div className="card-body">
					<div className="form-wrapper">
						<div className="form-group">
							<div className="input-group input-group-lg">
								<div className="input-group-prepend">
									<Dropdown>
											<Dropdown.Toggle variant="" as="div" className="input-group-text form-control style-2 default-select cursor-pointer">{baseCurrency} </Dropdown.Toggle>
											<Dropdown.Menu style={{height:"500px", overflowY: "scroll"}} >
												{tokenDropDowns}
											</Dropdown.Menu>
									</Dropdown>
								</div>
								<input type="number" step="0.01" className="form-control"  value={inputTranferAmount}  placeholder={baseCurrencyPlaceHolder===""?"":`${Number(baseCurrencyPlaceHolder).toFixed(2)}`} onChange = {(event) => setInputTranferAmount( (Math.min( Number(baseCurrencyPlaceHolder) , Number(event.target.value) )).toString() )} style={{color:"white"}} />
							</div>
						</div>
						{/* <div className="form-group">
								<div className="input-group input-group-lg">
									<div className="input-group-prepend">
										<span className="input-group-text">send to Address</span>
									</div>
									<input type="text" className="form-control" value={sendToAddress} placeholder={"DVM Address"} onChange = {(event) => setSendToAddress(event.target.value)} style={{fontSize: "18px", color: "white"}} />
								</div>
						</div> */}
					</div>

					<br/>
					<span style={{fontSize:18, color:"green"}}>{transactionMessage}</span>
					<br/>
					{/* <br/> */}

					{/* <div className="d-flex mb-3 justify-content-between align-items-center view-link">
						<h4 className="text-black fs-20 mb-0">Recent Addresses</h4>
					</div> */}
					
					{/* <TestimonialOwl provideAddressToSendCoins={provideAddressToSendCoins} /> */}
					
					<div className="row pt-5 align-items-center">
						<div className="col-sm-3">
						</div>

						<div className="col-sm-6">
							<Link to={"#"} className="btn btn-primary d-block btn-lg rounded" style={{backgroundColor: "#DE9C06"}}>
    				            <button className="btn-primary" disabled={transfer_IsSubmiting} onClick = {transferBalance} style={{border: "none", backgroundColor: "#DE9C06"}}>Submit</button> 
							</Link>
						</div>
					</div>
				</div>
			</div>
		
		</>
	)
}
export default QuickTransfer;