var express = require('express');
var appRoute = express.Router();
const { createToken, mintToken } = require('../controllers/tokenController.js');
const { createAccount} = require('../controllers/accountController.js');
const { body } = require('express-validator');

appRoute.post("/createAccount",createAccount)

appRoute.post(
    "/createToken",[],
    createToken
)

appRoute.post(
    "/mintToken",[],
    mintToken
)

module.exports = appRoute;
