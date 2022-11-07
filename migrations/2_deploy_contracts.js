 const Deploycontract = artifacts.require('KeyHelper');
  require('dotenv').config()
  
  module.exports = async function (deployer) {
    await deployer.deploy(Deploycontract);
    const contract = await Deploycontract.deployed();
    console.log("contract deployed at : "+ contract.address);
    
  }; 