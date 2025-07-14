const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MyContract (EVoting)", function () {
  let contract;
  let owner, voter1, voter2;
  
  beforeEach(async () => {
    [owner, voter1, voter2] = await ethers.getSigners();
    const MyContract = await ethers.getContractFactory("MyContract");
    contract = await MyContract.deploy();
    await contract.deployed();
  });

  it("should allow EC to add candidates", async () => {
    await contract.addCandidate("Alice");
    await contract.addCandidate("Bob");

    const candidates = await contract.getAllCandidates();
    expect(candidates.length).to.equal(2);
    expect(candidates[0].name).to.equal("Alice");
    expect(candidates[1].name).to.equal("Bob");
  });

  it("should allow EC to register voters", async () => {
    await contract.registerVoter(voter1.address, "Ashwin");
    const [isRegistered, hasVoted, name] = await contract.getVoter(voter1.address);

    expect(isRegistered).to.be.true;
    expect(name).to.equal("Ashwin");
  });

  it("should allow voting and declare winner", async () => {
    await contract.addCandidate("Alice");
    await contract.addCandidate("Bob");

    await contract.registerVoter(voter1.address, "Voter1");
    await contract.registerVoter(voter2.address, "Voter2");

    await contract.startVoting();

    // Simulate votes with unique nullifier hashes
    await contract.connect(voter1).vote(1, ethers.utils.keccak256(ethers.utils.toUtf8Bytes("voter1-vote")));
    await contract.connect(voter2).vote(1, ethers.utils.keccak256(ethers.utils.toUtf8Bytes("voter2-vote")));

    await contract.endVoting();

    const results = await contract.getResults();
    expect(results.winnerNames[0]).to.equal("Alice");
    expect(results.winnerVotes).to.equal(2);
  });

  it("should prevent duplicate ZKP votes", async () => {
    await contract.addCandidate("Alice");
    await contract.registerVoter(voter1.address, "Voter1");
    await contract.startVoting();

    const nullifier = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("same-vote"));

    await contract.connect(voter1).vote(1, nullifier);
    await expect(
      contract.connect(voter1).vote(1, nullifier)
    ).to.be.revertedWith("Vote already cast with this proof");
  });

  it("should reset election after it ends", async () => {
    await contract.addCandidate("Alice");
    await contract.registerVoter(voter1.address, "Voter1");

    await contract.startVoting();

    await contract.connect(voter1).vote(1, ethers.utils.keccak256(ethers.utils.toUtf8Bytes("vote")));

    await contract.endVoting();

    await contract.resetElection();

    const candidates = await contract.getAllCandidates();
    expect(candidates.length).to.equal(0);

    const [isRegistered] = await contract.getVoter(voter1.address);
    expect(isRegistered).to.be.false;
  });
});
