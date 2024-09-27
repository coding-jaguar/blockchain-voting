require("dotenv").config();
const { ethers } = require("ethers");
const abi = require("./Voting.json").abi; // Ensure Voting.json ABI file is in the same directory

// Load environment variables
const PRIVATE_KEY = process.env.privateKey;
const PROVIDER_URL = "HTTP://127.0.0.1:7545";
const CONTRACT_ADDRESS = process.env.contractAddress;

// Initialize provider and wallet
const provider = new ethers.providers.JsonRpcProvider(PROVIDER_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const voterKey =
  "0xe231f938365bb0e2386986e1c620d3aca35492ec675b88531712f54356d2cd85";
const voterWallet = new ethers.Wallet(voterKey, provider);

// Initialize contract
const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, wallet);
const voterContract = new ethers.Contract(CONTRACT_ADDRESS, abi, voterWallet);

// Function to add a candidate
const addCandidate = async (candidateAddress, candidateName) => {
  try {
    const tx = await contract.addCandidate(candidateAddress, candidateName);
    console.log(`Transaction hash: ${tx.hash}`);
    await tx.wait();
    console.log("Candidate added successfully");
  } catch (error) {
    console.error("Error adding candidate:", error);
  }
};

// Function to delete a candidate
const deleteCandidate = async (candidateAddress) => {
  try {
    const tx = await contract.deleteCandidate(candidateAddress);
    console.log(`Transaction hash: ${tx.hash}`);
    await tx.wait();
    console.log("Candidate deleted successfully");
  } catch (error) {
    console.error("Error deleting candidate:", error);
  }
};

// Function to add a voter
const addVoter = async (voterAddress) => {
  try {
    const tx = await contract.addVoter(voterAddress);
    console.log(`Transaction hash: ${tx.hash}`);
    await tx.wait();
    console.log("Voter added successfully");
  } catch (error) {
    console.error("Error adding voter:", error);
  }
};

// Function to vote for a candidate
const vote = async (candidateAddress) => {
  try {
    const tx = await voterContract.vote(candidateAddress);
    console.log(`Transaction hash: ${tx.hash}`);
    await tx.wait();
    console.log("Vote submitted successfully");
  } catch (error) {
    console.error("Error voting:", error);
  }
};

// Function to validate a vote
const validateVote = async (voterAddress, backendKey) => {
  try {
    const tx = await contract.validateVote(
      voterAddress,
      ethers.utils.toUtf8Bytes(backendKey)
    );
    console.log(`Transaction hash: ${tx.hash}`);
    await tx.wait();
    console.log("Vote validated successfully");
  } catch (error) {
    console.error("Error validating vote:", error);
  }
};

// Function to start the election
const startElection = async () => {
  try {
    const tx = await contract.startElection();
    console.log(`Transaction hash: ${tx.hash}`);
    await tx.wait();
    console.log("Election started successfully");
  } catch (error) {
    console.error("Error starting election:", error);
  }
};

// Function to end the election
const endElection = async () => {
  try {
    const tx = await contract.endElection();
    console.log(`Transaction hash: ${tx.hash}`);
    await tx.wait();
    console.log("Election ended successfully");
  } catch (error) {
    console.error("Error ending election:", error);
  }
};

// Function to reset the election
const resetElection = async () => {
  try {
    const tx = await contract.resetElection();
    console.log(`Transaction hash: ${tx.hash}`);
    await tx.wait();
    console.log("Election reset successfully");
  } catch (error) {
    console.error("Error resetting election:", error);
  }
};

// Function to get candidate information
const getCandidate = async (candidateAddress) => {
  try {
    const candidate = await contract.getCandidate(candidateAddress);
    console.log(
      `Candidate Name: ${candidate[0]}, Vote Count: ${candidate[1].toString()}`
    );
  } catch (error) {
    console.error("Error getting candidate information:", error);
  }
};

// Function to get voter information
const getVoterInfo = async (voterAddress) => {
  try {
    const voterInfo = await contract.getVoterInfo(voterAddress);
    console.log(
      `Has Voted: ${voterInfo[0]}, Is Validated: ${voterInfo[1]}, Voted Candidate: ${voterInfo[2]}`
    );
  } catch (error) {
    console.error("Error getting voter information:", error);
  }
};

// Function to get total votes for all candidates
const getTotalVotes = async () => {
  try {
    const votes = await contract.getTotalVotes();
    console.log(
      "Total Votes:",
      votes.map((v) => v.toString())
    );
  } catch (error) {
    console.error("Error getting total votes:", error);
  }
};

// Function to get all candidates' information
const getAllCandidates = async () => {
  try {
    const [addresses, names, voteCounts] = await contract.getAllCandidates();
    for (let i = 0; i < addresses.length; i++) {
      console.log(
        `Candidate Address: ${addresses[i]}, Name: ${
          names[i]
        }, Vote Count: ${voteCounts[i].toString()}`
      );
    }
  } catch (error) {
    console.error("Error getting all candidates:", error);
  }
};

// Function to get all voter information
const getAllVoters = async () => {
  try {
    const [
      voterAddresses,
      hasVoted,
      isValidated,
      isRegistered,
      votedCandidates,
    ] = await contract.getAllVoters();
    for (let i = 0; i < voterAddresses.length; i++) {
      console.log(
        `Voter Address: ${voterAddresses[i]}, Has Voted: ${hasVoted[i]}, Is Validated: ${isValidated[i]}, Is Registered: ${isRegistered[i]}, Voted Candidate: ${votedCandidates[i]}`
      );
    }
  } catch (error) {
    console.error("Error getting all voters:", error);
  }
};

// Function to self-destruct the contract
const selfDestruct = async () => {
  try {
    const tx = await contract.selfDestruct();
    console.log(`Transaction hash: ${tx.hash}`);
    await tx.wait();
    console.log("Contract self-destructed successfully");
  } catch (error) {
    console.error("Error self-destructing the contract:", error);
  }
};

// Main function to handle command-line arguments
const main = async () => {
  const [operation, ...args] = process.argv.slice(2);

  switch (operation) {
    case "addCandidate":
      if (args.length !== 2) {
        console.error(
          "Usage: node interact.js addCandidate <candidateAddress> <candidateName>"
        );
        return;
      }
      await addCandidate(args[0], args[1]);
      break;

    case "deleteCandidate":
      if (args.length !== 1) {
        console.error(
          "Usage: node interact.js deleteCandidate <candidateAddress>"
        );
        return;
      }
      await deleteCandidate(args[0]);
      break;

    case "addVoter":
      if (args.length !== 1) {
        console.error("Usage: node interact.js addVoter <voterAddress>");
        return;
      }
      await addVoter(args[0]);
      break;

    case "vote":
      if (args.length !== 1) {
        console.error("Usage: node interact.js vote <candidateAddress>");
        return;
      }
      await vote(args[0]);
      break;

    case "validateVote":
      if (args.length !== 2) {
        console.error(
          "Usage: node interact.js validateVote <voterAddress> <backendKey>"
        );
        return;
      }
      await validateVote(args[0], args[1]);
      break;

    case "startElection":
      await startElection();
      break;

    case "endElection":
      await endElection();
      break;

    case "resetElection":
      await resetElection();
      break;

    case "getCandidate":
      if (args.length !== 1) {
        console.error(
          "Usage: node interact.js getCandidate <candidateAddress>"
        );
        return;
      }
      await getCandidate(args[0]);
      break;

    case "getVoterInfo":
      if (args.length !== 1) {
        console.error("Usage: node interact.js getVoterInfo <voterAddress>");
        return;
      }
      await getVoterInfo(args[0]);
      break;

    case "getTotalVotes":
      await getTotalVotes();
      break;

    case "getAllCandidates":
      await getAllCandidates();
      break;

    case "getAllVoters":
      await getAllVoters();
      break;

    case "selfDestruct":
      await selfDestruct();
      break;

    default:
      console.log("Available operations:");
      console.log("  addCandidate <candidateAddress> <candidateName>");
      console.log("  deleteCandidate <candidateAddress>");
      console.log("  addVoter <voterAddress>");
      console.log("  vote <candidateAddress>");
      console.log("  validateVote <voterAddress> <backendKey>");
      console.log("  startElection");
      console.log("  endElection");
      console.log("  resetElection");
      console.log("  getCandidate <candidateAddress>");
      console.log("  getVoterInfo <voterAddress>");
      console.log("  getTotalVotes");
      console.log("  getAllCandidates");
      console.log("  getAllVoters");
      console.log("  selfDestruct");
      break;
  }
};

// Run the main function

async function run() {
  console.log(await getVoterInfo(voterWallet.address));
}
run();
main();
