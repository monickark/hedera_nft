var express = require('express');
var appRoute = express.Router();
const { createToken, mintToken, createCollection, contractTreasuryToken, tokenTransfer, associateToken, userNFTs, 
        scheduleTransaction, scheduleSignTransaction, associateTokenSign, transferTokenDiffUser,
        transferTokenSign } = require('../controllers/tokenController.js');
const { deployAuctionContract, createAuction, placeBidAuction, settlementAuction, claimAuction, retrieveAuction } = require('../controllers/auctionController.js');
const { deployTokenContract, createContractToken, mintContractToken, transferContractToken, associateContractToken } = require('../controllers/contractController.js');
const { createAccount} = require('../controllers/accountController.js');
const { body } = require('express-validator');

// AUCTION ROUTES

appRoute.post("/deployAuctionContract", deployAuctionContract)

appRoute.post("/createAuction", createAuction)

appRoute.post("/placebid", placeBidAuction)

appRoute.post("/settleAuction", settlementAuction)

appRoute.post("/claimAuction", claimAuction)

appRoute.get("/retrieveAuction", retrieveAuction)

// TOKEN THROGH CONTRACT

appRoute.post("/deployContract", deployTokenContract)

appRoute.post("/contractTreasuryToken", contractTreasuryToken)

appRoute.post("/createAccount",createAccount)

appRoute.post("/createToken",[], createToken)

appRoute.post("/createContractToken",[],  createContractToken)

appRoute.post("/mintContractToken",[], mintContractToken)

appRoute.post( "/transferContractToken",[], transferContractToken)

appRoute.post( "/associateContractToken",[], associateContractToken)

appRoute.post( "/transferTokenDiffUser",[], transferTokenDiffUser)

appRoute.post( "/transferTokenSign",[], transferTokenSign)

appRoute.post("/mintToken",[], mintToken)

appRoute.post( "/createCollection",[], createCollection)

appRoute.post( "/tokenTransfer",[], tokenTransfer)

appRoute.post( "/associateToken",[], associateToken)

appRoute.get( "/retrieveUserNfts", userNFTs)

appRoute.post( "/scheduleTransaction",[], scheduleTransaction)

appRoute.post( "/scheduleSignTransaction",[], scheduleSignTransaction)

appRoute.post( "/associateTokensForSign",[], associateTokenSign)

module.exports = appRoute;
