const {
    TokenCreateTransaction,
    ScheduleCreateTransaction,
    TransferTransaction,
    TokenAssociateTransaction,
    TokenMintTransaction,
    ScheduleSignTransaction,
    TokenId,
    AccountId,
    TokenType,
    TokenSupplyType,
    CustomRoyaltyFee,
    CustomFixedFee,
    PrivateKey,
    PublicKey,
    TokenInfoQuery,
    AccountBalanceQuery,
    TokenBalanceQuery,
    Hbar
} = require("@hashgraph/sdk");
const axios = require('axios');
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
        console.log("inside transfer NFT Tokens...")
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
        // Sign with the sender key to authorize the transfer        
        let tokenTransferTx = await new TransferTransaction()
            .addNftTransfer(data.tokenId, data.serialId, data.senderId, data.receiverId)
            // .addHbarTransfer(data.senderId, 1)
            // .addHbarTransfer(data.receiverId, 1)
            .freezeWith(client)
            //.sign(data.senderKey);
            
        console.log("b4 sign" + tokenTransferTx)
        console.log("b4 sign" + JSON.stringify(tokenTransferTx))
        // let tokenTransferTxSign = await tokenTransferTx.sign(data.receiverKey);
        // console.log("b4 execute")
        let tokenTransferSubmit = await tokenTransferTx.execute(client);
        console.log("b4 execute")
        let tokenTransferRx = await tokenTransferSubmit.getReceipt(client);

        console.log(`\n- NFT transfer from Sender to Receiver: ${tokenTransferRx.status} \n`);
   
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

async function scheduleTransaction(data) {
    try {
        console.log("inside schedule Transaction...")
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
        console.log("client called....");

        const transactionToSchedule = new TransferTransaction()
        .addHbarTransfer(data.senderId, Hbar.fromTinybars(-1))
        .addHbarTransfer(data.receiverId, Hbar.fromTinybars(1));
        
        //Create a schedule transaction
        const transaction = new ScheduleCreateTransaction()
        .setScheduledTransaction(transactionToSchedule);
    
        //Sign with the client operator key and submit the transaction to a Hedera network
        const txResponse = await transaction.execute(client);
    
        //Request the receipt of the transaction
        const receipt = await txResponse.getReceipt(client);
    
        //Get the schedule ID
        const scheduleId = receipt.scheduleId;
        console.log("The schedule ID of the schedule transaction is " +scheduleId);
        return outpuJSON = {
            scheduleId1: scheduleId
        };
     
} catch(error) {
        console.log("Error : "+ error)
    } 
}

async function scheduleSignTransaction(data) {
    try {
        console.log("inside schedule sign Transaction...")
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
        console.log("client called....");

        const transaction = await new ScheduleSignTransaction()
        .setScheduleId(data.scheduleId)
        .freezeWith(client)
        .sign(PrivateKey.fromString(data.senderKey));

        console.log("b4 execute : ");
        //Sign with the client operator key to pay for the transaction and submit to a Hedera network
        const txResponse = await transaction.execute(client);
        
        console.log("b4 receipt : ");
        //Get the receipt of the transaction
        const receipt = await txResponse.getReceipt(client);
        
        //Get the transaction status
        const transactionStatus = receipt.status;
        console.log("The transaction consensus status is " +transactionStatus);

        return outpuJSON = {
            scheduleId1: data.scheduleId,
            txStatus : transactionStatus
        };
     
} catch(error) {
        console.log("Error : "+ error)
    } 
}

async function userNFTs(data) {
    
    let tokenArr = []
    try {
        console.log("inside user nft....")
        console.log("account: "+ data.account)
        let url = 'https://testnet.mirrornode.hedera.com/api/v1/accounts/'+data.account+'/nfts';
        
        console.log("url: "+ url);

        await axios.get(url).then(resp => {            
           // console.log("resp  data : "+ JSON.stringify(resp.data.nfts));
            let nfts = resp.data.nfts;
            console.log("Size: "+ resp.data.nfts.length);
        
            for (var token of nfts) {
                tokenArr.push(token.token_id +":"+ token.serial_number)
            }
        });               
        console.log("return tokens: "+ JSON.stringify(tokenArr))
        return outpuJSON = {
            tokens: tokenArr
        };
     
} catch(error) {
        console.log("Error : "+ error)
    } 
}

module.exports = {
    createTokenDetails, mintNewToken, batchMintToken, transferTokens, associateTokens, userNFTs,
    scheduleTransaction, scheduleSignTransaction
}