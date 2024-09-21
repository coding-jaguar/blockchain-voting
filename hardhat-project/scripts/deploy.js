const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance));

  const backendKey = ethers.toUtf8Bytes("secret");
  console.log("Backend key:", backendKey);

  const Voting = await ethers.getContractFactory("Voting");
  const voting = await Voting.deploy(backendKey);

  await voting.waitForDeployment();

  console.log("Voting contract deployed to:", await voting.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
