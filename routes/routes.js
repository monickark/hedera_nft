var express = require('express');
var appRoute = express.Router();
const { createToken, mintToken, createCollection, tokenTransfer, associateToken, userNFTs, scheduleTransaction, scheduleSignTransaction } = require('../controllers/tokenController.js');
const { deployAuctionContract, createAuction, placeBidAuction, settlementAuction, retrieveAuction } = require('../controllers/auctionController.js');
const { deployTokenContract, createContractToken, mintContractToken, transferContractToken, associateContractToken } = require('../controllers/contractController.js');
const { createAccount} = require('../controllers/accountController.js');
const { body } = require('express-validator');

// AUCTION ROUTES

appRoute.post("/deployAuctionContract", deployAuctionContract)

appRoute.post("/createAuction", createAuction)

appRoute.post("/placebid", placeBidAuction)

appRoute.post("/settleAuction", settlementAuction)

appRoute.get("/retrieveAuction", retrieveAuction)

// TOKEN THROGH CONTRACT

appRoute.post("/deployContract", deployTokenContract)

appRoute.post("/createAccount",createAccount)

appRoute.post(
    "/createToken",[],
    createToken
)

appRoute.post(
    "/createContractToken",[],
    createContractToken
)

appRoute.post(
    "/mintContractToken",[],
    mintContractToken
)

appRoute.post(
    "/transferContractToken",[],
    transferContractToken
)

appRoute.post(
    "/associateContractToken",[],
    associateContractToken
)

appRoute.post(
    "/mintToken",[],
    mintToken
)

appRoute.post(
    "/createCollection",[],
    createCollection
)

appRoute.post(
    "/tokenTransfer",[],
    tokenTransfer
)

appRoute.post(
    "/associateToken",[],
    associateToken
)

appRoute.get(
    "/retrieveUserNfts",
    userNFTs
)

appRoute.post(
    "/scheduleTransaction",[],
    scheduleTransaction
)

appRoute.post(
    "/scheduleSignTransaction",[],
    scheduleSignTransaction
)

module.exports = appRoute;
