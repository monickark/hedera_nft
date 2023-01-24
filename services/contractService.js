const {
    ContractCreateFlow,
    ContractExecuteTransaction,
    ContractFunctionParameters,
    PrivateKey,
    AccountId,
    TokenId,
    ContractId,
    ContractCallQuery
} = require("@hashgraph/sdk");
const { createClient } = require('./client.js');
const Web3 = require("web3");
const fs = require("fs");
const bytecode = fs.readFileSync(
    "./binaries/contracts_TokenContract_sol_TokenCreator.bin"
  );
// const bytecode = fs.readFileSync(
//     "./binaries/contracts_Crypt_O_Monsters_sol_Crypt_O_Monsters.bin"
//   );
require("dotenv").config();
let client;
let contractId;

// async function deployContract() {
//     try {
//         let response = await createClient();
//         if (response.err) {
//             console.log("response.err", response.err);
//             let outpuJSON = {
//                 message: "Client creation Failed",
//                 err: response.err
//             };
//             return outpuJSON;
//         }
//         client = response.client;

//         const myAccountId = process.env.MY_ACCOUNT_ID;
//         const privateKey = process.env.MY_PRIVATE_KEY;
//         let private_key = PrivateKey.fromString(privateKey);
//         let publicKey = private_key.publicKey;
//         console.log("privatekey: "+ privateKey)
//         console.log("publickey: "+ publicKey)
//         const contractCreate = new ContractCreateFlow()
//             .setGas(10000000)
//             .setAdminKey(publicKey)
//             .setContractMemo("AUCTION")
//             .setAutoRenewAccountId(myAccountId)
//             .setAutoRenewPeriod(8000001)// 92 days  
//             .setBytecode(bytecode)
//             .setConstructorParameters(
//                 new ContractFunctionParameters()
//                 .addString("Contract NFT")
//                 .addString("CNFT")
//                 .addString("https://ipfs.io/ipfs/Qmdgu9afuL6SgCRzsJ4P8fKKDxEzMf7ZNtgLT9gwkQi5V2/")
//                 .addString("https://ipfs.io/ipfs/Qme7ss3ARVgxv6rXqVPiikMJ8u2NLgmgszg13pYrDKEoiu/")
//              );
        
//         console.log("contract create flow.....");
//         const txResponse = await contractCreate.execute(client);
//         const receipt = await txResponse.getReceipt(client);
//         contractId = (receipt.contractId).toString();
//         console.log("The new contract ID is ", contractId);
//         let outputJSON = { contractId: contractId };
//         return outputJSON;
//     }
//     catch (error) {
//         let outpuJSON = {
//             message: "Contract Deployment Failed",
//             err: error
//         }
//         return outpuJSON;
//     }

// }

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

async function createContractToken(data) {
    try {
        console.log("inside createTokenDetails: "+ JSON.stringify(data))
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
        .setFunction("createNonFungible",
            new ContractFunctionParameters()
            .addString("Fall Collection") //NFT name
            .addString("LEAF") // NFT symbol
            .addString("Just a memo") // NFT memo
            .addUint32(250) // NFT max supply
            .addUint32(7000000)); // auto renew period
        console.log("b4 execute");
        const createTokenTx = await createToken.execute(client);
        console.log("b4 recrd");
        const createTokenRx = await createTokenTx.getRecord(client);
        //console.log("createTokenRx: "+JSON.stringify(createTokenRx));
        const tokenIdSolidityAddr = createTokenRx.contractFunctionResult.getAddress(0);
        console.log("tokenIdSolidityAddr: "+ tokenIdSolidityAddr);
        const tokenId = AccountId.fromSolidityAddress(tokenIdSolidityAddr);

        const key = createTokenRx.contractFunctionResult.getAddress(1);
        console.log("key: "+ JSON.stringify(key));

        console.log(`Token created with ID: ${tokenId} \n`);
        return tokenId;
     
} catch(error) {
        console.log("Error : "+ error)
    } 
}
async function mintToken(data) {
    try {
        console.log("inside createTokenDetails: "+ JSON.stringify(data))
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
        .setGas(1500000) // Increase if revert
        .setFunction("mint",
            new ContractFunctionParameters()
            .addUint256(1)); //token //NFT name
        console.log("b4 execute");
        const createTokenTx = await createToken.execute(client);
      //  console.log("b4 recrd");
     //   const createTokenRx = await createTokenTx.getRecord(client);
       console.log("transactionId: "+JSON.stringify(createTokenTx.transactionId));
       console.log("transactionId: "+createTokenTx.transactionId);
       
    //    return tokenId;
     
} catch(error) {
        console.log("Error : "+ error)
    } 
}

async function mintNFT(data) {
    try {
        console.log("inside createTokenDetails: "+ JSON.stringify(data))
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
        console.log("token id in solidity adderss : " + TokenId.fromString(data.token).toSolidityAddress());    
        
        // Create NFT using precompile function
        const createToken = new ContractExecuteTransaction()
        .setContractId(ContractId.fromString(data.contractId))
        .setGas(1500000) // Increase if revert
        .setFunction("mintNonFungibleToken",
            new ContractFunctionParameters()
            .addAddress(TokenId.fromString(data.token).toSolidityAddress()) //token //NFT name
            .addUint64(data.amount) // NFT symbol
            .addBytesArray(data.metadata)); // NFT memo
        console.log("b4 execute");
        const createTokenTx = await createToken.execute(client);
        console.log("b4 recrd");
        const createTokenRx = await createTokenTx.getRecord(client);
        console.log("createTokenRx: "+JSON.stringify(createTokenRx));
       
        return tokenId;
     
} catch(error) {
        console.log("Error : "+ error)
    } 
}

async function transferToken(data) {
    try {
        console.log("inside transferToken contract: "+ JSON.stringify(data))
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
        .setFunction("transferNonFungibleToken",
            new ContractFunctionParameters()
            .addAddress(TokenId.fromString(data.token).toSolidityAddress()) //token
            .addAddress(AccountId.fromString(data.sender).toSolidityAddress()) // sender
            .addAddress(AccountId.fromString(data.receiver).toSolidityAddress()) // sender
            .addInt64(data.serialNumber)); // NFT memo
        console.log("b4 execute");
        const createTokenTx = await createToken.execute(client);
        console.log("b4 recrd");
        const createTokenRx = await createTokenTx.getRecord(client);
        console.log("createTokenRx: "+JSON.stringify(createTokenRx));
       
        return "success";
     
} catch(error) {
        console.log("Error : "+ error)
    } 
}

async function associateToken(data) {
    try {
        console.log("inside associateToken contract: "+ JSON.stringify(data))
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
        console.log("accountid: " + AccountId.fromString(data.address).toSolidityAddress());
        console.log("tokenid: " + TokenId.fromString(data.token).toSolidityAddress());
        // Create NFT using precompile function
        const createToken = new ContractExecuteTransaction()
        .setContractId(ContractId.fromString(data.contractId))
        .setGas(15000000) // Increase if revert
        .setFunction("associateNonFungibleToken",
            new ContractFunctionParameters()//token
            .addAddress(AccountId.fromString(data.address).toSolidityAddress())
            .addAddress(TokenId.fromString(data.token).toSolidityAddress())); // NFT memo
        console.log("b4 execute");
        const createTokenTx = await createToken.execute(client);
        console.log("b4 recrd");
        const createTokenRx = await createTokenTx.getRecord(client);
        console.log("createTokenRx: "+JSON.stringify(createTokenRx));
       
        return "success";
     
} catch(error) {
        console.log("Error : "+ error)
    } 
}

async function getTokenURI(data) {
    try {
        console.log("Retrieving Token URI: "+ JSON.stringify(data))
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
        
        const query = new ContractCallQuery().setContractId(data.contractId)
        .setGas(300000).setFunction("totalSupply");   
        let contractCallResult = await query.execute(client);
        console.log("Total Supply: " + contractCallResult.getUint256(0));

        const query1 = new ContractCallQuery() .setContractId(data.contractId)
        .setGas(300000) .setFunction("tokenURI", new ContractFunctionParameters().addUint256(data.tokenId));
        let contractCallResult1 = await query1.execute(client);
        console.log("Token URI: " + JSON.stringify(contractCallResult1.getString(0)));
        
     
} catch(error) {
        console.log("Error : "+ error)
    } 
}

module.exports = {
    deployContract, createContractToken, mintToken, transferToken, associateToken, getTokenURI
}