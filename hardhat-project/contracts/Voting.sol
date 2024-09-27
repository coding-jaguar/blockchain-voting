pragma solidity ^0.8.0;

contract Voting {
    struct Candidate {
        string name;
        uint256 voteCount;
    }

    struct Voter {
        bool hasVoted;
        bool isValidated;
        address votedCandidate;
    }

    mapping(address => Candidate) public candidates;
    mapping(address => Voter) public voters;

    address[] public candidateAddresses;
    address[] public voterAddresses;

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

    function addCandidate(
        address _candidateAddress,
        string memory _name
    ) public onlyOwner {
        require(
            bytes(candidates[_candidateAddress].name).length == 0,
            "Candidate already exists"
        );
        candidates[_candidateAddress] = Candidate(_name, 0);
        candidateAddresses.push(_candidateAddress);
    }

    function deleteCandidate(address _candidateAddress) public onlyOwner {
        require(
            bytes(candidates[_candidateAddress].name).length != 0,
            "Candidate does not exist"
        );
        delete candidates[_candidateAddress];
        // Remove from candidateAddresses array
        for (uint256 i = 0; i < candidateAddresses.length; i++) {
            if (candidateAddresses[i] == _candidateAddress) {
                candidateAddresses[i] = candidateAddresses[
                    candidateAddresses.length - 1
                ];
                candidateAddresses.pop();
                break;
            }
        }
    }

    function addVoter(address _voter) public onlyOwner {
        voters[_voter] = Voter({
            hasVoted: false,
            isValidated: false, // Initially not validated by the backend
            votedCandidate: address(0)
        });
        voterAddresses.push(_voter);
    }

    // User votes without the need for a voter key
    function vote(address _candidateAddress) public {
        require(electionRunning, "Election is not currently running");
        require(!voters[msg.sender].hasVoted, "You have already voted");
        require(
            bytes(candidates[_candidateAddress].name).length != 0,
            "Invalid candidate"
        );

        // Mark as voted but not validated
        voters[msg.sender].hasVoted = true;
        voters[msg.sender].isValidated = false; // Backend validation required
        voters[msg.sender].votedCandidate = _candidateAddress;
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

        // Count the vote for the candidate
        address candidateAddress = voters[_voter].votedCandidate; // Get the candidate the voter voted for
        candidates[candidateAddress].voteCount++;
    }

    function getCandidate(
        address _candidateAddress
    ) public view returns (string memory, uint256) {
        require(
            bytes(candidates[_candidateAddress].name).length != 0,
            "Invalid candidate"
        );
        Candidate memory candidate = candidates[_candidateAddress];
        return (candidate.name, candidate.voteCount);
    }

    function getVoterInfo(
        address _voter
    ) public view returns (bool, bool, address) {
        Voter memory voter = voters[_voter];
        return (voter.hasVoted, voter.isValidated, voter.votedCandidate);
    }

    function startElection() public onlyOwner {
        // Reset vote counts for all candidates
        for (uint256 i = 0; i < candidateAddresses.length; i++) {
            address candidateAddress = candidateAddresses[i];
            candidates[candidateAddress].voteCount = 0;
        }
        electionRunning = true;
    }

    function endElection() public onlyOwner {
        electionRunning = false;
    }

    function getTotalVotes() public view returns (uint256[] memory) {
        uint256[] memory votes = new uint256[](candidateAddresses.length);
        for (uint256 i = 0; i < candidateAddresses.length; i++) {
            address candidateAddress = candidateAddresses[i];
            votes[i] = candidates[candidateAddress].voteCount;
        }
        return votes;
    }

    function resetElection() public onlyOwner {
        // Reset vote counts for all candidates
        for (uint256 i = 0; i < candidateAddresses.length; i++) {
            address candidateAddress = candidateAddresses[i];
            candidates[candidateAddress].voteCount = 0;
        }
        // Reset voter statuses
        for (uint256 i = 0; i < voterAddresses.length; i++) {
            address voterAddress = voterAddresses[i];
            voters[voterAddress].hasVoted = false;
            voters[voterAddress].isValidated = false;
            voters[voterAddress].votedCandidate = address(0);
        }
        electionRunning = false;
    }

    function getAllCandidates()
        public
        view
        returns (address[] memory, string[] memory, uint256[] memory)
    {
        string[] memory names = new string[](candidateAddresses.length);
        uint256[] memory voteCounts = new uint256[](candidateAddresses.length);

        for (uint256 i = 0; i < candidateAddresses.length; i++) {
            address candidateAddress = candidateAddresses[i];
            names[i] = candidates[candidateAddress].name;
            voteCounts[i] = candidates[candidateAddress].voteCount;
        }

        return (candidateAddresses, names, voteCounts);
    }

    function getAllVoters()
        public
        view
        returns (
            address[] memory,
            bool[] memory,
            bool[] memory,
            address[] memory
        )
    {
        uint256 voterCount = voterAddresses.length;
        bool[] memory hasVoted = new bool[](voterCount);
        bool[] memory isValidated = new bool[](voterCount);
        address[] memory votedCandidates = new address[](voterCount);

        for (uint256 i = 0; i < voterCount; i++) {
            address voterAddress = voterAddresses[i];
            Voter memory voter = voters[voterAddress];
            hasVoted[i] = voter.hasVoted;
            isValidated[i] = voter.isValidated;
            votedCandidates[i] = voter.votedCandidate;
        }

        return (voterAddresses, hasVoted, isValidated, votedCandidates);
    }
    function selfDestruct() public onlyOwner {
        selfdestruct(payable(owner));
    }
}
