const { deployContract, createAuctionDetails, placeBid, settleAuction, auctionClaim, getTokenCustomFee} = require("../services/auctionServices.js");
const { successResponse, errorResponse } = require('../utilities/response');


exports.deployAuctionContract = async (req, res) => {
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

exports.createAuction = async (req, res) => {
    try {        
        console.log("Create auction started");
        console.log("Token body params: " + JSON.stringify(req.body));
        let response = await createAuctionDetails(req.body);        
        console.log("RESPONSE address: "+ response);
        if (response.err) {
            console.log("Error", response.err);
            let errorJSON = {
                message: "Token Creation Failed"
            }
            return errorResponse(res, errorJSON, 500);
        }
        let outputJSON = {
            "message": "New Action Created",
            "tokenId": response
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

exports.placeBidAuction = async (req, res) => {
    try {        
        console.log("Create place Bid started");
        console.log("Token body params: " + JSON.stringify(req.body));
        let response = await placeBid(req.body);        
        console.log("RESPONSE "+ response);
        if (response.err) {
            console.log("Error", response.err);
            let errorJSON = {
                message: "Auction Bid Failed"
            }
            return errorResponse(res, errorJSON, 500);
        }
        let outputJSON = {
            "message": "Bid placed",
            "txionId": response
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

exports.settlementAuction = async (req, res) => {
    try {        
        console.log("Settle Auction started");
        console.log("Token body params: " + JSON.stringify(req.body));
        let response = await settleAuction(req.body);        
        console.log("RESPONSE address: "+ response);
        if (response.err) {
            console.log("Error", response.err);
            let errorJSON = {
                message: "Auction Settled Failed"
            }
            return errorResponse(res, errorJSON, 500);
        }
        let outputJSON = {
            "message": "Auction Settled",
            "tokenId": response
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

exports.claimAuction = async (req, res) => {
    try {        
        console.log("Auction token claim started");
        console.log("Token body params: " + JSON.stringify(req.body));
        let response = await auctionClaim(req.body);        
        console.log("RESPONSE address: "+ response);
        if (response.err) {
            console.log("Error", response.err);
            let errorJSON = {
                message: "Auction Settled Failed"
            }
            return errorResponse(res, errorJSON, 500);
        }
        let outputJSON = {
            "message": "Auction Settled",
            "tokenId": response
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

exports.getTokenCustomFee = async (req, res) => {
    try {        
        console.log("Create place Bid started");
        console.log("Token body params: " + req.query);
        let response = await getTokenCustomFee(req.query);        
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