let web3;
let contract;

// 1. MANUALLY UPDATE THESE AFTER RE-DEPLOYING IN REMIX
const contractAddress = "0xeDd0F8568f175DAeC261Dfec025FebE4D29Ff912"; 
const abi = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{ "internalType": "address", "name": "_agent", "type": "address" }
		],
		"name": "addAgent",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{ "internalType": "string", "name": "_name", "type": "string" },
			{ "internalType": "string", "name": "_origin", "type": "string" },
			{ "internalType": "string", "name": "_metadataURI", "type": "string" }
		],
		"name": "addProduct",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{ "internalType": "uint256", "name": "_id", "type": "uint256" },
			{ "internalType": "string", "name": "_status", "type": "string" }
		],
		"name": "addTracking",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{ "internalType": "address", "name": "", "type": "address" }
		],
		"name": "authorizedAgents",
		"outputs": [
			{ "internalType": "bool", "name": "", "type": "bool" }
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{ "internalType": "uint256", "name": "_id", "type": "uint256" }
		],
		"name": "getHistory",
		"outputs": [
			{
				"components": [
					{ "internalType": "string", "name": "status", "type": "string" },
					{ "internalType": "uint256", "name": "timestamp", "type": "uint256" },
					{ "internalType": "address", "name": "updatedBy", "type": "address" }
				],
				"internalType": "struct FoodTraceability.Track[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{ "internalType": "address", "name": "", "type": "address" }
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "productCount",
		"outputs": [
			{ "internalType": "uint256", "name": "", "type": "uint256" }
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{ "internalType": "uint256", "name": "", "type": "uint256" }
		],
		"name": "products",
		"outputs": [
			{ "internalType": "uint256", "name": "id", "type": "uint256" },
			{ "internalType": "string", "name": "name", "type": "string" },
			{ "internalType": "string", "name": "origin", "type": "string" },
			{ "internalType": "string", "name": "metadataURI", "type": "string" },
			{ "internalType": "address", "name": "createdBy", "type": "address" }
		],
		"stateMutability": "view",
		"type": "function"
	}
  ];

async function connectWallet() {
    // Check if MetaMask is installed
    if (typeof window.ethereum !== 'undefined') {
        try {
            // Request account access
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const user = accounts[0];

            // Initialize Web3
            web3 = new Web3(window.ethereum);
            
            // Initialize Contract
            contract = new web3.eth.Contract(abi, contractAddress);

            // Update UI Wallet Button
            document.getElementById("walletBtn").innerText = user.substring(0, 6) + "..." + user.substring(user.length - 4);

            // --- ROLE CHECKING LOGIC ---
            // We wrap these in a try-catch in case the contract isn't deployed correctly
            try {
                const owner = await contract.methods.owner().call();
                const isAgent = await contract.methods.authorizedAgents(user).call(); 

                const dashboard = document.getElementById("agentDash");
                const statusLabel = document.getElementById("roleStatus");

                if (user.toLowerCase() === owner.toLowerCase()) {
                    dashboard.classList.remove("hidden");
                    statusLabel.innerText = "Mode: Administrator";
                } else if (isAgent) {
                    dashboard.classList.remove("hidden");
                    statusLabel.innerText = "Mode: Authorized Agent";
                } else {
                    statusLabel.innerText = "Mode: Consumer (View Only)";
                    dashboard.classList.add("hidden");
                }
            } catch (err) {
                console.error("Contract call failed. Is the Address/ABI correct?", err);
                document.getElementById("roleStatus").innerText = "Error: Contract not found";
            }

            startScanner();
        } catch (error) {
            console.error("Connection rejected", error);
        }
    } else {
        alert("Please install MetaMask!");
    }
}

// REST OF YOUR FUNCTIONS (addProduct, addTracking, etc.)
async function addProduct() {
    const name = document.getElementById("name").value;
    const origin = document.getElementById("origin").value;
    const meta = document.getElementById("metadata").value || "N/A";
    const accounts = await web3.eth.getAccounts();
    
    await contract.methods.addProduct(name, origin, meta).send({ from: accounts[0] });
    alert("Product added to Blockchain!");
}

async function addTracking() {
    const id = document.getElementById("updateId").value;
    const status = document.getElementById("status").value;
    const accounts = await web3.eth.getAccounts();
    
    await contract.methods.addTracking(id, status).send({ from: accounts[0] });
    alert("Tracking Updated!");
}

async function getHistory() {
    const id = document.getElementById("viewId").value;
    const container = document.getElementById("timelineContainer");
    const data = await contract.methods.getHistory(id).call();
    
    container.innerHTML = "";
    data.forEach(step => {
        container.innerHTML += `
            <div class="step">
                <strong>${step.status}</strong><br>
                <small>${new Date(step.timestamp * 1000).toLocaleString()}</small>
            </div>`;
    });
}

function startScanner() {
    // Scanner logic remains the same
    const scanner = new Html5QrcodeScanner("qr-reader", { fps: 10, qrbox: 250 });
    scanner.render((decodedText) => {
        const url = new URL(decodedText);
        const id = url.searchParams.get("id");
        document.getElementById("viewId").value = id;
        getHistory();
        scanner.clear();
    });
}

// Refresh page if user switches MetaMask accounts
if (window.ethereum) {
    window.ethereum.on('accountsChanged', () => window.location.reload());
}