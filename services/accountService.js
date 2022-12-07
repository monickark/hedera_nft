
const {
    Hbar,
    PrivateKey,
    AccountCreateTransaction,
    AccountBalanceQuery,
    TopicCreateTransaction
} = require("@hashgraph/sdk");
const { createClient } = require('./client.js');
const Web3 = require("web3");
const axios = require("axios");
let client;
let ContractId;
const web3 = new Web3;

exports.createHederaAccount = async (data) => {
    try {
        let response = await createClient();
        console.log("created client: "+ JSON.stringify(data));
        if (response.err) {
            console.log("response.err", response.err);
            let outpuJSON = {
                message: "Client creation Failed",
                err: response.err
            };
            return outpuJSON;
        }
        client = response.client;

        const newAccountPrivateKey = await PrivateKey.generateECDSA();
        const newAccountPublicKey = newAccountPrivateKey.publicKey;
        console.log("newAccountPrivateKey = " + newAccountPrivateKey);
        console.log("newAccountPublicKey = " + newAccountPublicKey);
        const newAccount = await new AccountCreateTransaction()
            .setKey(newAccountPublicKey)
            .setInitialBalance(Hbar.fromTinybars(data.initBal))
            .execute(client);
        const getReceipt = await newAccount.getReceipt(client);
        const newAccountId = await getReceipt.accountId;
        console.log("The solidity address from the account ID", newAccountId.toSolidityAddress());
        const accountBalance = await new AccountBalanceQuery()
            .setAccountId(newAccountId)
            .execute(client);

        console.log("The new account balance is: " + accountBalance.hbars + " hbar.");

        let outpuJSON = {
            accountId: newAccountId.toString(),
            pubKey: newAccountPublicKey.toString(),
            privKey: newAccountPrivateKey.toString()

        }
        return outpuJSON;
    } catch (error) {
        let outpuJSON = {
            message: "Hedera Account Creation failed",
            err: error
        }
        return outpuJSON;

    }
}

exports.getAccountInfo = async (data) => {
    try {
        let response = await createClient();
        console.log("created client: "+ JSON.stringify(data));
        if (response.err) {
            console.log("response.err", response.err);
            let outpuJSON = {
                message: "Client creation Failed",
                err: response.err
            };
            return outpuJSON;
        }
        client = response.client;

         // Create the query
        const query = new AccountBalanceQuery()
        .setAccountId(data.accountId);

        // Sign with the client operator account private key and submit to a Hedera network
        const accountBalance = await query.execute(client);

        if (accountBalance) {
            console.log(`The account balance for account ${data.accountId} is ${accountBalance.hbars} HBar`);
        }

        let outpuJSON = {
            accountId: data.accountId.toString(),
            balance: accountBalance.hbars.toString()
        }
        return outpuJSON;
    } catch (error) {
        let outpuJSON = {
            message: "Retrieve balance failed",
            err: error
        }
        return outpuJSON;

    }
}

exports.transferBalance = async (data) => {
    try {
        let response = await createClient();
        console.log("created client: "+ JSON.stringify(data));
        if (response.err) {
            console.log("response.err", response.err);
            let outpuJSON = {
                message: "Client creation Failed",
                err: response.err
            };
            return outpuJSON;
        }
        client = response.client;

    // Create the transfer transaction
    const transaction = new TransferTransaction()
    .addHbarTransfer(myAccountId, new Hbar(-data.amount))
    .addHbarTransfer(otherAccountId, new Hbar(data.amount));
    
    console.log(`Doing transfer from ${sender} to ${receiver}`);
    
    // Sign with the client operator key and submit the transaction to a Hedera network
    const txId = await transaction.execute(client);

    // console.log(JSON.stringify(txId));

    // Request the receipt of the transaction
    const receipt = await txId.getReceipt(client);

    // console.log(JSON.stringify(receipt));

    // Get the transaction consensus status
    const transactionStatus = receipt.status;

    console.log("The transaction consensus status is " + transactionStatus);

    // Create the queries
    const queryMine = new AccountBalanceQuery().setAccountId(data.sender);
    const queryOther = new AccountBalanceQuery().setAccountId(data.receiver);

    const senderBalance = await queryMine.execute(client);
    const receiverBalance = await queryOther.execute(client);

    console.log(`My account balance ${senderBalance.hbars} HBar, other account balance ${receiverBalance.hbars}`);
    let outpuJSON = {
        sender: data.sender.toString(),
        receiver: data.receiver.toString(),
        senderBalance: senderBalance.toString(),
        receiverBalance : receiverBalance.toString()
    }
    return outpuJSON;
    } catch (error) {
        let outpuJSON = {
            message: "Transfer Balance Failed",
            err: error
        }
        return outpuJSON;

    }
}