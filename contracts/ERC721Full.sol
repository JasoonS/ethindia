pragma solidity ^0.5.0;

import "./ERC721.sol";
import "./ERC721Enumerable.sol";
import "./ERC721Metadata.sol";

/**i
 * @title Full ERC721 Token
 * This implementation includes all the required and some optional functionality of the ERC721 standard
 * Moreover, it includes approve all functionality using operator terminology
 * @dev see https://github.com/ethereum/EIPs/blob/master/EIPS/eip-721.md
 */
contract ERC721Full is ERC721, ERC721Enumerable, ERC721Metadata {

    constructor (string memory name, string memory symbol) public ERC721Metadata(name, symbol) {
        // solhint-disable-previous-line no-empty-blocks
    }

    function setup(uint8 numberOfTokens, string memory uri) public {
        require(!init, "Already initialized");
        init = true;

        steward = msg.sender;
        // mint tokens
        for (uint8 i = 0; i < numberOfTokens; ++i){
          _mint(steward, i); // mint
          _setTokenURI(i, uri);
        }
    }
}
