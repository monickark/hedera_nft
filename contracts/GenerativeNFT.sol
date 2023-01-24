// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.6.0 <0.9.0;
 
import './HederaResponseCodes.sol';
import './IHederaTokenService.sol';
import './HederaTokenService.sol';
import './ExpiryHelper.sol';
contract GenerativeNFT is ExpiryHelper {
  using Strings for uint256;

  string baseURI;
  string public baseExtension = ".json";
  uint256 public cost = 50 ether;
  uint256 public maxSupply = 6666;
  uint256 public maxMintAmount = 66;
  uint256 public nftPerAddressLimit = 10;
  bool public paused = false;
  bool public revealed = false;
  bool public onlyWhitelisted = true;
  string public notRevealedUri;
  address[] public whitelistedAddresses; 

  constructor(
    string memory _name,
    string memory _symbol,
    string memory _initBaseURI,
    string memory _initNotRevealedUri
  ) ERC721(_name, _symbol) {
    setBaseURI(_initBaseURI);
    setNotRevealedURI(_initNotRevealedUri);
    mint(20); 
  }

  // internal
  function _baseURI() internal view virtual override returns (string memory) {
    return baseURI;
  }

  
   function createNonFungible(
           string memory name,
           string memory symbol,
           string memory memo,
           uint32 maxSupply,
           uint32 autoRenewPeriod
       ) external payable returns (address, IHederaTokenService.TokenKey[] memory){
 
       // Instantiate the list of keys we'll use for token create
        IHederaTokenService.TokenKey[] memory keys = new IHederaTokenService.TokenKey[](1);
        // use the helper methods in KeyHelper to create basic key
        keys[0] = createSingleKey(HederaTokenService.SUPPLY_KEY_TYPE, KeyHelper.CONTRACT_ID_KEY, address(this));

        IHederaTokenService.HederaToken memory token;
        token.name = name;
        token.symbol = symbol;
        token.memo = memo;
        token.treasury = address(this);
        token.tokenSupplyType = true; // set supply to FINITE
        token.tokenKeys = keys;
        token.maxSupply = maxSupply;
        token.freezeDefault = false;
        token.expiry = createAutoRenewExpiry(address(this), autoRenewPeriod); // Contract automatically renew by himself
 
       (int responseCode, address createdToken) = HederaTokenService.createNonFungibleToken(token);
 
       if(responseCode != HederaResponseCodes.SUCCESS){
           revert("Failed to create non-fungible token");
       }
       return (createdToken, keys);
   }

    function mintNonFungibleToken(
           address token,
           uint64 amount,
           bytes[] memory metadata
       ) public returns (int responseCode, uint64 newTotalSupply, int64[] memory serialNumbers)  {
        (responseCode, newTotalSupply, serialNumbers) = HederaTokenService.mintToken(token, amount, metadata);
       
        if (responseCode != HederaResponseCodes.SUCCESS) {
            revert();
        }
    }

  // public
  function mint(uint256 _mintAmount) public payable {
    require(!paused, "The contract is paused");
    uint256 supply = totalSupply();
    require(_mintAmount > 0, "Need to mint at least 1 NFT");
    require(_mintAmount <= maxMintAmount, "Max mint amount per session exceeded!");
    require(supply + _mintAmount <= maxSupply, "Max NFT limit exceeded!");

    if (msg.sender != owner()) {
        if(onlyWhitelisted == true) {
            require(isWhitelisted(msg.sender), "User is not whitelisted");
            uint256 ownerTokenCount = balanceOf(msg.sender);
            require(ownerTokenCount < nftPerAddressLimit, "Max NFT per address exceeded");
        }
        require(msg.value >= cost * _mintAmount, "Insufficient funds :(");
    }
    
    for (uint256 i = 1; i <= _mintAmount; i++) {
         _safeMint(msg.sender, supply + i);
    }
  }

  function isWhitelisted(address _user) public view returns (bool) {
    for (uint i = 0; i < whitelistedAddresses.length; i++) {
      if (whitelistedAddresses[i] == _user) {
          return true;
      }
    }
    return false;
  }

}
