
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EVoting {
    address public electionCommission;
    bool public votingStarted;
    bool public votingEnded;

    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint votedCandidateId;
    }

    mapping(uint => Candidate) public candidates;
    mapping(address => Voter) public voters;
    uint public candidatesCount;

    // Events for frontend interaction and logs
    event CandidateAdded(uint id, string name);
    event VoterRegistered(address voter);
    event VotingStarted();
    event VotingEnded();
    event VoteCasted(address voter, uint candidateId);

    modifier onlyEC() {
        require(msg.sender == electionCommission, "Only Election Commission allowed");
        _;
    }

    constructor() {
        electionCommission = msg.sender;
    }

    // Add candidate before voting starts based on name
    function addCandidate(string memory _name) public onlyEC {
        require(!votingStarted, "Cannot add candidate after voting starts");
        require(bytes(_name).length > 0, "Candidate name required");
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
        emit CandidateAdded(candidatesCount, _name);
    }

    // Register a voter before voting starts
    function registerVoter(address _voter) public onlyEC {
        require(!votingStarted, "Cannot register after voting starts");
        require(!voters[_voter].isRegistered, "Voter already registered");
        voters[_voter].isRegistered = true;
        emit VoterRegistered(_voter);
    }

    // Start voting
    function startVoting() public onlyEC {
        require(!votingStarted, "Voting already started");
        require(candidatesCount > 0, "No candidates added");
        votingStarted = true;
        emit VotingStarted();
    }

    // End voting
    function endVoting() public onlyEC {
        require(votingStarted, "Voting not started yet");
        require(!votingEnded, "Voting already ended");
        votingEnded = true;
        emit VotingEnded();
    }

    // Vote for candidate
    function vote(uint _candidateId) public {
        require(votingStarted, "Voting has not started");
        require(!votingEnded, "Voting has ended");
        require(voters[msg.sender].isRegistered, "Not a registered voter");
        require(!voters[msg.sender].hasVoted, "Already voted");
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate");

        voters[msg.sender].hasVoted = true;
        voters[msg.sender].votedCandidateId = _candidateId;
        candidates[_candidateId].voteCount++;

        emit VoteCasted(msg.sender, _candidateId);
    }

    // Get results (only after voting ends)
    function getResults() public view returns (string memory winnerName, uint winnerVotes) {
        require(votingEnded, "Voting is not yet ended");

        uint maxVotes = 0;
        uint winnerId;

        for (uint i = 1; i <= candidatesCount; i++) {
            if (candidates[i].voteCount > maxVotes) {
                maxVotes = candidates[i].voteCount;
                winnerId = i;
            }
        }

        winnerName = candidates[winnerId].name;
        winnerVotes = candidates[winnerId].voteCount;
    }

    // Optional: Get all candidates and their vote counts
    function getAllCandidates() public view returns (Candidate[] memory) {
        Candidate[] memory all = new Candidate[](candidatesCount);
        for (uint i = 1; i <= candidatesCount; i++) {
            all[i - 1] = candidates[i];
        }
        return all;
    }
}
