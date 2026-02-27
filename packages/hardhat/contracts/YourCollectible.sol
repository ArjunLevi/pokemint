// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract YourCollectible is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {
    uint256 public tokenIdCounter;
    
    // 0.01 USD is roughly 0.000005 ETH (adjust this as needed)
    uint256 public mintFee = 0.000005 ether;

    constructor() ERC721("YourCollectible", "PKN") Ownable(msg.sender) {}

    function _baseURI() internal pure override returns (string memory) {
        return "https://ipfs.io/ipfs/";
    }

    // Notice the 'payable' modifier - this allows the function to receive money
    function mintItem(address to, string memory uri) public payable returns (uint256) {
        require(msg.value >= mintFee, "Not enough ETH sent; check the mint fee");

        tokenIdCounter++;
        uint256 tokenId = tokenIdCounter;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        
        return tokenId;
    }

    // --- FEE MANAGEMENT FUNCTIONS ---

    // Allow the owner to change the fee if the price of ETH changes
    function setMintFee(uint256 _newFee) public onlyOwner {
        mintFee = _newFee;
    }

    // This is how you get the money OUT of the contract
    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        // Sends all accumulated fees to the owner's wallet
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Transfer failed");
    }

    // --- OVERRIDES REQUIRED BY SOLIDITY ---

    function _update(address to, uint256 tokenId, address auth) internal override(ERC721, ERC721Enumerable) returns (address) {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value) internal override(ERC721, ERC721Enumerable) {
        super._increaseBalance(account, value);
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Enumerable, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}