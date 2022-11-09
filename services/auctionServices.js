const {
    ContractCallQuery,
    ContractCreateFlow,
    ContractUpdateTransaction,
    Hbar,
    ContractExecuteTransaction,
    ContractFunctionParameters,
    PrivateKey,
    AccountCreateTransaction,
    AccountBalanceQuery,
    AccountId,
    TokenId,
    ContractId
} = require("@hashgraph/sdk");
const fs = require("fs");
const bytecode = fs.readFileSync(
    "./binaries/contracts_AuctionContract_sol_AuctionContract.bin"
  );
const { createClient } = require('./client.js');
require("dotenv").config();
const Web3 = require("web3");
const axios = require("axios");
const ethers = require('ethers');
let client;
let contractId;
const addStudentTransactionMemo = "DMS:Student Submit Transaction";
const web3 = new Web3;

async function deployContract() {
    try {
        let response = await createClient();
        if (response.err) {
            console.log("response.err", response.err);
            let outpuJSON = {
                message: "Client creation Failed",
                err: response.err
            };
            return outpuJSON;
        }
        client = response.client;

        const myAccountId = process.env.MY_ACCOUNT_ID;
        const privateKey = process.env.MY_PRIVATE_KEY;
        let private_key = PrivateKey.fromString(privateKey);
        let publicKey = private_key.publicKey;
        console.log("privatekey: "+ privateKey)
        console.log("publickey: "+ publicKey)
        const contractCreate = new ContractCreateFlow()
            .setGas(10000000)
            .setAdminKey(publicKey)
            .setContractMemo("AUCTION")
            .setAutoRenewAccountId(myAccountId)
            .setAutoRenewPeriod(8000001)// 92 days  
            .setBytecode(bytecode);
        
        console.log("contract create flow.....");
        const txResponse = await contractCreate.execute(client);
        const receipt = await txResponse.getReceipt(client);
        contractId = (receipt.contractId).toString();
        console.log("The new contract ID is ", contractId);
        let outputJSON = { contractId: contractId };
        return outputJSON;
    }
    catch (error) {
        let outpuJSON = {
            message: "Contract Deployment Failed",
            err: error
        }
        return outpuJSON;
    }

}

async function createAuctionDetails(data) {
    try {
        console.log("inside createAuctionDetails: "+ JSON.stringify(data))
        let response = await createClient();
        if (response.err) {
            console.log("response.err", response.err);
            let outpuJSON = {
                message: "Client creation Failed",
                err: response.err
            };
            return outpuJSON;
        }
        client = response.client;
        console.log("client called....")       
        
        // Create NFT using precompile function
        const createToken = new ContractExecuteTransaction()
        .setContractId(ContractId.fromString(data.contractId))
        .setGas(3000000) // Increase if revert
        .setPayableAmount(5) // Increase if revert
        .setFunction("createAuction",
            new ContractFunctionParameters()
            .addAddress(TokenId.fromString(data.tokenId).toSolidityAddress()) //token
            .addInt64(data.serialNumber) // base price
            .addAddress(AccountId.fromString(data.walletAcct).toSolidityAddress())
            .addUint256(data.basePrice) // base price
            .addUint256(data.salePrice)); // auctioner

        console.log("b4 execute");
        const createTokenTx = await createToken.execute(client);
        console.log("b4 recrd");
        const createTokenRx = await createTokenTx.getRecord(client);
        // console.log("createTokenRx: "+JSON.stringify(createTokenRx));
        // console.log("receipt: "+JSON.stringify(createTokenRx.receipt));
        console.log("transactionHash: "+createTokenRx.transactionHash);
        console.log("transactionHash: "+createTokenRx.transactionHash.toString());
        
     
} catch(error) {
        console.log("Error : "+ error)
    } 
}

async function placeBid(data) {
    try {
        console.log("inside place bid: "+ JSON.stringify(data))
        let response = await createClient();
        if (response.err) {
            console.log("response.err", response.err);
            let outpuJSON = {
                message: "Client creation Failed",
                err: response.err
            };
            return outpuJSON;
        }
        client = response.client;
        console.log("client called....")       
        
        // Create NFT using precompile function
        const createToken = new ContractExecuteTransaction()
        .setContractId(ContractId.fromString(data.contractId))
        .setGas(3000000) // Increase if revert
        .setPayableAmount(10) // Increase if revert
        .setFunction("placeBid",
            new ContractFunctionParameters()
            .addAddress(TokenId.fromString(data.tokenId).toSolidityAddress()) //token
            .addInt64(data.serialNumber) // base price // base price
            .addUint256(data.price)
            .addAddress(AccountId.fromString(data.auctioner).toSolidityAddress())); // auctioner

        console.log("b4 execute");
        const createTokenTx = await createToken.execute(client);
        console.log("b4 recrd");
        const createTokenRx = await createTokenTx.getRecord(client);
        // console.log("createTokenRx: "+JSON.stringify(createTokenRx));
        // console.log("receipt: "+JSON.stringify(createTokenRx.receipt));
        console.log("transactionHash: "+createTokenRx.transactionHash);
        console.log("transactionHash: "+createTokenRx.transactionHash.toString());
        
     
} catch(error) {
        console.log("Error : "+ error)
    } 
}

async function settleAuction(data) {
    try {
        console.log("inside settle Auction: "+ JSON.stringify(data))
        let response = await createClient();
        if (response.err) {
            console.log("response.err", response.err);
            let outpuJSON = {
                message: "Client creation Failed",
                err: response.err
            };
            return outpuJSON;
        }
        client = response.client;
        console.log("client called....")       
        
        // Create NFT using precompile function
        const createToken = new ContractExecuteTransaction()
        .setContractId(ContractId.fromString(data.contractId))
        .setGas(3000000) // Increase if revert
        .setPayableAmount(200) // Increase if revert
        .setFunction("settleAuction",
            new ContractFunctionParameters()
            .addAddress(TokenId.fromString(data.tokenId).toSolidityAddress()) //token
            .addInt64(data.serialNumber) // base price
            .addAddress(AccountId.fromString(data.walletAcct).toSolidityAddress())
            .addAddress(AccountId.fromString(data.auctioner).toSolidityAddress())); // auctioner

        console.log("b4 execute");
        const createTokenTx = await createToken.execute(client);
        console.log("b4 recrd");
        const createTokenRx = await createTokenTx.getRecord(client);
        // console.log("createTokenRx: "+JSON.stringify(createTokenRx));
        // console.log("receipt: "+JSON.stringify(createTokenRx.receipt));
        console.log("transactionHash: "+createTokenRx.transactionHash);
        console.log("transactionHash: "+createTokenRx.transactionHash.toString());
        
     
} catch(error) {
        console.log("Error : "+ error)
    } 
}

async function getAuction(data) {
    try {
        console.log("inside get Auction: "+ JSON.stringify(data))
        let response = await createClient();
        if (response.err) {
            console.log("response.err", response.err);
            let outpuJSON = {
                message: "Client creation Failed",
                err: response.err
            };
            return outpuJSON;
        }
        client = response.client;
        console.log("client called....")       
        //Contract call query
        
        const query = new ContractCallQuery()
            .setContractId(data.contractId)
            .setGas(300000)
            .setFunction("mapAuction", new ContractFunctionParameters().addAddress(TokenId.fromString(data.tokenId).toSolidityAddress()).addInt64(data.serialNumber).addAddress(AccountId.fromString(data.auctioner).toSolidityAddress()));
        
        // const query = new ContractCallQuery()
        // .setContractId(data.contractId)
        // .setGas(300000)
        // .setFunction("test", new ContractFunctionParameters().addUint256(1));
    
        
            // const query = new ContractCallQuery()
        // .setContractId(data.contractId)
        // .setGas(300000)
        // .setFunction("getTest", new ContractFunctionParameters().addUint256(2));

        //Sign with the client operator private key to pay for the query and submit the query to a Hedera network
        const contractCallResult = await query.execute(client);
        console.log("contractCallResult: " + JSON.stringify(contractCallResult));
        // Get the function value
        const message = contractCallResult.getuint256(0);
        console.log("contract message: " + message);
        
     
} catch(error) {
        console.log("Error : "+ error)
    } 
}

module.exports = {
     deployContract, createAuctionDetails, placeBid, settleAuction, getAuction
}