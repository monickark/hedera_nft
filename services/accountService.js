
const {
    Hbar,
    PrivateKey,
    AccountCreateTransaction,
    AccountBalanceQuery
} = require("@hashgraph/sdk");
const { createClient } = require('./client.js');
const Web3 = require("web3");
const axios = require("axios");
let client;
let ContractId;
const web3 = new Web3;

exports.createHederaAccount= async (req, res) => {
    try {
        let response = await createClient();
       // console.log("created client: "+ JSON.stringify(response));
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
            .setInitialBalance(Hbar.fromTinybars(12000000000))
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