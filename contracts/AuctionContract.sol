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
  }  
   mapping(address => mapping(int64 => mapping(address => Auction))) public mapAuction;
  address public bidder;
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
    bidder = NftOnAuction.currentBidder;
    require(msg.sender == NftOnAuction.auctioner, 'Settle Auction : Restricted to auctioner or admin!');
    transferNonFungibleToken(_tokenId, address(this), NftOnAuction.currentBidder,  _serialNumber);
    delete mapAuction[_tokenId][_serialNumber][_auctioner];
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

  function approveNonFungibleToken(
    address token,
    address approved,
    uint256 serialNumber
  ) public payable {
 
    (int responseCode) = 
    HederaTokenService.approveNFT(token, approved, serialNumber);

    if(responseCode != HederaResponseCodes.SUCCESS){
        revert("Failed to create non-fungible token");
    }
  }

}