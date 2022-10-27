const { deployContract, } = require("../services/auctionServices.js");
const { successResponse, errorResponse } = require('../utilities/response');
let dgbaseURL = "https://testnet.dragonglass.me/transactions/";
let hederabaseURL = `https://Namescan.io/#/${process.env.HEDERA_NETWORK}/transaction/`;
let mirrorNodeApi = `https://${process.env.HEDERA_NETWORK}.mirrornode.hedera.com/api/v1/transactions/`

exports.auctionDeployContract = async (req, res) => {
    try {
        let response = await deployContract();

        if (response.err) {
            console.log("Error", response.err);
            let outputJson = {
                message: response.message
            }
            return errorResponse(res, outputJson, 500);
        }
        let outputJson = {
            "message": "The Contract is successfully deployed",
            "ContractId": response.ContractId
        }
        return successResponse(res, outputJson);
    } catch (error) {
        console.log("Error", error);
        let outpuJSON = {
            message: "Contract Deployment Failed",
            err: error
        };
        return errorResponse(res, outpuJSON, 500);
    }
}
