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
    Hbar,
    ContractId,
    ContractUpdateTransaction,
    KeyList
} = require("@hashgraph/sdk");
require("dotenv").config();

const axios = require('axios');
const { createClient, createClient1 } = require('./client.js');
const Web3 = require("web3");
const { Contract } = require("ethers");
const myAccountId = process.env.MY_ACCOUNT_ID;
const adminKey = process.env.MY_PRIVATE_KEY;

async function getCustomFees(numerator, denominator, royaltyId, isExempt, fallbackFee) {
    try{
    console.log("inside custom fee: "+ numerator, denominator, royaltyId);
    let nftCustomFee = new CustomRoyaltyFee()
        .setNumerator(numerator)
        .setDenominator(denominator)
        .setFeeCollectorAccountId(AccountId.fromString(royaltyId))
        .setAllCollectorsAreExempt(isExempt) // whether royalty id have to pay royalty or not
        .setFallbackFee(new CustomFixedFee().setHbarAmount(new Hbar(fallbackFee)));
        
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
            .setTreasuryAccountId(data.treasuryId)
            .setSupplyType(TokenSupplyType.Finite)
            .setMaxSupply(data.maxSupply)
            .setCustomFees([await getCustomFees(data.numerator, data.denominator, data.royaltyId, true, data.fallbackFee)])
            .setMaxTransactionFee(new Hbar(50))
            .setAdminKey(PrivateKey.fromString(data.treasuryKey))
            .setSupplyKey(PrivateKey.fromString(data.supplyKey))
            .freezeWith(client)

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

async function treasuryToken(data) {
    try {
        console.log("inside createTokenDetails..." + data.contractId)
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
        const nftCreate = new TokenCreateTransaction()
            .setTokenName("TEST1")
            .setTokenSymbol("TST1")
            .setTreasuryAccountId(data.contractId)
            .setTokenType(TokenType.NonFungibleUnique)
            .setAutoRenewAccountId(data.contractId)
            .setAutoRenewPeriod(7000000)
            .setMaxSupply(500000000000)
            .setSupplyType(TokenSupplyType.Finite)
            .setSupplyKey(PrivateKey.fromString(adminKey))
            .setMaxTransactionFee(new Hbar(30))
            .freezeWith(client);

        console.log("b4 sign");
        let nftCreateTxSign = await nftCreate.sign(PrivateKey.fromString(adminKey));
        console.log("b4 execute");
        let nftCreateSubmit = await nftCreateTxSign.execute(client1);
        console.log("b4 receipt");
        console.log("nftCreateSubmit:"+JSON.stringify(nftCreateSubmit));
        let nftCreateRx = await nftCreateSubmit.getReceipt(client);
        console.log("nftCreateRx:"+JSON.stringify(nftCreateRx));
        let tokenId = nftCreateRx.tokenId;
        console.log(`Created NFT with Token ID: ${tokenId} \n`);

//         const contractUpdate = await new ContractUpdateTransaction()
//             .setContractId(data.contractId)
//             .setAdminKey(new KeyList())
//             .execute(client);
//         const contractUpdateRx = await contractUpdate.getReceipt(client);
 
// console.log("Contract update status: " + contractUpdateRx.status.toString());
        
        return tokenId;
     
} catch(error) {
        console.log("Error : "+ error)
    } 
}

async function accountCreator(privateKey, initialBalance, client) {
    const response = await new AccountCreateTransaction()
        .setInitialBalance(new Hbar(initialBalance))
        .setKey(privateKey.publicKey)
        .execute(client);
    const receipt = await response.getReceipt(client);
    return receipt.accountId;
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
        console.log("mintrx: "+ JSON.stringify(mintRx));
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
        console.log("inside batch mint token...")
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

async function transferTokensWithSign(data) {
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
        let transaction = await new TransferTransaction()
            .addNftTransfer(data.tokenId, data.serialId, data.senderId, data.receiverId)            
            .setNodeAccountIds([new AccountId(3)])
            .freezeWith(client);
            await transaction.sign(PrivateKey.fromString("e563e25da29c40acedb7a7f6fe3ddfb502d33feb4cfae7aa7b4564b8ec834b4f"));
    
            // encode 1
            const transactionDTO1 = transaction.toBytes();
            const transactionDTO1Armoured =  Buffer.from(transactionDTO1).toString('base64');
    
            console.log(`Encoded1: ${transactionDTO1Armoured}`);
            
            return outpuJSON = {
                tokenId: data.tokenId,
                retObj: data.transactionDTO1Armoured
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
        let tokenTransfer = await new TransferTransaction()
            .addNftTransfer(data.tokenId, data.serialId, data.senderId, data.receiverId)
            .freezeWith(client)
            .sign(PrivateKey.fromString(data.senderKey));
            
       // console.log("b4 sign" + tokenTransfer)
          let tokenTransferTx = await tokenTransfer.sign(PrivateKey.fromString(data.receiverKey))
       // console.log("b4 sign" + JSON.stringify(tokenTransferTx))
        let tokenTransferSubmit = await tokenTransferTx.execute(client);
        console.log("b4 execute")
        let tokenTransferRx = await tokenTransferSubmit.getReceipt(client);

        console.log(`\n- NFT transfer from Sender to Receiver: ${tokenTransferRx.status} \n`);
        console.log(`\n- transaction id: ${tokenTransferSubmit.transactionId} \n`);
        
   
        return outpuJSON = {
            tokenId: data.tokenId,
            serialId: data.serialId,
            txionId: tokenTransferSubmit.transactionId.toString()
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

async function transferTokensWithDiff(data) {
    try {
        console.log("inside transfer NFT Tokens...")
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
        console.log("client called...");
        // Sign with the sender key to authorize the transfer        
        let tokenTransferTx = await new TransferTransaction()
            .addNftTransfer(data.tokenId, data.serialId, data.senderId, data.receiverId)
            .freezeWith(client)
         //   .sign(PrivateKey.fromString(data.senderKey));
            
        console.log("b4 sign" + tokenTransferTx)
       // console.log("b4 sign" + JSON.stringify(tokenTransferTx))
        let tokenTransferSubmit = await tokenTransferTx.execute(client);
        console.log("b4 execute")
        let tokenTransferRx = await tokenTransferSubmit.getReceipt(client);

        console.log(`\n- NFT transfer from Sender to Receiver: ${tokenTransferRx.status} \n`);
   
        return outpuJSON = {
            tokenId: data.tokenId,
            serialId: data.serialId
        };
     
    } catch(error) {
            console.log("Error : "+ error)
        } 
}

async function associateTokensForSign(data) {
    try {
        console.log("inside associateTokensForSign...")
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
        //Create the associate transaction and sign with Receiver's key 
        let transaction = new TokenAssociateTransaction()
        .setAccountId(data.associatedId)
        .setTokenIds([data.tokenId])
        .setNodeAccountIds([new AccountId(3)])
        .freezeWith(client);

        await transaction.sign(PrivateKey.fromString("e563e25da29c40acedb7a7f6fe3ddfb502d33feb4cfae7aa7b4564b8ec834b4f"));

        // encode 1
        const transactionDTO1 = transaction.toBytes();
        const transactionDTO1Armoured =  Buffer.from(transactionDTO1).toString('base64');

        console.log(`Encoded1: ${transactionDTO1Armoured}`);
        
        return outpuJSON = {
            tokenId: data.tokenId,
            retObj: data.transactionDTO1Armoured
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
        .addHbarTransfer(data.senderId, Hbar.fromTinybars(-2))
        .addHbarTransfer(data.receiverId, Hbar.fromTinybars(2));
        
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
            scheduleId1: scheduleId.toString()
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

async function scheduleSignTransactionObj(data) {
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
        .freezeWith(client);

        // encode 1
        const transactionDTO1 = transaction.toBytes();
        const transactionDTO1Armoured =  Buffer.from(transactionDTO1).toString('base64');

        console.log(`Encoded1: ${transactionDTO1Armoured}`);

     
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
    scheduleTransaction, scheduleSignTransaction, treasuryToken, associateTokensForSign, transferTokensWithDiff,
    transferTokensWithSign, scheduleSignTransactionObj
}