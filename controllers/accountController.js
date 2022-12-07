const { createHederaAccount, getAccountInfo, transferBalance } = require("../services/accountService.js");
const { successResponse, errorResponse } = require('../utilities/response');

exports.createAccount = async (req, res) => {
    try {
        console.log("inside create account");
        let response = await createHederaAccount(req.body);
        if (response.err) {
            console.log("Create Account Error:", response.err)
            let outpuJSON = {
                message: response.message
            }
            return errorResponse(res, outpuJSON, 500);
        }
        let outputJson = {
            "message": "Account is created Successfully",
            "AccountID": response.accountId,
            "AccountPubKey": response.pubKey,
            "AccountPrivKey": response.privKey
        }
        return successResponse(res, outputJson);
    } catch (error) {
        let outpuJSON = {
            message: "Account creation Failed",
            err: error
        };
        return errorResponse(res, outpuJSON, 500);
    }
}

exports.getAccountInfo = async (req, res) => {
    try {
        console.log("inside create account");
        let response = await getAccountInfo(req.body);
        if (response.err) {
            console.log("Cant retrieve balance:", response.err)
            let outpuJSON = {
                message: response.message
            }
            return errorResponse(res, outpuJSON, 500);
        }
        let outputJson = {
            "message": "Account balance fetched",
            "AccountID": response.accountId,
            "balance": response.balance
        }
        return successResponse(res, outputJson);
    } catch (error) {
        let outpuJSON = {
            message: "Account creation Failed",
            err: error
        };
        return errorResponse(res, outpuJSON, 500);
    }
}

exports.transferBalance = async (req, res) => {
    try {
        console.log("inside create account");
        let response = await transferBalance(req.body);
        if (response.err) {
            console.log("Cant retrieve balance:", response.err)
            let outpuJSON = {
                message: response.message
            }
            return errorResponse(res, outpuJSON, 500);
        }
        
        let outputJson = {
            "message": "Balance transfered",
            "sender": response.sender,
            "receiver": response.receiver,
            "senderBalance":response.senderBalance,
            "receiverBalance":response.receiverBalance
        }
        return successResponse(res, outputJson);
    } catch (error) {
        let outpuJSON = {
            message: "Account creation Failed",
            err: error
        };
        return errorResponse(res, outpuJSON, 500);
    }
}