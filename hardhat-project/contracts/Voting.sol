pragma solidity ^0.8.0;

contract Voting {
    struct Candidate {
        string name;
        uint256 voteCount;
    }

    struct Voter {
        bool hasVoted;
        bytes voterKey;
        bool isRegistered;
    }

    mapping(uint256 => Candidate) public candidates;
    mapping(address => Voter) public voters;

    uint256 public candidatesCount;
    address public owner;
    bool public electionRunning = false;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    modifier onlyRegisteredVoter() {
        require(
            voters[msg.sender].isRegistered,
            "You are not a registered voter"
        );
        _;
    }

    function addCandidate(string memory _name) public onlyOwner {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(_name, 0);
    }

    function addVoter(address _voter, bytes memory _voterKey) public onlyOwner {
        require(!voters[_voter].isRegistered, "Voter already registered");
        voters[_voter] = Voter({
            hasVoted: false,
            voterKey: _voterKey,
            isRegistered: true
        });
    }

    function vote(uint256 _candidateId) public onlyRegisteredVoter {
        require(electionRunning, "Election is not currently running");
        require(!voters[msg.sender].hasVoted, "You have already voted");
        require(
            _candidateId > 0 && _candidateId <= candidatesCount,
            "Invalid candidate"
        );

        voters[msg.sender].hasVoted = true;
        candidates[_candidateId].voteCount++;
    }

    function getCandidate(
        uint256 _candidateId
    ) public view returns (string memory, uint256) {
        require(
            _candidateId > 0 && _candidateId <= candidatesCount,
            "Invalid candidate"
        );
        Candidate memory candidate = candidates[_candidateId];
        return (candidate.name, candidate.voteCount);
    }

    function getVoterInfo(address _voter) public view returns (bool, bool) {
        Voter memory voter = voters[_voter];
        return (voter.hasVoted, voter.isRegistered);
    }

    function startElection() public onlyOwner {
        for (uint256 i = 1; i <= candidatesCount; i++) {
            candidates[i].voteCount = 0;
        }
        electionRunning = true;
    }

    function endElection() public onlyOwner {
        electionRunning = false;
    }
}
