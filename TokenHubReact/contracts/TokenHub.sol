pragma solidity ^0.4.24;

import "./SecurityToken.sol";
import "/home/terence/DAPPS/SolidityProjects/TokenHubReact/node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";

contract TokenHub {
	using SafeMath for uint256;
	address[] public tokens;

	event LogNewToken(address sender, address token, string tokenName, string tokenSymbol, uint256 tokenSupply );
	event LogDistribution(address sender, address _fiataddress,address _tokenAddress, address[] _destination, uint256[] _fiatInvested, uint256 rate );

	function getTokenCount()
		public
		constant
		returns(uint tokenCount)
	{
		return tokens.length;
	}

	function createToken(string _name, string _symbol, uint256 _INITIAL_SUPPLY) 
		public
		returns(address tokenContract)
	{
		SecurityToken deployedContract = new SecurityToken(_name, _symbol, _INITIAL_SUPPLY);
		tokens.push(deployedContract);
		emit LogNewToken(msg.sender, deployedContract, _name, _symbol, _INITIAL_SUPPLY);
		return deployedContract;
	}

	/**
	 * @dev Test function to distribute fiat to test accounts
	 */

	function testSendOutFiat(address _fiatAddress, address[] _destination, uint256 amount)
		public
		returns(bool _success)
	{
		ERC20 fiat = ERC20(_fiatAddress);
		for(uint256 i=0 ; i< _destination.length ;i++){
			fiat.transfer(_destination[i], amount );
		}

		return true;
	}
	/**
	 * @dev Coverts amount of Fiat Invested, extract funds from investors, sends back the investors the token amount)
	 * @dev Investors must approve first before we can extract funds from them
	 * @param _fiatAddress Address of Fiat Contract
	 * @param _tokenAddress Address of Token Contract
	 * @param _destination Array of investor accounts
	 * @param _fiatInvested Array of fiat amounts by investors (in same order as investor array)
	 * @param rate Number of Tokens per Fiat 
	 */
	function convertAndDistributeToken(address _fiatAddress, address _tokenAddress, address[] _destination, uint256[] _fiatInvested, uint256 rate)
		public
		returns(bool _success)
	{
		 ERC20 fiat = ERC20(_fiatAddress);
		 ERC20 token = ERC20(_tokenAddress);

		 for (uint256 i=0; i < _destination.length; i++) {
		   fiat.transferFrom(_destination[i], address(this), _fiatInvested[i]);
           token.transfer(_destination[i], _fiatInvested[i].mul(rate));
        }

        emit LogDistribution(msg.sender, _fiatAddress, _tokenAddress, _destination, _fiatInvested, rate);

        return true;

	}
	function () public payable {}


}