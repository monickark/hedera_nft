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
    ContractId,
    AccountAllowanceApproveTransaction,
    TransactionId
} = require("@hashgraph/sdk");
const fs = require("fs");
const bytecode = fs.readFileSync(
    "./binaries/contracts_AuctionContract_sol_AuctionContract.bin"
  );
const contract =  require("../build/contracts/AuctionContract.json");
const { createClient,createClient1 } = require('./client.js');
require("dotenv").config();
const Web3 = require("web3");

const ethers = require('ethers');
let client, client1;
let contractId;
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
        const createToken = await new ContractExecuteTransaction()
        .setContractId(ContractId.fromString(data.contractId))
        .setGas(3000000) // Increase if revert
       // .setPayableAmount(data.basePrice) // Increase if revert
        .setFunction("createAuction",
            new ContractFunctionParameters()
            .addAddress(TokenId.fromString(data.tokenId).toSolidityAddress()) //token
            .addInt64(data.serialNumber) // serial number           
            .addUint256(data.basePrice*(10e7))); 

        console.log("data.basePrice: ", data.basePrice*(10e7));
        console.log("b4 execute");
        const createTokenTx = await createToken.execute(client);
        console.log("b4 recrd");
        const createTokenRx = await createTokenTx.getRecord(client);
        console.log("transactionId: "+createTokenRx.transactionId);
        return createTokenRx.transactionId;

} catch(error) {
        console.log("Error : "+ error)
    } 
}

// async function placeBid(data) {
//     try {
//         console.log("inside place bid: "+ JSON.stringify(data))
//         let response = await createClient();
//         let response1 = await createClient1();
//         if (response.err) {
//             console.log("response.err", response.err);
//             let outpuJSON = {
//                 message: "Client creation Failed",
//                 err: response.err
//             };
//             return outpuJSON;
//         }
//         client = response.client;
//         client1 = response1.client;
//         console.log("client called....")       
        
//         // Create NFT using precompile function
//         const ct = new ContractExecuteTransaction()
//         .setContractId(ContractId.fromString(data.contractId))
//         .setGas(3000000) // Increase if revert
//         .setTransactionId(TransactionId.generate(AccountId.fromString(process.env.BIDDER_ID)))
//         .setPayableAmount(data.price) // Increase if revert
//         .setFunction("placeBid",
//             new ContractFunctionParameters()
//             .addAddress(TokenId.fromString(data.tokenId).toSolidityAddress()) //token
//             .addInt64(data.serialNumber) // base price // base price
//             .addUint256(data.price*(10e7))
//             .addAddress(AccountId.fromString(data.auctioner).toSolidityAddress()))
//             .freezeWith(client)
            
//         let ct1 = await ct.sign(PrivateKey.fromString(process.env.MY_PRIVATE_KEY));
//         const  createToken = await ct1.sign(PrivateKey.fromString(process.env.BIDDER_KEY)); // auctioner
//         console.log("price : " + data.price*(10e7));
//         console.log("b4 execute");
//         const createTokenTx = await createToken.execute(client1);
//         console.log("b4 recrd");
//         const createTokenRx = await createTokenTx.getRecord(client1);
//         console.log("transactionId: "+createTokenRx.transactionId);
//         return createTokenRx.transactionId;
     
// } catch(error) {
//         console.log("Error : "+ error)
//     } 
// }

async function placeBid(data) {
    try {
        console.log("inside place bid: "+ JSON.stringify(data))
        let response = await createClient();
        let response1 = await createClient1();
        if (response.err) {
            console.log("response.err", response.err);
            let outpuJSON = {
                message: "Client creation Failed",
                err: response.err
            };
            return outpuJSON;
        }
        client = response.client;
        client1 = response1.client;
        console.log("client called....")       
        
        // Create NFT using precompile function
        const transaction = new ContractExecuteTransaction()
        .setContractId(ContractId.fromString(data.contractId))
        .setGas(3000000) // Increase if revert
        .setTransactionId(TransactionId.generate(AccountId.fromString(process.env.BIDDER_ID)))
        .setPayableAmount(data.price) // Increase if revert
        .setFunction("placeBid",
            new ContractFunctionParameters()
            .addAddress(TokenId.fromString(data.tokenId).toSolidityAddress()) //token
            .addInt64(data.serialNumber) // base price // base price
            .addUint256(data.price*(10e7))
            .addAddress(AccountId.fromString(data.auctioner).toSolidityAddress()))
          //  .setNodeAccountIds([new AccountId(3)])
            .freezeWith(client);
            // encode 1
            const transactionDTO1 = transaction.toBytes();
            const transactionDTO1Armoured =  Buffer.from(transactionDTO1).toString('base64');  
            // Decode 1
            const transactionRebuiltRaw1 = Buffer.from(transactionDTO1Armoured, 'base64');
            const transactionRebuilt1 = ContractExecuteTransaction.fromBytes(transactionRebuiltRaw1);        
           // const signedTransaction3 = await transactionRebuilt1.sign(PrivateKey.fromString(process.env.BIDDER_KEY))
        
            const txResponse = await transactionRebuilt1.execute(client1);        
            const receipt = await txResponse.getReceipt(client1);        
            console.log(`TX ${txResponse.transactionId.toString()} status: ${receipt.status}`);
             
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
        .setFunction("settleAuction",
            new ContractFunctionParameters()
            .addAddress(TokenId.fromString(data.tokenId).toSolidityAddress()) //token
            .addInt64(data.serialNumber)); // auctioner
            
        console.log("b4 execute");
        const createTokenTx = await createToken.execute(client);
        console.log("b4 recrd");
        const createTokenRx = await createTokenTx.getRecord(client);
        console.log("transactionId: "+createTokenRx.transactionId);    
        return createTokenRx.transactionId;
} catch(error) {
        console.log("Error : "+ error)
    } 
}

async function auctionClaim(data) {
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
        const ct = new ContractExecuteTransaction()
        .setContractId(ContractId.fromString(data.contractId))
        .setGas(3000000) // Increase if revert
        .setFunction("claimAuction",
            new ContractFunctionParameters()
            .addAddress(TokenId.fromString(data.tokenId).toSolidityAddress()) //token
            .addInt64(data.serialNumber) // base price
            .addAddress(AccountId.fromString(data.auctioner).toSolidityAddress()))
            .freezeWith(client); // auctioner
        const createToken = await ct.sign(PrivateKey.fromString(data.adminKey));
        console.log("b4 execute");
        const createTokenTx = await createToken.execute(client);
        console.log("b4 recrd");
        const createTokenRx = await createTokenTx.getRecord(client);
        console.log("transactionId: "+createTokenRx.transactionId);
        return createTokenRx.transactionId;
} catch(error) {
        console.log("Error : "+ error)
    } 
}

async function getTokenCustomFee(data) {
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
        // Contract call query
        
        const query = new ContractCallQuery()
            .setContractId(data.contractId)
            .setGas(300000)
            .setFunction("getTokenCustomFees", new ContractFunctionParameters()
                .addAddress(TokenId.fromString(data.tokenId).toSolidityAddress()))
                
        //Sign with the client operator private key to pay for the query and submit the query to a Hedera network
        const contractCallResult = await query.execute(client);
        console.log("contractCallResult: " + JSON.stringify(contractCallResult.bytes));
        console.log("contractCallResult: " + TokenId.fromBytes(contractCallResult.bytes));
      //  console.log("contractCallResult: " + parseInt(contractCallResult.bytes));

        const receipt = await contractCallResult.getReceipt(client);
        console.log("receipt: " + JSON.stringify(receipt));
        
        // Get the function value
        const message = contractCallResult.getString(0);
        console.log("contract message: " + message);
        
     
} catch(error) {
        console.log("Error : "+ error)
    } 
}

async function getAuctionDetails(data) {
    try {

        let response = await createClient();
        if (response.err) {
            console.log("response.err", response.err);

            let outpuJSON = {
                message: "Client creation failed",
                err: response.err
            };
            return outpuJSON;
        }
        client = response.client;

        console.log("contract id inside contract call : " + data.contractId);

        const functionAbi = contract.abi.find(func => (func.name === "bidWinner" && func.type === "function"));
        console.log("functionAbi : " + JSON.stringify(functionAbi))
        const encodedParametersHex = web3.eth.abi.encodeFunctionCall(functionAbi, []).slice(2);  
        // console.log("Encoded Input parametersData", Buffer.from(encodedParametersHex, 'hex'))
        const params =  Buffer.from(encodedParametersHex, 'hex');
        // console.log("params : "+ params)
        const query = 
         new ContractCallQuery()
            .setContractId(ContractId.fromString(data.contractId))
            .setGas(100000)
            .setFunctionParameters(params)
          
         const contractCallResult = await query.execute(client); 
         const tokenIdSolidityAddr = contractCallResult.contractFunctionResult.getAddress(0);       // Get the function value
          console.log("tokenIdSolidityAddr: "+ tokenIdSolidityAddr);
          const tokenId = AccountId.fromSolidityAddress(tokenIdSolidityAddr);
         console.log("Bid winner " +   tokenId);
         
        //  console.log("************************   PRICE AMT  **********************************")

        //  const functionAbi1 = contract.abi.find(func => (func.name === "claimed" && func.type === "function"));
        // console.log("functionAbi : " + JSON.stringify(functionAbi1))
        // const encodedParametersHex1 = web3.eth.abi.encodeFunctionCall(functionAbi1, []).slice(2);  
        // // console.log("Encoded Input parametersData", Buffer.from(encodedParametersHex, 'hex'))
        // const params1 =  Buffer.from(encodedParametersHex1, 'hex');
        // // console.log("params : "+ params)
        // const query1 = 
        //  new ContractCallQuery()
        //     .setContractId(ContractId.fromString(data.contractId))
        //     .setGas(100000)
        //     .setFunctionParameters(params1)
        //  const contractCallResult1 = await query1.execute(client); 
        //  // console.log("contract call result ",contractCallResult);       // Get the function value
        //  const message1 = contractCallResult1.bytes;
        //  console.log("contract message: " + JSON.stringify(message));
        //  console.log("contract message: " + message1.toString('hex'));
        //  let hexStr1 = message1.toString('hex');
        //  console.log("claimed: " + parseInt(hexStr1, 16));

        //  console.log("************************   MSG VALUE  **********************************")

        //  const functionAbi2 = contract.abi.find(func => (func.name === "priceAmt" && func.type === "function"));
        // console.log("functionAbi : " + JSON.stringify(functionAbi2))
        // const encodedParametersHex2 = web3.eth.abi.encodeFunctionCall(functionAbi2, []).slice(2);  
        // // console.log("Encoded Input parametersData", Buffer.from(encodedParametersHex, 'hex'))
        // const params2 =  Buffer.from(encodedParametersHex2, 'hex');
        // // console.log("params : "+ params)
        // const query2 = 
        //  new ContractCallQuery()
        //     .setContractId(ContractId.fromString(data.contractId))
        //     .setGas(100000)
        //     .setFunctionParameters(params2)
        //  const contractCallResult2 = await query2.execute(client); 
        //  // console.log("contract call result ",contractCallResult);       // Get the function value
        //  const message2 = contractCallResult1.bytes;
        //  console.log("contract message: " + JSON.stringify(message));
        //  console.log("contract message: " + message2.toString('hex'));
        //  let hexStr2 = message2.toString('hex');
        //  console.log("priceAmt: " + parseInt(hexStr2, 16));


    } catch (error) {
        let outpuJSON = {
            message: "Contract query Failed",
            err: error
        }
        return outpuJSON;
    }
}

module.exports = {
     deployContract, createAuctionDetails, placeBid, settleAuction, getTokenCustomFee, getAuctionDetails, auctionClaim
}