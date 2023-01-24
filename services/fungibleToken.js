const {
    TokenCreateTransaction,
    Client,
    TokenType,
    TransferTransaction,
    PrivateKey, AccountId, TokenId
} = require("@hashgraph/sdk");
const { json } = require("body-parser");

async function main() {

    // STEP 1 : Create Client
    const myAccountId = AccountId.fromString("0.0.48836695");
    const myPrivateKey = PrivateKey.fromString("3030020100300706052b8104000a04220420eb339abc3d432029d95a8f931508680b4a1e3ecb94ec94c5e0175e80ce5f6f4b");
    const client = Client.forTestnet();
    client.setOperator(myAccountId, myPrivateKey);

    const supplyKey = PrivateKey.fromString("3030020100300706052b8104000a04220420a5055df9ef8fd5078af992c6d44504e20ad7dc86a42125b85e5b835642eabaef"); 

    // // STEP 2: Prepare Token Ceation Transaction
    // const transaction = await new TokenCreateTransaction()
    //     .setTokenName("Accubits Fungible Token")
    //     .setTokenSymbol("AFT")
    //     .setTokenType(TokenType.FungibleCommon)
    //     .setTreasuryAccountId(myAccountId)
    //     .setInitialSupply(2000)
    //     .setAdminKey(myPrivateKey)
    //     .setSupplyKey(supplyKey)
    //     .freezeWith(client);

    // // STEP 3: Sign the transaction with the client, who is set as admin and treasury account
    // const signTx =  await transaction.sign(myPrivateKey);

    // // STEP 4: Submit to a Hedera network
    // const txResponse = await signTx.execute(client);

    // //STEP 5: Get the receipt of the transaction
    // const receipt = await txResponse.getReceipt(client);

    // //STEP 6: Get the token ID from the receipt
    // const tokenId = receipt.tokenId;
    // console.log("The new token ID is " + tokenId);

    // //STEP 8: Get the receipt status
    // console.log("Receipt Status:"+ receipt.status);

    //Create the transfer transaction
const transaction = await new TransferTransaction()
.addTokenTransfer(TokenId.fromString("0.0.49335429"), myAccountId, -600)
.addTokenTransfer(TokenId.fromString("0.0.49335429"), AccountId.fromString("0.0.49253827"), 600)
.freezeWith(client);

//Sign with the sender account private key
const signTx = await transaction.sign(myPrivateKey);

//Sign with the client operator private key and submit to a Hedera network
const txResponse = await signTx.execute(client);

//Request the receipt of the transaction
const receipt = await txResponse.getReceipt(client);

//Obtain the transaction consensus status
const transactionStatus = receipt.status;

console.log("The transaction consensus status " +transactionStatus.toString());

//v2.0.5

    process.exit();
}
main();