var express = require('express');
var appRoute = express.Router();
const { getAccountInfo, transferBalance } = require('../controllers/accountController.js');
const { createToken, mintToken, createCollection, contractTreasuryToken, tokenTransfer, associateToken, userNFTs, 
        scheduleTransaction, scheduleSignTransaction, associateTokenSign, transferTokenDiffUser,
        transferTokenSign, scheduleSignTransactionObj } = require('../controllers/tokenController.js');
const { deployAuctionContract, createAuction, placeBidAuction, settlementAuction, claimAuction, 
        getTokenCustomFee } = require('../controllers/auctionController.js');
const { deployTokenContract, createContractToken, mintContractToken, transferContractToken, 
        associateContractToken, getTokenURI } = require('../controllers/contractController.js');
const { createAccount} = require('../controllers/accountController.js');
const { body } = require('express-validator');

// ACCOUNT

appRoute.post("/getAccountInfo", getAccountInfo)

appRoute.post("/transferBalance", transferBalance)

// AUCTION ROUTES

appRoute.post("/deployAuctionContract", deployAuctionContract)

appRoute.post("/createAuction", createAuction)

appRoute.post("/placebid", placeBidAuction)

appRoute.post("/settleAuction", settlementAuction)

appRoute.post("/claimAuction", claimAuction)

appRoute.get("/getTokenCustomFee", getTokenCustomFee)

// GENERATIVE NFT

appRoute.get("/getTokenURI", getTokenURI)

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

appRoute.post( "/scheduleSignTransactionObj",[], scheduleSignTransactionObj)

appRoute.post( "/associateTokensForSign",[], associateTokenSign)

module.exports = appRoute;
