const {
    Client, PrivateKey
} = require("@hashgraph/sdk");
require("dotenv").config();

async function createClient() {
    let client;
    try {
        //Grab your Hedera testnet account ID and private key from your .env file
        console.log("Inside create client.....");
        const myAccountId = process.env.MY_ACCOUNT_ID;
        const myPrivateKey = process.env.MY_PRIVATE_KEY;
        // console.log("myAccountId: "+ myAccountId);
        // console.log("myPrivateKey: "+ myPrivateKey);
        // If we weren't able to grab it, we should throw a new error
        if (myAccountId == null ||
            myPrivateKey == null ) {
            throw new Error("Environment variables myAccountId and myPrivateKey must be present");
        }    
        // create your local machine
        client = Client.forTestnet();
        
        // set the txion fee paying account
        // console.log('...........set the txion fee paying account..........')
        // console.log("myAccountId  myPrivateKey"+ myAccountId, myPrivateKey);
        client.setOperator(myAccountId, myPrivateKey);
    
            let outputJson = {
                client: client
            };
        //console.log("client return json: "+ JSON.stringify(outputJson));
        return outputJson;

    } catch (error) {
        //console.log("err3", error);
        let outpuJSON = {
            message: "client creation Error",
            err: error
        };
        return outpuJSON;
    }

}
module.exports = {
    createClient
}
