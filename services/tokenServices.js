const {
    TokenCreateTransaction,
    TokenId,
    TokenMintTransaction,
    AccountId,
    TokenType,
    TokenSupplyType,
    CustomRoyaltyFee,
    CustomFixedFee,
    PrivateKey,
    PublicKey,
    TokenInfoQuery,
    TokenAssociateTransaction,
    AccountBalanceQuery,
    TransferTransaction,
    Hbar
} = require("@hashgraph/sdk");
const { createClient } = require('./client.js');
require("dotenv").config();
const Web3 = require("web3");

async function getCustomFees(numerator, denominator, treasuryId) {
    try{
    console.log("inside custom fee: "+ numerator, denominator, treasuryId);
    let nftCustomFee = await new CustomRoyaltyFee()
        .setNumerator(numerator)
        .setDenominator(denominator)
        .setFeeCollectorAccountId(AccountId.fromString(treasuryId))
        .setFallbackFee(new CustomFixedFee().setHbarAmount(new Hbar(1)));
        console.log("Custom fee: "+ JSON.stringify(nftCustomFee));
        return nftCustomFee;
    } catch(err){
        console.log("Error in custom fee: "+ err)
    }
}

async function createTokenDetails(data) {
    try {
        console.log("inside createTokenDetails..." + JSON.stringify(data))
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
               
        // CREATE NFT WITH CUSTOM FEE
        let nftCreate = await new TokenCreateTransaction()
            .setTokenName(data.tokenName)
            .setTokenSymbol(data.tokenSymbol)
            .setTokenType(TokenType.NonFungibleUnique)
            .setDecimals(data.decimals)
            .setInitialSupply(data.initialSupply)
            .setTreasuryAccountId(AccountId.fromString(data.treasuryId))
        //    .setTreasuryAccountId(data.treasuryId)
            .setSupplyType(TokenSupplyType.Finite)
            .setMaxSupply(data.maxSupply)
            .setCustomFees([await getCustomFees(data.numerator, data.denominator, data.treasuryId)])
            .setAdminKey(PrivateKey.fromString(data.treasuryKey))
            .setSupplyKey(PrivateKey.fromString(data.supplyKey))
        //  .setPauseKey(pauseKey)
        //  .setFreezeKey(freezeKey)
        //  .setWipeKey(wipeKey)
            .freezeWith(client)
        // .sign(treasuryKey);

        console.log("b4 sign");
        let nftCreateTxSign = await nftCreate.sign(PrivateKey.fromString(data.treasuryKey));
        console.log("b4 execute");
        let nftCreateSubmit = await nftCreateTxSign.execute(client);
        console.log("b4 receipt");
        console.log("nftCreateSubmit:"+JSON.stringify(nftCreateSubmit));
        let nftCreateRx = await nftCreateSubmit.getReceipt(client);
        console.log("nftCreateRx:"+JSON.stringify(nftCreateRx));
        let tokenId = nftCreateRx.tokenId;
        console.log(`Created NFT with Token ID: ${tokenId} \n`);
        return tokenId;
     
} catch(error) {
        console.log("Error : "+ error)
    } 
}

async function mintNewToken(data) {
    try {
        console.log("inside mintNewToken...")
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
        
        // Mint new NFT
        let mintTx = await new TokenMintTransaction()
        .setTokenId(TokenId.fromString(data.tokenId))		
        .setMetadata([Buffer.from(data.metadata)])		
        .freezeWith(client);

        console.log("before sign");
        //Sign the transaction with the supply key
        let mintTxSign = await mintTx.sign(PrivateKey.fromString(data.supplyKey));

        console.log("before execute");
        //Submit the transaction to a Hedera network
        let mintTxSubmit = await mintTxSign.execute(client);

        console.log("before receipt");
        //Get the transaction receipt
        let mintRx = await mintTxSubmit.getReceipt(client);

        //Log the serial number
        console.log(`- Created NFT ${data.tokenId} with serial: ${mintRx.serials[0].low} \n`);
        return outpuJSON = {
            tokenId: data.tokenId,
            serialId: mintRx.serials[0].low
        };
     
} catch(error) {
        console.log("Error : "+ error)
    } 
}

async function batchMintToken(data) {
    try {
        console.log("inside mintNewToken...")
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
      
        nftLeaf = [];
        for (var i = 0; i < data.metadata.length; i++) {
            nftLeaf[i] = await tokenMinterFcn(data.metadata[i], data.tokenId, client, data.supplyKey);
            console.log(`Created NFT ${data.tokenId} with serial: ${nftLeaf[i].serials[0].low}`);
        }
        
        return outpuJSON = {
            tokenId: data.tokenId,
            serialId: nftLeaf
        };
     
} catch(error) {
        console.log("Error : "+ error)
    } 
}

async function transferTokens(data) {
    try {
        console.log("inside transferTokens...")
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
        console.log("client called...");

        // Check the balance before the transfer for the treasury account
        var balanceCheckTx = await new AccountBalanceQuery().setAccountId(AccountId.fromString(data.treasuryId)).execute(client);
        console.log(`- Treasury balance: ${balanceCheckTx.tokens._map.get(data.tokenId.toString())} NFTs of ID ${data.tokenId}`);

        // Check the balance before the transfer for Receiver's account
        var balanceCheckTx = await new AccountBalanceQuery().setAccountId(AccountId.fromString(data.receiverId)).execute(client);
        console.log(`- Receiver's balance: ${balanceCheckTx.tokens._map.get(data.tokenId.toString())} NFTs of ID ${data.tokenId}`);

       //*******************************  TRANSFER TOKEN **************************************//
        // Transfer the NFT from treasury to Receiver
        // Sign with the treasury key to authorize the transfer
        let tokenTransferTx = await new TransferTransaction()
            .addNftTransfer(data.tokenId, data.serialId, data.treasuryId, data.receiverId)
            .freezeWith(client)
            .sign(PrivateKey.fromString(data.treasuryKey));

        let tokenTransferSubmit = await tokenTransferTx.execute(client);
        let tokenTransferRx = await tokenTransferSubmit.getReceipt(client);

        console.log(`\n- NFT transfer from Treasury to Receiver: ${tokenTransferRx.status} \n`);

        // Check the balance of the treasury account after the transfer
        var balanceCheckTx = await new AccountBalanceQuery().setAccountId(data.treasuryId).execute(client);
        console.log("Balance Transaction of Treasury Account:",balanceCheckTx.tokens.toString());

        console.log(`- Treasury balance: ${balanceCheckTx.tokens._map.get(data.tokenId.toString())} NFTs of ID ${data.tokenId}`);

        // Check the balance of Receiver's account after the transfer
        var balanceCheckTx = await new AccountBalanceQuery().setAccountId(data.receiverId).execute(client);
        console.log("Balance Transaction of Receiver Account:",balanceCheckTx.tokens.toString());
        console.log(`- Receiver's balance: ${balanceCheckTx.tokens._map.get(data.tokenId.toString())} NFTs of ID ${data.tokenId}`);     
        
        return outpuJSON = {
            tokenId: data.tokenId
        };
     
    } catch(error) {
            console.log("Error : "+ error)
        } 
    }

async function associateTokens(data) {
    try {
        console.log("inside transferTokens...")
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
        console.log("client called...");
       //*******************************  ASSOCIATION **************************************//
        //Create the associate transaction and sign with Receiver's key 
        let associateReceiverTx = await new TokenAssociateTransaction()
        .setAccountId(data.associatedId)
        .setTokenIds([data.tokenId])
        .freezeWith(client)
        .sign(PrivateKey.fromString(data.associatedKey));

        //Submit the transaction to a Hedera network
        let associateReceiverTxSubmit = await associateReceiverTx.execute(client);

        //Get the transaction receipt
        let associateReceiverRx = await associateReceiverTxSubmit.getReceipt(client);

        //Confirm the transaction was successful
        console.log(`- NFT association with Associate's account: ${associateReceiverRx.status}\n`);
        
        return outpuJSON = {
            tokenId: data.tokenId,
            associatedAcc: data.associatedId
        };
     
} catch(error) {
        console.log("Error : "+ error)
        let outpuJSON = {
            message: "Token association already granted",
            err: error
        };
        return outpuJSON;
    } 
}

async function tokenMinterFcn(metadata, tokenId, client, supplyKey) {
    mintTx = await new TokenMintTransaction()
        .setTokenId(tokenId)
        .setMetadata([Buffer.from(metadata)])
        .freezeWith(client);
    let mintTxSign = await mintTx.sign(PrivateKey.fromString(supplyKey));
    let mintTxSubmit = await mintTxSign.execute(client);
    let mintRx = await mintTxSubmit.getReceipt(client);
    return mintRx;
}

module.exports = {
    createTokenDetails, mintNewToken, batchMintToken, transferTokens, associateTokens
}