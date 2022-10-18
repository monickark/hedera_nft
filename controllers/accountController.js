const { createHederaAccount } = require("../services/accountService.js");
const { successResponse, errorResponse } = require('../utilities/response');
exports.createAccount = async (req, res) => {
    try {
        console.log("inside create account");
        let response = await createHederaAccount();
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