const { deployContract, createContractToken, mintToken, transferToken, associateToken } = require("../services/contractService.js");
const { successResponse, errorResponse } = require('../utilities/response');
let dgbaseURL = "https://testnet.dragonglass.me/transactions/";
let hederabaseURL = `https://Namescan.io/#/${process.env.HEDERA_NETWORK}/transaction/`;
let mirrorNodeApi = `https://${process.env.HEDERA_NETWORK}.mirrornode.hedera.com/api/v1/transactions/`

exports.deployTokenContract = async (req, res) => {
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
            "contractId": response.contractId
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

exports.createContractToken = async (req, res) => {
    try {        
        console.log("Create token started");
        console.log("Token body params: " + JSON.stringify(req.body));
        let response = await createContractToken(req.body);        
        console.log("RESPONSE address: "+ response);
        console.log("RESPONSE address: "+ JSON.stringify(response));
        if (response.err) {
            console.log("Error", response.err);
            let errorJSON = {
                message: "Token Creation Failed"
            }
            return errorResponse(res, errorJSON, 500);
        }
        let outputJSON = {
            "message": "Token Created",
            "tokenId": response.shard.low+"."+response.realm.low+"."+response.num.low
        }
        return successResponse(res, outputJSON);



    } catch (error) {
        console.log("Error", error)
        let outpuJSON = {
            message: "Failed to create token",
            err: error
        };
        return errorResponse(res, outpuJSON, 500);
    }

}

exports.mintContractToken = async (req, res) => {
    try {        
        console.log("Create mintContractToken started");
        console.log("Token body params: " + JSON.stringify(req.body));
        let response = await mintToken(req.body);        
        console.log("RESPONSE address: "+ response);
        console.log("RESPONSE address: "+ JSON.stringify(response));
        if (response.err) {
            console.log("Error", response.err);
            let errorJSON = {
                message: "Token Creation Failed"
            }
            return errorResponse(res, errorJSON, 500);
        }
        let outputJSON = {
            "message": "Token Created",
            "tokenId": response.shard.low+"."+response.realm.low+"."+response.num.low
        }
        return successResponse(res, outputJSON);



    } catch (error) {
        console.log("Error", error)
        let outpuJSON = {
            message: "Failed to create token",
            err: error
        };
        return errorResponse(res, outpuJSON, 500);
    }

}

exports.associateContractToken = async (req, res) => {
    try {        
        console.log("Create associateToken started");
        console.log("Token body params: " + JSON.stringify(req.body));
        let response = await associateToken(req.body);        
        console.log("RESPONSE address: "+ response);
        console.log("RESPONSE address: "+ JSON.stringify(response));
        if (response.err) {
            console.log("Error", response.err);
            let errorJSON = {
                message: "Token Creation Failed"
            }
            return errorResponse(res, errorJSON, 500);
        }
        let outputJSON = {
            "message": "Token Created",
            "tokenId": response.shard.low+"."+response.realm.low+"."+response.num.low
        }
        return successResponse(res, outputJSON);



    } catch (error) {
        console.log("Error", error)
        let outpuJSON = {
            message: "Failed to create token",
            err: error
        };
        return errorResponse(res, outpuJSON, 500);
    }

}

exports.transferContractToken = async (req, res) => {
    try {        
        console.log("Create transferContractToken started");
        console.log("Token body params: " + JSON.stringify(req.body));
        let response = await transferToken(req.body);        
        console.log("RESPONSE address: "+ response);
        console.log("RESPONSE address: "+ JSON.stringify(response));
        if (response.err) {
            console.log("Error", response.err);
            let errorJSON = {
                message: "Token Creation Failed"
            }
            return errorResponse(res, errorJSON, 500);
        }
        let outputJSON = {
            "message": "Token Created",
            "tokenId": response.shard.low+"."+response.realm.low+"."+response.num.low
        }
        return successResponse(res, outputJSON);



    } catch (error) {
        console.log("Error", error)
        let outpuJSON = {
            message: "Failed to create token",
            err: error
        };
        return errorResponse(res, outpuJSON, 500);
    }

}
