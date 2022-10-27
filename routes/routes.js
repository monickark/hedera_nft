var express = require('express');
var appRoute = express.Router();
const { createToken, mintToken, createCollection, tokenTransfer, associateToken } = require('../controllers/tokenController.js');
const { auctionDeployContract } = require('../controllers/auctionController.js');
const { createContractToken, mintContractToken, transferContractToken, associateContractToken } = require('../controllers/contractController.js');
const { createAccount} = require('../controllers/accountController.js');
const { body } = require('express-validator');

appRoute.post("/deployContract", auctionDeployContract)

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

module.exports = appRoute;
