const {
    ContractExecuteTransaction,
    ContractFunctionParameters,
    AccountId,
    TokenId,
    ContractId
} = require("@hashgraph/sdk");
const { createClient } = require('./client.js');
require("dotenv").config();
const Web3 = require("web3");

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
        
        // Create NFT using precompile function
        const createToken = new ContractExecuteTransaction()
        .setContractId(ContractId.fromString(data.contractId))
        .setGas(3000000) // Increase if revert
        .setPayableAmount(200) // Increase if revert
        .setFunction("associateToken",
            new ContractFunctionParameters()
            .addAddress(TokenId.fromString(data.token).toSolidityAddress()) //token
            .addAddress(AccountId.fromString(data.address).toSolidityAddress())); // NFT memo
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
module.exports = {
    createContractToken, mintToken, transferToken, associateToken
}