// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";

contract SE2H is Ownable, ReentrancyGuard, ERC721 {
    ////////////////////////////////////////////
    ///////////  State variables  //////////////
    ////////////////////////////////////////////
    bytes32 private s_freelistMerkleRoot;
    bytes32 private s_whitelistMerkleRoot;

    uint256 public immutable i_maxSupply;
    uint256 public immutable i_mintPrice;
    string public baseURI;
    string public notRevealedUri;
    bool public revealed = false;
    uint256 public tokenId;
    uint256 public mintStartTime;
    uint256 public mintEndTime;
    bool public mintState;

    using Strings for uint256;
    using Counters for Counters.Counter;
    Counters.Counter private s_tokenIds;

    ////////////////////////////////////////////
    /////////////    Error   ///////////////////
    ////////////////////////////////////////////
    error MerkleProofInvalid();
    error FreelistMintAlreadyClaimed();
    error WhitelistMintAlreadyClaimed();
    error ReachedMaxSupply();
    error CallerIsNotUser();
    error SendWrongMintPrice();
    error TransferFaied();
    error TooEarly();
    error WrongTimeSet();
    error MintNotStart();
    error InvalidAddress();
    error NotFound();
    error MintIsOver();
    error MoreThan5();
    error NonexistentToken();
    error AlreadyRevealed();

    ////////////////////////////////////////////
    /////////////    Event   ///////////////////
    ////////////////////////////////////////////
    event freelistMinted(address indexed minter, uint256 indexed tokenId);
    event whitelistMinted(address indexed minter, uint256 indexed tokenId);
    event publcMinted(address indexed minter, uint256 indexed tokenId);

    ////////////////////////////////////////////
    /////////////   Mapping   //////////////////
    ////////////////////////////////////////////
    mapping(address => bool) public freelistClaimed;
    mapping(address => bool) public whitelistClaimed;

    ////////////////////////////////////////////
    //////////////  Modifier   /////////////////
    ////////////////////////////////////////////
    modifier validMerkleProof(bytes32 root, bytes32[] calldata proof) {
        if (
            !MerkleProof.verify(
                proof,
                root,
                keccak256(abi.encodePacked(msg.sender))
            )
        ) revert MerkleProofInvalid();
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
        if (s_tokenIds.current() > i_maxSupply) revert ReachedMaxSupply();
        _;
    }

    modifier callerIsUser() {
        if (tx.origin != msg.sender) revert CallerIsNotUser();
        _;
    }

    modifier mintStart() {
        if (!mintState) revert MintNotStart();
        _;
    }

    ////////////////////////////////////////////
    //////////////  Constructor   //////////////
    ////////////////////////////////////////////
    constructor(
        uint256 maxSupply,
        uint256 mintPrice
    ) ERC721("Scaffold-Eth2-Hackathon-NFT", "SE2H") {
        i_maxSupply = maxSupply;
        i_mintPrice = mintPrice;
    }

    ////////////////////////////////////////////
    //////////////  Functions   ////////////////
    ////////////////////////////////////////////

    //setRoot
    function setFreelistMerkleRoot(bytes32 newRoot) external onlyOwner {
        s_freelistMerkleRoot = newRoot;
    }

    function setWhitelistMerkleRoot(bytes32 newRoot) external onlyOwner {
        s_whitelistMerkleRoot = newRoot;
    }

    //set uri
    function setNotRevealedURI(
        string memory _notRevealedURI
    ) external onlyOwner {
        notRevealedUri = _notRevealedURI;
    }

    function setBaseURI(string memory _newBaseURI) external onlyOwner {
        baseURI = _newBaseURI;
    }

    //set revealed
    function setReveal() external onlyOwner {
        if (revealed == true) revert AlreadyRevealed();
        revealed = !revealed;
    }

    //setMintState
    function setMintState() external onlyOwner {
        mintState = !mintState;
    }

    //setMintTime
    function setMintTime(
        uint256 startTime,
        uint256 endTime
    ) external onlyOwner {
        if (startTime <= block.timestamp) revert TooEarly();
        if (endTime <= block.timestamp) revert TooEarly();
        if (startTime >= endTime) revert WrongTimeSet();
        mintStartTime = startTime;
        mintEndTime = endTime;
    }

    //Mint
    function freelistMint(
        bytes32[] calldata _merkleProof
    )
        external
        payable
        validMerkleProof(s_freelistMerkleRoot, _merkleProof)
        freelistNotAlreadyClaimed
        mintNotReachSupply
        callerIsUser
        mintStart
        nonReentrant
    {
        if (block.timestamp < mintStartTime) revert MintNotStart();
        if (block.timestamp > mintEndTime) revert MintIsOver();
        freelistClaimed[msg.sender] = true;
        tokenId = s_tokenIds.current();
        _safeMint(msg.sender, tokenId);
        emit freelistMinted(msg.sender, tokenId);
        s_tokenIds.increment();
        tokenId = s_tokenIds.current();
    }

    function whitelistMint(
        bytes32[] calldata _merkleProof
    )
        external
        payable
        validMerkleProof(s_whitelistMerkleRoot, _merkleProof)
        whitelistNotAlreadyClaimed
        mintNotReachSupply
        callerIsUser
        mintStart
        nonReentrant
    {
        if (block.timestamp < mintStartTime) revert MintNotStart();
        if (block.timestamp > mintEndTime) revert MintIsOver();
        if (msg.value != i_mintPrice / 2) revert SendWrongMintPrice();
        whitelistClaimed[msg.sender] = true;
        tokenId = s_tokenIds.current();
        _safeMint(msg.sender, tokenId);
        emit whitelistMinted(msg.sender, tokenId);
        s_tokenIds.increment();
        tokenId = s_tokenIds.current();
    }

    function publicMint()
        external
        payable
        mintNotReachSupply
        callerIsUser
        mintStart
        nonReentrant
    {
        if (block.timestamp < mintEndTime) revert MintNotStart();
        if (msg.value != i_mintPrice) revert SendWrongMintPrice();
        if (balanceOf(msg.sender) >= 5) revert MoreThan5();
        tokenId = s_tokenIds.current();
        _safeMint(msg.sender, tokenId);
        emit publcMinted(msg.sender, tokenId);
        s_tokenIds.increment();
        tokenId = s_tokenIds.current();
    }

    //tokenURI
    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    function tokenURI(
        uint256 tokenId
    ) public view virtual override returns (string memory) {
        if (!_exists(tokenId)) revert NonexistentToken();
        if (revealed == false) {
            return notRevealedUri;
        }

        string memory currentBaseURI = _baseURI();
        return
            bytes(currentBaseURI).length > 0
                ? string(
                    abi.encodePacked(
                        currentBaseURI,
                        tokenId.toString(),
                        ".json"
                    )
                )
                : "";
    }

    //Withdraw
    function withdraw() external onlyOwner nonReentrant {
        (bool success, ) = msg.sender.call{value: address(this).balance}("");
        if (!success) revert TransferFaied();
    }
}
