# HEDERA NFT PROJECT
npm start
solcjs --bin contracts/AuctionContract.sol -o binaries 
solcjs --bin contracts/TokenContract.sol -o binaries

## API
1. {{host}}/createAccount

Output:
{
    "success": true,
    "data": {
        "message": "Account is created Successfully",
        "AccountID": "0.0.48644194",
        "AccountPubKey": "302d300706052b8104000a032200035f33a04c7f8ffccd6d2b7e29f321ca0b8b01b57eb7f80a4ef1606c3f993d0c98",
        "AccountPrivKey": "3030020100300706052b8104000a04220420e270b3165733defa50e217dd02e25aea263ad4548e923f8c12a4ec9a382575f9"
    }
}

2. {{host}}/createToken
Body Params:
{
    "tokenName":"Hedera NFT",
    "tokenSymbol":"HNFT",
    "treasuryId":"0.0.48636209",
    "treasuryKey":"3030020100300706052b8104000a04220420e9bf9cc78f6df35b2226fbb41ad928d0540a19058c047c56f205ce4bc6a67b08",
    "decimals":"0",
    "initialSupply":"0",
    "maxSupply":"500000000000",
    "supplyKey":"3030020100300706052b8104000a042204203b28b7b961201b3aab7a2f274b49b0c4f5b5b58bc79a37c9715855b84b0bd2e7"
}

OUTPUT:
{
    "success": true,
    "data": {
        "message": "Token Created",
        "tokenId": "0.0.48644196"
    }
}