// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.6.0 <0.9.0;
 
import './HederaResponseCodes.sol';
import './IHederaTokenService.sol';
import './HederaTokenService.sol';
import './ExpiryHelper.sol';
 
contract AuctionContract is ExpiryHelper{

  /**
   * @notice NFT metadata along with bid details
  */
  struct Auction {
    address tokenId;
    int64 serialNumber;
    uint256 basePrice;
    address auctioner;
    address currentBidder;
    uint256 bidAmount;
    bool readyToClaim;
    bool claimed;
  }  

   bool public readyToClaim;
   bool public claimed;
   mapping(address => mapping(int64 => mapping(address => Auction))) public mapAuction;
    /**
   * @notice createAuction
   * Function to start auction with first bid.
   * Validate signatures, stores NFT data and add first bid as well
   */
 
   function createAuction(address tokenId, int64 serialNumber, uint256 basePrice) external payable {    
    require(basePrice > 0, 'Create Auction : Zero base price.');
    Auction storage NftOnAuction = mapAuction[tokenId][serialNumber][msg.sender];
    NftOnAuction.auctioner = msg.sender;
    NftOnAuction.bidAmount = basePrice;
    NftOnAuction.basePrice = basePrice;
  }

  /**
   * @notice placeBid
   * Function to place the bid on the nfts using native cryptocurrency and multiple erc20 token
   * @param _tokenId NFT unique ID
   * @param _price bid price   
   * @param _auctioner Seller address
   */
  function placeBid(
    address _tokenId,
    int64 _serialNumber,
    uint256 _price,
    address _auctioner
  ) public payable {

    Auction storage NftOnAuction = mapAuction [_tokenId][_serialNumber][_auctioner];  
    require(_price >= NftOnAuction.basePrice, 'Place Bid : Price Less Than the base price');
    require(_price > NftOnAuction.bidAmount, 'Place Bid : The price is less then the previous bid amount');
    require(msg.value == _price, 'Place Bid: Amount received and price should be same');
    // require(msg.value > NftOnAuction.bidAmount, 'Place Bid: Amount received should be grather than the current bid');
    if (NftOnAuction.currentBidder != address(0)) {
      payable(NftOnAuction.currentBidder).transfer(NftOnAuction.bidAmount);
    }
    NftOnAuction.bidAmount = _price;
    NftOnAuction.currentBidder = msg.sender;
  }

  function settleAuction(
    address _tokenId,
    int64 _serialNumber,
    address _auctioner
  ) public {
    Auction storage NftOnAuction = mapAuction[_tokenId][_serialNumber][_auctioner];
    require(msg.sender == NftOnAuction.auctioner, 'Settle Auction : Restricted to auctioner or admin!');
    NftOnAuction.readyToClaim = true;
    readyToClaim = true;
  }

  function claimAuction(
    address _tokenId,
    int64 _serialNumber,
    address _auctioner
  ) public {
    Auction storage NftOnAuction = mapAuction[_tokenId][_serialNumber][_auctioner];
    require(NftOnAuction.readyToClaim == true, 'Claim Auction : Auction not settled yet!');
    require(NftOnAuction.claimed == false, 'Claim Auction : Token already claimed!');
    require(msg.sender == NftOnAuction.currentBidder, 'Claim Auction : Only auction wimmer can claim!');
    transferNonFungibleToken(_tokenId, address(this), msg.sender,  _serialNumber);
    NftOnAuction.claimed = true;
    claimed = true;
  }

  function transferNonFungibleToken(
    address token,
    address sender,
    address receiver,
    int64 serialNumber
  ) public payable {
 
    (int responseCode) = 
    HederaTokenService.transferNFT(token, sender, receiver, serialNumber);

    if(responseCode != HederaResponseCodes.SUCCESS){
        revert("Failed to create non-fungible token");
    }
  }

}