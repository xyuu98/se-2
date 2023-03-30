// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";

contract TestNft is Ownable, ReentrancyGuard, ERC721 {
  ////////////////////////////////////////////
  ///////////  State variables  //////////////
  ////////////////////////////////////////////
  bytes32 private _FreelistMerkleRoot;
  bytes32 private _WhitelistMerkleRoot;

  uint256 public MAX_SUPPLY;
  uint256 public MINT_COST;
  uint256 public tokenId;
  uint256 public mintStartTime;
  bool public mintState;
  address public metadataAddress;

  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  ////////////////////////////////////////////
  /////////////    Error   ///////////////////
  ////////////////////////////////////////////
  error MerkleProofInvalid();
  error FreelistMintAlreadyClaimed();
  error WhitelistMintAlreadyClaimed();
  error MintReachedSupply();
  error CallerIsNotUser();
  error SendWrongMintCost();
  error TransferFaied();
  error SetLater();
  error MintNotStart();
  error InvalidAddress();
  error TTTNotFound();
  error MintIsOver();

  ////////////////////////////////////////////
  /////////////    Event   ///////////////////
  ////////////////////////////////////////////
  event freelistMinted(address indexed minter, uint256 indexed tokenId);
  event whitelistMinted(address indexed minter, uint256 indexed tokenId);
  event MetadataAddressUpdated(address metadataAddress);

  ////////////////////////////////////////////
  /////////////   Mapping   //////////////////
  ////////////////////////////////////////////
  mapping(address => bool) public freelistClaimed;
  mapping(address => bool) public whitelistClaimed;

  ////////////////////////////////////////////
  //////////////  Modifier   /////////////////
  ////////////////////////////////////////////
  modifier validMerkleProof(bytes32 root, bytes32[] calldata proof) {
    if (!MerkleProof.verify(proof, root, keccak256(abi.encodePacked(msg.sender)))) revert MerkleProofInvalid();
    _;
  }

  modifier freelistNotAlreadyClaimed() {
    if (freelistClaimed[msg.sender]) revert FreelistMintAlreadyClaimed();
    _;
  }

  modifier whitelistNotAlreadyClaimed() {
    if (whitelistClaimed[msg.sender]) revert WhitelistMintAlreadyClaimed();
    _;
  }

  modifier mintNotReachSupply() {
    if (_tokenIds.current() > MAX_SUPPLY) revert MintReachedSupply();
    _;
  }

  modifier callerIsUser() {
    if (tx.origin != msg.sender) revert CallerIsNotUser();
    _;
  }

  modifier mintStart() {
    if (mintState) revert MintNotStart();
    _;
  }

  ////////////////////////////////////////////
  //////////////  Constructor   //////////////
  ////////////////////////////////////////////
  constructor(uint256 maxSupply, uint256 mintCost) ERC721("TEST NFT", "TTT") {
    MAX_SUPPLY = maxSupply;
    MINT_COST = mintCost;
  }

  ////////////////////////////////////////////
  //////////////  Functions   ////////////////
  ////////////////////////////////////////////

  //setRoot
  function setFreelistMerkleRoot(bytes32 newRoot) external onlyOwner {
    _FreelistMerkleRoot = newRoot;
  }

  function setWhitelistMerkleRoot(bytes32 newRoot) external onlyOwner {
    _WhitelistMerkleRoot = newRoot;
  }

  //setMintState
  function setMintState() external onlyOwner {
    mintState = !mintState;
  }

  //setMintTime
  function setMintTime(uint256 mintTime) external onlyOwner {
    if (mintTime <= block.timestamp) revert SetLater();
    mintStartTime = mintTime;
  }

  //Mint
  function freelistMint(
    bytes32[] calldata _merkleProof
  )
    external
    payable
    validMerkleProof(_FreelistMerkleRoot, _merkleProof)
    freelistNotAlreadyClaimed
    mintNotReachSupply
    callerIsUser
    mintStart
    nonReentrant
  {
    if (mintStartTime == 0) revert MintNotStart();
    if (mintStartTime <= block.timestamp) revert MintIsOver();
    freelistClaimed[msg.sender] = true;
    tokenId = _tokenIds.current();
    _safeMint(msg.sender, tokenId);

    emit freelistMinted(msg.sender, tokenId);
    _tokenIds.increment();
    tokenId = _tokenIds.current();
  }

  function whitelistMint(
    bytes32[] calldata _merkleProof
  )
    external
    payable
    validMerkleProof(_WhitelistMerkleRoot, _merkleProof)
    whitelistNotAlreadyClaimed
    mintNotReachSupply
    callerIsUser
    mintStart
    nonReentrant
  {
    if (mintStartTime == 0) revert MintNotStart();
    if (mintStartTime <= block.timestamp) revert MintIsOver();
    if (msg.value != MINT_COST) revert SendWrongMintCost();
    whitelistClaimed[msg.sender] = true;
    tokenId = _tokenIds.current();
    _safeMint(msg.sender, tokenId);

    emit whitelistMinted(msg.sender, tokenId);
    _tokenIds.increment();
    tokenId = _tokenIds.current();
  }

  //setTokenMetadata
  function setMetadataAddress(address addr) external onlyOwner {
    if (addr == address(0)) revert InvalidAddress();
    metadataAddress = addr;
    emit MetadataAddressUpdated(addr);
  }

  //tokenURI
  function tokenURI(uint256 tId) public view override returns (string memory) {
    if (!_exists(tId)) revert TTTNotFound();
    return IERC721Metadata(metadataAddress).tokenURI(tId);
  }

  //Withdraw
  function withdraw() external onlyOwner nonReentrant {
    (bool success, ) = msg.sender.call{value: address(this).balance}("");
    if (!success) revert TransferFaied();
  }
}
