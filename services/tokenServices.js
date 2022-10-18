
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
    Hbar
} = require("@hashgraph/sdk");
const { createClient } = require('./client.js');
require("dotenv").config();
const Web3 = require("web3");

async function createTokenDetails(data) {
    try {
        console.log("inside createTokenDetails...")
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
            .setSupplyType(TokenSupplyType.Finite)
            .setMaxSupply(data.maxSupply)
        //  .setCustomFees([nftCustomFee])
            .setAdminKey(PrivateKey.fromString(data.treasuryKey).publicKey)
            .setSupplyKey(PrivateKey.fromString(data.supplyKey).publicKey)
        //  .setPauseKey(pauseKey)
        //  .setFreezeKey(freezeKey)
        //  .setWipeKey(wipeKey)
            .freezeWith(client)
        // .sign(treasuryKey);

        let nftCreateTxSign = await nftCreate.sign(PrivateKey.fromString(data.treasuryKey));
        let nftCreateSubmit = await nftCreateTxSign.execute(client);
        let nftCreateRx = await nftCreateSubmit.getReceipt(client);
       // console.log("nftCreateRx:"+JSON.stringify(nftCreateRx));
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
      //  console.log("client called....")
        
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

module.exports = {
    createTokenDetails, mintNewToken
}