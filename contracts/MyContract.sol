// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MyContract {
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
        string name;
    }

    mapping(uint => Candidate) public candidates;
    mapping(address => Voter) public voters;
    mapping(bytes32 => bool) public nullifierHashes; // for ZKP anonymous voting
    address[] public registeredVoters;
    uint public candidatesCount;

    event CandidateAdded(uint id, string name);
    event VoterRegistered(address voter);
    event VotingStarted();
    event VotingEnded();
    event VoteCasted(bytes32 nullifierHash, uint candidateId);
    event ECTransferred(address oldEC, address newEC);

    modifier onlyEC() {
        require(msg.sender == electionCommission, "Only Election Commission allowed");
        _;
    }

    constructor() {
        electionCommission = msg.sender;
    }

    function transferEC(address newEC) public onlyEC {
        require(newEC != address(0), "Invalid address");
        emit ECTransferred(electionCommission, newEC);
        electionCommission = newEC;
    }

    function addCandidate(string memory _name) public onlyEC {
        require(!votingStarted, "Cannot add candidate after voting starts");
        require(bytes(_name).length > 0, "Candidate name required");

        for (uint i = 1; i <= candidatesCount; i++) {
            require(keccak256(bytes(candidates[i].name)) != keccak256(bytes(_name)), "Candidate already exists");
        }

        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
        emit CandidateAdded(candidatesCount, _name);
    }

    function registerVoter(address _voter, string memory _name) public onlyEC {
        require(!votingStarted, "Cannot register after voting starts");
        require(!voters[_voter].isRegistered, "Voter already registered");

        voters[_voter] = Voter(true, false,_name);
        registeredVoters.push(_voter);
        emit VoterRegistered(_voter);
    }

    function startVoting() public onlyEC {
        require(!votingStarted, "Voting already started");
        require(candidatesCount > 0, "No candidates added");
        votingStarted = true;
        emit VotingStarted();
    }

    function endVoting() public onlyEC {
        require(votingStarted, "Voting not started yet");
        require(!votingEnded, "Voting already ended");
        votingEnded = true;
        emit VotingEnded();
    }

    // Simulated anonymous vote using nullifierHash to mimic ZKP behavior
    function vote(uint _candidateId, bytes32 nullifierHash) public {
        require(votingStarted, "Voting has not started");
        require(!votingEnded, "Voting has ended");
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate");
        require(!nullifierHashes[nullifierHash], "Vote already cast with this proof");

        nullifierHashes[nullifierHash] = true;
        candidates[_candidateId].voteCount++;

        emit VoteCasted(nullifierHash, _candidateId);
    }

    function getResults() public view returns (string[] memory winnerNames, uint winnerVotes) {
        require(votingEnded, "Voting is not yet ended");

        uint maxVotes = 0;
        uint winnerCount = 0;

        for (uint i = 1; i <= candidatesCount; i++) {
            if (candidates[i].voteCount > maxVotes) {
                maxVotes = candidates[i].voteCount;
                winnerCount = 1;
            } else if (candidates[i].voteCount == maxVotes && maxVotes > 0) {
                winnerCount++;
            }
        }

        winnerNames = new string[](winnerCount);
        uint index = 0;

        for (uint i = 1; i <= candidatesCount; i++) {
            if (candidates[i].voteCount == maxVotes && maxVotes > 0) {
                winnerNames[index] = candidates[i].name;
                index++;
            }
        }

        winnerVotes = maxVotes;
    }

    function getAllCandidates() public view returns (Candidate[] memory) {
        Candidate[] memory all = new Candidate[](candidatesCount);
        for (uint i = 1; i <= candidatesCount; i++) {
            all[i - 1] = candidates[i];
        }
        return all;
    }

    function getCandidateVotes(uint _id) public view returns (uint) {
        require(_id > 0 && _id <= candidatesCount, "Invalid candidate ID");
        return candidates[_id].voteCount;
    }

    function getVoter(address _voter) public view returns (bool isRegistered, bool hasVoted, string memory name) {
        Voter memory v = voters[_voter];
        return (v.isRegistered, v.hasVoted, v.name);
    }

    function resetElection() public onlyEC {
        require(votingEnded, "Can only reset after voting ends");

        for (uint i = 1; i <= candidatesCount; i++) {
            delete candidates[i];
        }
        candidatesCount = 0;

        for (uint i = 0; i < registeredVoters.length; i++) {
            delete voters[registeredVoters[i]];
        }
        delete registeredVoters;

        votingStarted = false;
        votingEnded = false;
    }
}
