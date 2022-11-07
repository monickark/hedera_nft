 const AuctionContract = artifacts.require('AuctionContract');
  require('dotenv').config()
  
  module.exports = async function (deployer) {
    await deployer.deploy(AuctionContract);
    const contract = await AuctionContract.deployed();
    console.log("contract deployed at : "+ contract.address);
    
  }; 