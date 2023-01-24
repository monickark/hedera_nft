const {
    TokenCreateTransaction,
    Client,
    TokenType,
    PrivateKey, AccountId
} = require("@hashgraph/sdk");
const { json } = require("body-parser");

async function main() {

    // STEP 1 : Create Client
    const myAccountId = AccountId.fromString("0.0.48836695");
    const myPrivateKey = PrivateKey.fromString("3030020100300706052b8104000a04220420eb339abc3d432029d95a8f931508680b4a1e3ecb94ec94c5e0175e80ce5f6f4b");
    const client = Client.forTestnet();
    client.setOperator(myAccountId, myPrivateKey);

    const supplyKey = PrivateKey.fromString("3030020100300706052b8104000a04220420a5055df9ef8fd5078af992c6d44504e20ad7dc86a42125b85e5b835642eabaef"); 

            
    let tokenTransfer = new TransferTransaction()            
    .addNftTransfer(AccountId.fromString("0.0.49270799"), data.serialId, data.senderId, data.receiverId)
    .addHbarTransfer(data.receiverId, Hbar.fromString("-" + data.price)) //Sending account
    // .addHbarTransfer(AccountId.fromString(tokenInfo._feeCollectorAccountId), customfee) //Royalty Receiving account
    // .addHbarTransfer(AccountId.fromString(data.senderId), Hbar.fromString(data.price)-customfee) //Royalty Receiving account
    .setNodeAccountIds([new AccountId(3)])
    .freezeWith(client);
    await tokenTransfer.sign(PrivateKey.fromString(data.senderKey));
            
    // console.log("b4 sign" + tokenTransfer)
    let tokenTransferTx = await tokenTransfer.sign(PrivateKey.fromString(data.receiverKey))
    // console.log("b4 sign" + JSON.stringify(tokenTransferTx))
    let tokenTransferSubmit = await tokenTransferTx.execute(client);
    console.log("b4 execute")
    let tokenTransferRx = await tokenTransferSubmit.getReceipt(client);

    console.log(`\n- NFT transfer from Sender to Receiver: ${tokenTransferRx.status} \n`);
    console.log(`\n- transaction id: ${tokenTransferSubmit.transactionId} \n`);

    // STEP 3: Sign the transaction with the client, who is set as admin and treasury account
    const signTx =  await transaction.sign(myPrivateKey);

    // STEP 4: Submit to a Hedera network
    const txResponse = await signTx.execute(client);

    //STEP 5: Get the receipt of the transaction
    const receipt = await txResponse.getReceipt(client);

    //STEP 6: Get the token ID from the receipt
    const tokenId = receipt.tokenId;
    console.log("The new token ID is " + tokenId);

    //STEP 8: Get the receipt status
    console.log("Receipt Status:"+ receipt.status);

    process.exit();
}
main();