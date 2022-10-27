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
    AccountId
} = require("@hashgraph/sdk");
const fs = require("fs");
const bytecode = fs.readFileSync(
    "./binaries/contracts_AuctionContract_sol_TokenCreator.bin"
  );
const { createClient } = require('./client.js');
require("dotenv").config();
const Web3 = require("web3");
const axios = require("axios");
const ethers = require('ethers');
let client;
let ContractId;
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
        ContractId = (receipt.contractId).toString();
        console.log("The new contract ID is ", ContractId);
        let outputJSON = { ContractId: ContractId };
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

module.exports = {
     deployContract
}