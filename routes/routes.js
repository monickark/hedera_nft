var express = require('express');
var appRoute = express.Router();
const { createToken} = require('../controllers/tokenController.js');
const { createAccount} = require('../controllers/accountController.js');
const { body } = require('express-validator');

appRoute.post("/createAccount",createAccount)

appRoute.post(
    "/createToken",[],
    createToken
)

module.exports = appRoute;
