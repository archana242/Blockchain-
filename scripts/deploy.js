const hre = require("hardhat");

async function main() {
  const MyContractFactory= await hre.ethers.getContractFactory("MyContract");
  const mycontract = await MyContractFactory.deploy();
  await mycontract.deployed();

  console.log("EVoting contract deployed at:", mycontract.address);
}

main().catch((error) => {
  console.error("❌ Error in deployment:", error);
  process.exitCode = 1;
});
