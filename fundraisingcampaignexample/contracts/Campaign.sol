pragma solidity 0.4.19;

import "./Stoppable.sol";

contract Campaign is Stoppable {
 
    address public sponsor;
    uint    public deadline;
    uint    public goal;
    uint    public fundsRaised;
    uint    public refunded;
    
    struct FunderStruct {
        uint amountContributed;
        uint amountRefunded;
    }
    
    mapping (address => FunderStruct) public funderStructs;
    
    modifier onlySponsor { 
        require(msg.sender == sponsor);
        _; 
    }
    
    event LogContribution(address sender, uint amount);
    event LogRefundSent(address funder, uint amount);
    event LogWithdrawal(address beneficiary, uint amount);
    
    function Campaign(address campaignSponsor, uint campaignDuration, uint campaignGoal) public {
        sponsor = campaignSponsor;
        deadline = block.number + campaignDuration;
        goal = campaignGoal;
    }
    
    function isSuccess()
        public
        constant
        returns(bool isIndeed)
    {
        return(fundsRaised >= goal);
    }
    
    function hasFailed()
        public
        constant
        returns(bool hasIndeed)
    {
        return(fundsRaised < goal && block.number > deadline);
    }
    
    function contribute() 
        public
        onlyIfRunning
        payable 
        returns(bool success) 
    {
        require(msg.value > 0);
        require(!isSuccess());
        require(!hasFailed());
        
        fundsRaised += msg.value;
        funderStructs[msg.sender].amountContributed += msg.value;
        LogContribution(msg.sender, msg.value);
        return true;
    }
    
    function withdrawFunds() 
        public
        onlySponsor
        onlyIfRunning
        returns(bool success) 
    {
        require(isSuccess());
        
        uint amount = this.balance;
        refunded += amount;
        LogWithdrawal(owner, amount);
        sponsor.transfer(amount);
        return true;
    }
    
    function requestRefund()
        public
        onlyIfRunning
        returns(bool success) 
    {
        uint amountOwed = funderStructs[msg.sender].amountContributed - funderStructs[msg.sender].amountRefunded;
        require(amountOwed > 0);
        require(hasFailed());
        
        funderStructs[msg.sender].amountRefunded += amountOwed;
        LogRefundSent(msg.sender, amountOwed);
        msg.sender.transfer(amountOwed);
        return true;
    }
    
}