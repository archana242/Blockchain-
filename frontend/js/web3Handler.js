let provider;
let signer;
let contract;

async function connectWallet() {
  if (window.ethereum) {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
    contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
    return signer.getAddress();
  } else {
    alert("Install MetaMask to use this app.");
  }
}
