
const {
    TokenCreateTransaction,
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
        //  .setTokenType(TokenType.NonFungibleUnique)
        //  .setDecimals(0)
        //  .setInitialSupply(0)
            .setTreasuryAccountId(AccountId.fromString(data.treasuryId))
        //  .setSupplyType(TokenSupplyType.Finite)
        //  .setMaxSupply(CID.length)
        // .setCustomFees([nftCustomFee])
        .setAdminKey(PrivateKey.fromString(data.treasuryKey).publicKey)
        // .setSupplyKey(supplyKey)
        // .setPauseKey(pauseKey)
        // .setFreezeKey(freezeKey)
        // .setWipeKey(wipeKey)
         .freezeWith(client)
        // .sign(treasuryKey);

        let nftCreateTxSign = await nftCreate.sign(PrivateKey.fromString(data.treasuryKey));
        let nftCreateSubmit = await nftCreateTxSign.execute(client);
        let nftCreateRx = await nftCreateSubmit.getReceipt(client);
        let tokenId = nftCreateRx.tokenId;
        console.log(`Created NFT with Token ID: ${tokenId} \n`);
        return tokenId;
     
} catch(error) {
        console.log("Error : "+ error)
    } 
}

module.exports = {
    createTokenDetails
}