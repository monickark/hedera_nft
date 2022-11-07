const { createTokenDetails, mintNewToken, batchMintToken, transferTokens, associateTokens, userNFTs,
    scheduleTransaction, scheduleSignTransaction } = require("../services/tokenServices.js");
const { successResponse, errorResponse } = require('../utilities/response');

exports.createToken = async (req, res) => {
    try {        
        console.log("Create token started");
        console.log("Token body params: " + JSON.stringify(req.body));
        let response = await createTokenDetails(req.body);        
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

exports.mintToken = async (req, res) => {
    try {        
        console.log("Create mint token started");
        console.log("Token body params: " + JSON.stringify(req.body));
        let response = await mintNewToken(req.body);  
        console.log("RESPONSE address: "+ JSON.stringify(response));
        if (response.err) {
            console.log("Error", response.err);
            let errorJSON = {
                message: "Token Creation Failed"
            }
            return errorResponse(res, errorJSON, 500);
        }
        let outputJSON = {
            "message": "Token Minted",  
            "tokenId": response.tokenId,
            "serialId": response.serialId
        }
        return successResponse(res, outputJSON);

    } catch (error) {
        console.log("Error", error)
        let outpuJSON = {
            message: "Failed to mint new token",
            err: error
        };
        return errorResponse(res, outpuJSON, 500);
    }
}

exports.createCollection = async (req, res) => {
    try {        
        console.log("Create mint token started");
        console.log("Token body params: " + JSON.stringify(req.body));
        let response = await batchMintToken(req.body);  
        console.log("serialId length: "+ JSON.stringify(response.serialId.length));
        let serialsIds = [];
        for(let i=0; i<response.serialId.length; i++ ) {
            // console.log("Serial id: "+ response.serialId[i].serials[0].low);
            serialsIds.push(response.serialId[i].serials[0].low);
        }
        if (response.err) {
            console.log("Error", response.err);
            let errorJSON = {
                message: "Token Creation Failed"
            }
            return errorResponse(res, errorJSON, 500);
        }
        let outputJSON = {
            "message": "Token Minted",  
            "tokenId": response.tokenId,
            "serialId": serialsIds
        }
        console.log("Tokens Minted")
        return successResponse(res, outputJSON);

    } catch (error) {
        console.log("Error", error)
        let outpuJSON = {
            message: "Failed to mint new token",
            err: error
        };
        return errorResponse(res, outpuJSON, 500);
    }
}

exports.tokenTransfer = async (req, res) => {
    try {        
        console.log("Create transfer token started");
        console.log("Token body params: " + JSON.stringify(req.body));
        let response = await transferTokens(req.body);  
        console.log("RESPONSE address: "+ response);
        if (response.err) {
            console.log("Error", response.err);
            let errorJSON = {
                message: "Token Creation Failed"
            }
            return errorResponse(res, errorJSON, 500);
        }
        let outputJSON = {
            "message": "Token transfer",  
            "tokenId": response.tokenId
        }
        return successResponse(res, outputJSON);

    } catch (error) {
        console.log("Error", error)
        let outpuJSON = {
            message: "Failed to transfer token",
            err: error
        };
        return errorResponse(res, outpuJSON, 500);
    }
}

exports.associateToken = async (req, res) => {
    try {        
        console.log("Create associate token started");
        console.log("Token body params: " + JSON.stringify(req.body));
        let response = await associateTokens(req.body);  
        console.log("RESPONSE address: "+ response);
        if (response.err) {
            console.log("Error in controller: ", response.err);
            let errorJSON = {
                "message": response.message,
                "tokenId": response.tokenId,
                "associatedId":response.associatedAcc

            }
            return errorResponse(res, errorJSON, 500);
        }
        let outputJSON = {
            "message": "Association Granted",  
            "tokenId": response.tokenId,
            "associatedId":response.associatedAcc
        }
        return successResponse(res, outputJSON);

    } catch (error) {
        console.log("Error", error)
    }
}

exports.userNFTs = async (req, res) => {
    try {        
        console.log("retrieve nfts hold by nft started");
        console.log("Token query params: " + JSON.stringify(req.query));
        let response = await userNFTs(req.query);  
        console.log("RESPONSE address: "+ JSON.stringify(response.tokens));
        if (response.err) {
            console.log("Error", response.err);
            let errorJSON = {
                message: "Token Creation Failed"
            }
            return errorResponse(res, errorJSON, 500);
        }
        let outputJSON = {
            "message": "Retrieved Tokens",  
            "tokens": response.tokens
        }
        return successResponse(res, outputJSON);

    } catch (error) {
        console.log("Error", error)
        let outpuJSON = {
            message: "Failed to transfer token",
            err: error
        };
        return errorResponse(res, outpuJSON, 500);
    }
}

exports.scheduleTransaction = async (req, res) => {
    try {        
        console.log("Create associate token started");
        console.log("Token body params: " + JSON.stringify(req.body));
        let response = await scheduleTransaction(req.body);  
        if (response.err) {
            console.log("Error in controller: ", response.err);
            let errorJSON = {
                "message": response.message
            }
            return errorResponse(res, errorJSON, 500);
        }
        let outputJSON = {
            "message": "Transaction Scheduled",  
            "scheduleId":response.scheduleId1
        }
        return successResponse(res, outputJSON);

    } catch (error) {
        console.log("Error", error)
    }
}

exports.scheduleSignTransaction = async (req, res) => {
    try {        
        console.log("schedule Sign Transaction started");
        console.log("Token body params: " + JSON.stringify(req.body));
        let response = await scheduleSignTransaction(req.body);  
        if (response.err) {
            console.log("Error in controller: ", response.err);
            let errorJSON = {
                "message": response.message
            }
            return errorResponse(res, errorJSON, 500);
        }
        let outputJSON = {
            "message": "Transaction Scheduled",  
            "scheduleId":response.scheduleId1,
            "status":response.txStatus
        }
        return successResponse(res, outputJSON);

    } catch (error) {
        console.log("Error", error)
    }
}