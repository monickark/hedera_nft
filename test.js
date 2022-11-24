import {
    Client,
    TransferTransaction,
    AccountId,
    Hbar,
    PrivateKey,
    PublicKey,
} from "@hashgraph/sdk";
import dotenv from 'dotenv'

import path, { dirname } from 'path'
import { fileURLToPath } from 'url'


const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, '../../.env') })

async function main() {
    if (process.env.OPERATOR_ID == null || process.env.OPERATOR_KEY == null) {
        throw new Error(
            "Environment variables OPERATOR_ID, and OPERATOR_KEY are required - these are taken from the file 'task-i0-accounts.txt' created in task-i0"
        );
    }

    const account1Id = process.env.OPERATOR_ID;
    const account1Key = PrivateKey.fromString(process.env.OPERATOR_KEY);

    if (process.env.WALLET1 == null || process.env.PKEY1 == null) {
        throw new Error(
            "Environment variables WALLET1, and PKEY1 are required - these are taken from the file 'task-i0-accounts.txt' created in task-i0"
        );
    }

    const account2Id = process.env.WALLET1;
 
    const account2Key = PrivateKey.fromString(process.env.PKEY1);
    const account2PubKey = account2Key.publicKey;

    if (process.env.WALLET4 == null || process.env.PKEY4 == null) {
        throw new Error(
            "Environment variables WALLET4, and PKEY4 are required - these are taken from the file 'task-i0-accounts.txt' created in task-i0"
        );
    }

    const account4Key = PrivateKey.fromString(process.env.PKEY4);
    const account4PubKey =account4Key.publicKey;


    if (process.env.WALLET3 == null || process.env.PKEY3 == null) {
        throw new Error(
            "Environment variables WALLET3, and PKEY3 are required - these are taken from the file 'task-i0-accounts.txt' created in task-i0"
        );
    }

    const account5Key = PrivateKey.fromString(process.env.PKEY3);
    const account5PubKey = account5Key.publicKey;


    const client = Client.forTestnet();
    client.setOperator(account1Id, account1Key);

    const nodeId = [];
    nodeId.push(new AccountId(3));

    const transferTransaction = new TransferTransaction()
        .addHbarTransfer(account1Id, new Hbar(-10))
        .addHbarTransfer(account2Id, new Hbar(10))
        .setNodeAccountIds(nodeId);

    const transaction = await transferTransaction.freezeWith(client);

    // encode 1
    const transactionDTO1 = transaction.toBytes();
    const transactionDTO1Armoured =  Buffer.from(transactionDTO1).toString('base64');

    console.log(`Encoded1: ${transactionDTO1Armoured}`);

    // Decode 1
    const transactionRebuiltRaw1 = Buffer.from(transactionDTO1Armoured, 'base64');
    const transactionRebuilt1 = TransferTransaction.fromBytes(transactionRebuiltRaw1);

    const signedTransaction1 = transactionRebuilt1
        .addSignature(account2PubKey, account2Key.signTransaction(transaction));

    // encode 2
    const transactionDTO2 = signedTransaction1.toBytes();
    const transactionDTO2Armoured =  Buffer.from(transactionDTO2).toString('base64');

    console.log(`Encoded2: ${transactionDTO2Armoured}`);

    // Decode 2
    const transactionRebuiltRaw2 = Buffer.from(transactionDTO2Armoured, 'base64');
    const transactionRebuilt2 = TransferTransaction.fromBytes(transactionRebuiltRaw2);

    const signedTransaction2 = transactionRebuilt2
        .addSignature(account4PubKey, account4Key.signTransaction(transaction));

    // encode 3
    const transactionDTO3 = signedTransaction2.toBytes();
    const transactionDTO3Armoured =  Buffer.from(transactionDTO3).toString('base64');

    console.log(`Encoded3: ${transactionDTO3Armoured}`);

    // Decode 3
    const transactionRebuiltRaw3 = Buffer.from(transactionDTO3Armoured, 'base64');
    const transactionRebuilt3 = TransferTransaction.fromBytes(transactionRebuiltRaw3);

    const signedTransaction3 = transactionRebuilt3
        .addSignature(account5PubKey, account5Key.signTransaction(transaction));

    const txResponse = await signedTransaction3.execute(client);

    const receipt = await txResponse.getReceipt(client);

    console.log(`TX ${txResponse.transactionId.toString()} status: ${receipt.status}`);

    process.exit();
}

void main();