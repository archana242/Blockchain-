// utils/contract.js
const { ethers } = require('ethers');
require('dotenv').config();
const contractABI = require('../abi/voting.json'); // Ensure ABI is correct

// Debug logs to verify environment variables
console.log("Loaded Contract Address:", process.env.CONTRACT_ADDRESS);
console.log("Loaded RPC URL:", process.env.NETWORK_RPC);
console.log("Loaded Private Key (first 5 chars):", process.env.PRIVATE_KEY ? process.env.PRIVATE_KEY.slice(0, 5) + "..." : "NOT FOUND");

// Validate required env vars
if (!process.env.CONTRACT_ADDRESS) {
    throw new Error("❌ CONTRACT_ADDRESS not found in .env file");
}
if (!process.env.NETWORK_RPC) {
    throw new Error("❌ NETWORK_RPC not found in .env file");
}
if (!process.env.PRIVATE_KEY) {
    throw new Error("❌ PRIVATE_KEY not found in .env file");
}

// Setup provider, signer, and contract instance
const provider = new ethers.JsonRpcProvider(process.env.NETWORK_RPC);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, contractABI, signer);

module.exports = contract;
