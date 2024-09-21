pragma solidity ^0.8.0;

contract Voting {
    struct Candidate {
        string name;
        uint256 voteCount;
    }

    struct Voter {
        bool hasVoted;
        bool isValidated; // Check if the backend has validated the vote
        bytes voterKey;
        bool isRegistered;
    }

    mapping(uint256 => Candidate) public candidates;
    mapping(address => Voter) public voters;

    uint256 public candidatesCount;
    address public owner;
    bool public electionRunning = false;
    bytes public backendKey; // Store backend key

    constructor(bytes memory _backendKey) {
        owner = msg.sender;
        backendKey = _backendKey; // Initialize backend key in the constructor
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
            isValidated: false, // Initially not validated by the backend
            voterKey: _voterKey,
            isRegistered: true
        });
    }

    // User votes with their voter key
    function vote(
        uint256 _candidateId,
        bytes memory _voterKey
    ) public onlyRegisteredVoter {
        require(electionRunning, "Election is not currently running");
        require(!voters[msg.sender].hasVoted, "You have already voted");
        require(
            _candidateId > 0 && _candidateId <= candidatesCount,
            "Invalid candidate"
        );
        require(
            keccak256(voters[msg.sender].voterKey) == keccak256(_voterKey),
            "Invalid voter key"
        );

        // Mark as voted but not validated
        voters[msg.sender].hasVoted = true;
        voters[msg.sender].isValidated = false; // Backend validation required
    }

    // Backend validates the vote
    function validateVote(
        address _voter,
        bytes memory _backendKey
    ) public onlyOwner {
        require(
            keccak256(backendKey) == keccak256(_backendKey),
            "Invalid backend key"
        );
        require(voters[_voter].hasVoted, "Voter has not voted yet");
        require(!voters[_voter].isValidated, "Vote already validated");

        // Mark the vote as validated
        voters[_voter].isValidated = true;

        // Count the vote
        uint256 candidateId = 1; // Assuming you have logic to track the voter's candidate
        candidates[candidateId].voteCount++;
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

    function getVoterInfo(
        address _voter
    ) public view returns (bool, bool, bool) {
        Voter memory voter = voters[_voter];
        return (voter.hasVoted, voter.isValidated, voter.isRegistered);
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

    function getTotalVotes() public view returns (uint[] memory) {
        uint[] memory votes = new uint[](candidatesCount);
        for (uint i = 1; i <= candidatesCount; i++) {
            votes[i - 1] = candidates[i].voteCount; // Array index starts at 0, candidate ID starts at 1
        }
        return votes;
    }
}
