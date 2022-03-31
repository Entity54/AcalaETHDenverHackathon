// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@acala-network/contracts/dex/IDEX.sol";
import "@acala-network/contracts/schedule/ISchedule.sol";
import "@acala-network/contracts/utils/Address.sol";

    
contract ntt54Will is ADDRESS {

    IDEX dex = IDEX(ADDRESS.DEX);
    ISchedule schedule = ISchedule(ADDRESS.Schedule);

    //FEEs
    uint constant public mantissa = 1e12;
    address public cashAddress     = ADDRESS.AUSD; //0x0000000000000000000100000000000000000001;   
    address public nativeAddress   = ADDRESS.ACA;  //0x0000000000000000000100000000000000000000;   
    address public treasuryAddress = 0x8731732996d815E34DA3eda6f13277a919b3d0d8;   //this is project treasury address
    uint constant public WILLFEES    =    2 * mantissa ;   // 2 ACA        2000000000000
    uint constant public PROJECTFEES = 2000 * mantissa;   // 2000 AUSD 2000000000000000
    uint public willAdminBalance_NATIVE;         //will owner balance in native token
    uint public willAdminBalance_STABLE;         //will owner balance in stable token
    uint public requestStakedFundsState;         //shows the staked funds state

    address public willAdmin;             //will owner

    //ADMINISTRATOR ACCOUNT MANAGEMENT Track current admin accounts and ERC20 tokens these hold, to be transferred at Phase3
    address[] public adminAccounts;    //registers all admin accounts that hold funds FirstAccount is called Main Account
    mapping(address => bool) public registeredAccounts; //checkes if an account is registered
    mapping(address => uint) public registeredAccountsBalance; //checkes if an account is registered

    address[] public assetsERC20;      //tracks hold of various assets the admin is holding
    mapping(address => bool) public registeredToken;  //checks if a token is already registered
    mapping(address => mapping(address => bool)) public registeredAccountToken;  //checks if a token is already registered for a specific account
    mapping(address => address[]) public registeredAccountHoldings;   //which ERC20 tokens each account holds
    
    //GENERAL ACCOUNT MANAGEMENT
    mapping(address => mapping(address => uint)) public clientBalances;  //Kept for tracking administrator deposits/withdrawals for ACA and AUSD ACAaddress => clientAddreess => uint
    mapping(address => mapping(address => uint)) public feesBalances;    //Tracks Fees Balance of Administrator

    event Received(address, uint);

    bool public willState = false;        //if true the will is active, else will is not active
    uint public willIssueBlockNum;        //block Will was created at
    uint public willIssueTimeStamp;       //blovk timestamp when will was created at
    string public willGeneralMessage;     //general message for will
    uint public trigger_dt1;              //time in block numbers to triggers first check
    uint public trigger_dt2;              //time in block numbers to triggers second check
    uint public trigger_dt3;              //time in block numbers to triggers third check
    uint public lastCall_dt4;             //time in block numbers to transfer funds to heirs after third check
    uint public triggerPoint1;            //block number that first trigger will be sent
    uint public triggerPoint2;            //block number that second trigger will be sent
    uint public triggerPoint3;            //block number to transfer funds to sc
    uint public lastCallPoint;            //block number to swap tokens to AUSD
    uint public distributionPoint;        //block number to transfer out AUSD to heirs
    uint public willStage;                // 1 for first trigger poiint, 2 for 2nd and 3 for 3rd, 4 for Last Call 
    bool public willSwapState = true;     //once false all necessary swaps to stable have occured and stable is ready to be distributed to heirs 
    uint public schedulerCounter = 0;     //counts scheduler runs

    uint public inheritance_Cash;         //total inheritance cash aUSD
    address[] public inheritance_Assets;  //total tokenised assets
    
    //Details for any Will Neneficiary
    struct Will_Beneficiary {
        address beneficiaryAddress;
        string beneficiaryNickName;
        string finalMessage;
        uint cashPercent;
        address assets;   //refers to NFT assets TODO
        uint index;
    }
  
    address[] public willBeneficiaries;                         //array with addresses of all beneficiaries
    mapping(address => Will_Beneficiary) public beneficiaries;  //mapping for beneficiaries


    modifier onlyAdmin {
        require(msg.sender==willAdmin,"action only for admin");
        _;
    }
    modifier onlyAdmiOrWillSC {
        require(msg.sender==address(this) || msg.sender==willAdmin,"action only for will sc or admin");
        _;
    }
    modifier onlyIfWillActive {
        require(willState,"Will State is False");
        _;
    }


    constructor() {
        willAdmin = msg.sender;
    }

    function getAdminAccounts() public view returns(address[] memory) {
        return adminAccounts;
    }

    function getAssetsERC20s() public view returns(address[] memory) {
        return assetsERC20;
    }

    function getWillBeneficiaries() public view returns(address[] memory) {
        return willBeneficiaries;
    }

    function registerOwnerAccounts(address account) external {
        adminAccounts.push(account);
        registeredAccounts[account] = true;
    }

    function registerAccountTokens(address account, address tokenAddress) external {
        require(registeredAccounts[account],"acount is not registered");
        require(!registeredAccountToken[account][tokenAddress] , "token is already registered for this account");
        registeredAccountToken[account][tokenAddress] = true;
        registeredAccountHoldings[account].push(tokenAddress);
        registeredToken[tokenAddress] = true;
        assetsERC20.push(tokenAddress);
    }

    function getRegisteredAccountTokenAllowance(address account, address tokenAddress) public view returns(uint) {
        ERC20 token = ERC20(tokenAddress);
        return token.allowance(account, address(this));
    }
   
    //in production this sould be private
    function depositFunds() public {
        for (uint i=0; i<adminAccounts.length; i++)
        {
            address acc = adminAccounts[i];
            for (uint j=0; j< registeredAccountHoldings[acc].length; j++)
            {
                address tokenAddress = registeredAccountHoldings[acc][j];
                ERC20 token = ERC20(tokenAddress);
                uint amount = token.balanceOf(acc);
                if (amount > 0)
                {
                    token.transferFrom(acc,address(this),amount);
                    clientBalances[tokenAddress][acc] +=amount;     //in case we want refund
                }
            }
        }
    }

    function refundFunds() public {
        for (uint i=0; i<adminAccounts.length; i++)
        {
            address acc = adminAccounts[i];
            for (uint j=0; j< registeredAccountHoldings[acc].length; j++)
            {
                address tokenAddress = registeredAccountHoldings[acc][j];
                ERC20 token = ERC20(tokenAddress);
                uint amount = clientBalances[tokenAddress][acc]; 
                if (amount > 0)
                {
                    clientBalances[tokenAddress][acc] -=amount;
                    token.transfer(acc, amount);
                }
            }
        }
    }

    //to be used for AUSD and ACA
    function depositFees(address tokenAddress, uint amount) external onlyAdmin {
        ERC20 token = ERC20(tokenAddress);
        require(amount <= token.allowance(msg.sender,address(this)),"client needs to increase allowance");
        token.transferFrom(msg.sender,address(this),amount);
        feesBalances[tokenAddress][msg.sender] +=amount;

        //TODO if tokenAddress == cashAddress then another function needs to be called to registered sc to deposita and stake
        //register sc as deposit to staking sc
        //approve smart contract as spender for this balance
    }

    
    function withdrawFees() public onlyAdmin {
        if (willStage==4)
        {
            if (address(this).balance > 1*mantissa) 
            {
                 payable(treasuryAddress).transfer(address(this).balance);  //withdraws ACA to Treasury        
            }
            requestStakedFunds(4);
        }
        else {
            if (address(this).balance > 1*mantissa) 
            {
                withdrawSC();            //withdraws ACA to admin
            }
            requestStakedFunds(3);
        }
        feesBalances[nativeAddress][willAdmin] = 0;
    }

    function requestStakedFunds(uint _willStage) private {
        //trigger staked contract to release and send funds
        requestStakedFundsState = _willStage;
    }

    function distributeStakedFunds() public {
        ERC20 token_cash = ERC20(cashAddress);
        if (requestStakedFundsState==4)
        {
            //distribute AUSD equally to heirs
        }
        else {
            //send AUSD back to Admin
        }
    }


    function setWillGeneralMessage(string memory message, uint _trigger_dt1, uint _trigger_dt2, uint _trigger_dt3, uint _lastCall_dt4) external {
        willGeneralMessage = message;
        trigger_dt1   = _trigger_dt1;
        trigger_dt2   = _trigger_dt2;
        trigger_dt3   = _trigger_dt3;
        lastCall_dt4  = _lastCall_dt4;
        willStage = 0;
    }
 
    function setWill() external {
        require( !willState , "willState is already true");
        willIssueBlockNum  = block.number;
        willIssueTimeStamp = block.timestamp;
        triggerPoint1 = block.number + trigger_dt1;
        triggerPoint2 = block.number + trigger_dt1 + trigger_dt2;
        triggerPoint3 = block.number + trigger_dt1 + trigger_dt2 + trigger_dt3;
        lastCallPoint =  block.number + trigger_dt1 + trigger_dt2 + trigger_dt3 + lastCall_dt4;
        distributionPoint =  block.number + trigger_dt1 + trigger_dt2 + trigger_dt3 + lastCall_dt4 + 5;
        willState = true;

        schedule.scheduleCall(
            address(this),
            0,
            1000000,
            5000,
            5,
            abi.encodeWithSignature("checkWillStage()")
        );

    } 


    function addWillBeneficiary(address _beneficiaryAddress, string calldata _beneficiaryNickName, string calldata _finalMessage, uint _cashPercent, address _assets) external onlyAdmin {
        Will_Beneficiary memory newBeneficiary = Will_Beneficiary({beneficiaryAddress: _beneficiaryAddress, beneficiaryNickName: _beneficiaryNickName, finalMessage: _finalMessage, cashPercent: _cashPercent, assets: _assets, index: willBeneficiaries.length });
        willBeneficiaries.push(_beneficiaryAddress);
        beneficiaries[_beneficiaryAddress] = newBeneficiary;
    }

    function amendWillBeneficiaryCash(address _beneficiaryAddress, string calldata _beneficiaryNickName, string calldata _finalMessage, uint _cashPercent) external onlyAdmin {
        if ( keccak256(bytes( beneficiaries[_beneficiaryAddress].beneficiaryNickName )) != keccak256(bytes(_beneficiaryNickName)) )
        {
            beneficiaries[_beneficiaryAddress].beneficiaryNickName = _beneficiaryNickName;
        }
        if ( keccak256(bytes( beneficiaries[_beneficiaryAddress].finalMessage )) != keccak256(bytes(_finalMessage)) )
        {
            beneficiaries[_beneficiaryAddress].finalMessage = _finalMessage;
        }
        if ( beneficiaries[_beneficiaryAddress].cashPercent != _cashPercent)
        {
            beneficiaries[_beneficiaryAddress].cashPercent = _cashPercent;
        }
    }

    function removeWillBeneficiary(address _beneficiaryAddress) external onlyAdmin {
        Will_Beneficiary memory currentBeneficiary = beneficiaries[_beneficiaryAddress];
        if (currentBeneficiary.beneficiaryAddress!=address(0)) {  //beneficary exists
            uint numOfBeneficiaries = willBeneficiaries.length;
            if (numOfBeneficiaries > 1)
            {
                uint indx = currentBeneficiary.index;
                if (indx!=(willBeneficiaries.length - 1))
                {
                    willBeneficiaries[indx] = willBeneficiaries[ willBeneficiaries.length - 1];
                }
            }
            willBeneficiaries.pop();
            delete beneficiaries[_beneficiaryAddress];
        }
    }

    function getBeneficiaryByAddress(address _beneficiaryAddress) external view returns(Will_Beneficiary memory) {
        return beneficiaries[_beneficiaryAddress];
    }

    function cleanUp() public {
        willGeneralMessage = "";
        trigger_dt1 = 0;
        trigger_dt2 = 0;
        trigger_dt3 = 0;
        lastCall_dt4 = 0;
        willIssueBlockNum = 0;
        willIssueTimeStamp = 0;
        triggerPoint1 = 0;
        triggerPoint2 = 0;
        triggerPoint3 = 0;
        lastCallPoint = 0;
        distributionPoint = 0;
        willSwapState = true;
        inheritance_Cash = 0;

        //delete adminAccounts
        for (uint i=0; i< adminAccounts.length; i++) {
            address accAddr = adminAccounts[i];
            registeredAccounts[accAddr] = false;
        }
        adminAccounts = new address[](0);

    }

    
    //To be called by Scheduler
    //Check block.number vs TriggerPoints and Last call and set Will Stage and call swapLiquidAssetToStable
    // function checkWillStage() public onlyIfWillActive returns(uint) {
    function checkWillStage() public returns(uint) {

        if ( block.number > distributionPoint && willStage==5 )
        {
            willStage = 6;
            cleanUp();
        }
        else if ( block.number > distributionPoint && willStage<5 )
        {
            willStage = 5;
            willState= false;
            releaseWill();
        }
        else if (block.number > lastCallPoint && willStage<4)
        {
            willStage = 4;
            swapLiquidAssetToStable();
        }
        else if (block.number > triggerPoint3 && willStage<3)
        {
            willStage = 3;
            depositFunds(); //The time has arrived to pull all registred tokens of registred account to this sc  **** ANGELOS HERE ****  
        }
        else if (block.number > triggerPoint2 && willStage<2) {
            willStage = 2;
        }
        else if (block.number > triggerPoint1 && willStage<1) {
            willStage = 1;
        }

        if( willStage<6 )
        {
            schedule.scheduleCall(
                address(this),
                0,
                1000000,
                5000,
                2,
                abi.encodeWithSignature("checkWillStage()")
            );

            schedulerCounter++;
        }

        return willStage;
    }
    
    //when called resets triggerPoints and willStage
    function renewWillTriggers() private {
        triggerPoint1 = block.number + trigger_dt1;
        triggerPoint2 = triggerPoint1 + trigger_dt2;
        triggerPoint3 = triggerPoint2 + trigger_dt3;
        lastCallPoint = triggerPoint3 + lastCall_dt4;
        distributionPoint = lastCallPoint + 5;
        willStage = 0;    //revert back to stage 0
    }

    //This to be called by the willAdmin to renew will intervals manually
    function aliveAndKicking() public onlyAdmiOrWillSC onlyIfWillActive {
       renewWillTriggers();
    }

    //This can be called by the scheduler periodically.
    function checkAdminBalance() public onlyIfWillActive returns(bool){
        require(msg.sender!=willAdmin,"action not for admin");

        //cycle thorugh all admin accounts
        bool adminBalanceDecreased = false;
        uint i = 0;
        while (i<adminAccounts.length && !adminBalanceDecreased) {
            address adminAcc = adminAccounts[i];
            uint freshAdminBalance = adminAcc.balance;

            if (freshAdminBalance < registeredAccountsBalance[adminAcc])   //alive and signing trransactions
            {
                adminBalanceDecreased = true;
                registeredAccountsBalance[adminAcc] = freshAdminBalance;
                renewWillTriggers();
            } else  if (freshAdminBalance > registeredAccountsBalance[adminAcc])
            {
                registeredAccountsBalance[adminAcc] = freshAdminBalance;
            }

            i++;
        }
     
        return adminBalanceDecreased;
    }


    function voidWill() external onlyAdmin onlyIfWillActive {
        //transfer out any funds back to the Admin registered accounts
        refundFunds();   

        //todo Transfer out any assets NFTS

        //reset to intial conditions
        willState = false;
        cleanUp();

        //delete beneficiaries
        for (uint i=0; i< willBeneficiaries.length; i++) {
            address accAddr = willBeneficiaries[i];
            delete beneficiaries[accAddr];
        }
        willBeneficiaries = new address[](0);
    }

    
    //THIS SHOULD BE RUN BLOCK-BY-BLOCK IMAGINE IF WE HAD 100 ASSETS TO SWAP PER REGISTERED ACCOUNT
    function swapLiquidAssetToStable() private {

        for (uint i=0; i<adminAccounts.length; i++)
        {
            address acc = adminAccounts[i];
            for (uint j=0; j< registeredAccountHoldings[acc].length; j++)
            {
                address tokenAddress = registeredAccountHoldings[acc][j];
                uint balance = clientBalances[tokenAddress][acc];

                if (balance > 0)
                {
                    if (tokenAddress!=cashAddress)
                    {
                        address[] memory path = new address[](2);
                        path[0] = tokenAddress;
                        path[1] = ADDRESS.AUSD;
                        uint targetReceivedAmount = dex.getSwapTargetAmount(path, balance);
                        require(dex.swapWithExactSupply(path, balance, 1), "Escrow: Swap failed");

                        inheritance_Cash +=targetReceivedAmount;
                    }
                    else if (tokenAddress==cashAddress)
                    {
                        inheritance_Cash +=balance;
                    }
                }

            }
        }

        willSwapState = false;
    }

   
    function releaseWill() private {
        uint distributedCash = 0;
        ERC20 cashToken = ERC20(cashAddress);

        //Distribute Funds
        for (uint i=0; i< willBeneficiaries.length; i++) {
            address bfAddress = willBeneficiaries[i];
            Will_Beneficiary memory bfStruct = beneficiaries[bfAddress];

            //SEND CASH TO ACCOUNTS
            if (bfStruct.cashPercent > 0) {
                uint cashAmount;
                if (i < (willBeneficiaries.length-1))
                {
                    cashAmount = (inheritance_Cash / 100 ) * (bfStruct.cashPercent) ;
                    distributedCash +=cashAmount;
                }
                else {
                    cashAmount = inheritance_Cash - distributedCash;
                }

                if (cashAmount > 0) //todo setMinimum quantity like exdep
                {
                    cashToken.transfer(bfAddress, cashAmount);
                }

            }

            //todo SEND NFTS ASSETS TO ACCOUNTS
            delete beneficiaries[bfAddress];
        }

        willBeneficiaries = new address[](0);
    } 


    function getBalanceSC() public view returns(uint) {
        return address(this).balance;
    }

    function withdrawSC() public onlyAdmin {
        payable(msg.sender).transfer(address(this).balance);
    }

    receive() external payable {
        emit Received(msg.sender, msg.value);
    }
}    