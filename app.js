let web3;
let contract;

// 🔴 UPDATE THESE TWO AFTER DEPLOYING IN REMIX
const contractAddress = "0x34f09Bc3e1E8E64A0B2FBe5CFc3c9FF90Db4705f";
const agentAddress = "0xCf61Dc3fc0c6ac3ec9B822EFCf006657CB2b0F30".toLowerCase();

const abi = [ 
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_origin",
				"type": "string"
			}
		],
		"name": "addProduct",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_status",
				"type": "string"
			}
		],
		"name": "addTracking",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			}
		],
		"name": "getHistory",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "status",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "timestamp",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "updatedBy",
						"type": "address"
					}
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
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			}
		],
		"name": "getProduct",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "id",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "name",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "origin",
						"type": "string"
					},
					{
						"internalType": "address",
						"name": "createdBy",
						"type": "address"
					}
				],
				"internalType": "struct FoodTraceability.Product",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "productCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "productHistory",
		"outputs": [
			{
				"internalType": "string",
				"name": "status",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "updatedBy",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "products",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "origin",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "createdBy",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
 ];

async function connectWallet() {
    if (window.ethereum) {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            web3 = new Web3(window.ethereum);
            contract = new web3.eth.Contract(abi, contractAddress);
            const userAccount = accounts[0].toLowerCase();
            
            document.getElementById("walletBtn").innerText = userAccount.substring(0, 6) + "..." + userAccount.slice(-4);
            
            if (userAccount === agentAddress) {
                document.getElementById("roleStatus").innerHTML = "🛡️ Authenticated: Agent";
            } else {
                document.getElementById("roleStatus").innerHTML = "👤 Public View: Consumer";
            }
            
            startScanner();
            checkUrlParams();
            
        } catch (error) { console.error(error); alert("Connection Failed!"); }
    } else { alert("Please install MetaMask!"); }
}

async function addProduct() {
    const name = document.getElementById("name").value;
    const origin = document.getElementById("origin").value;
    if(!name || !origin) return alert("Please fill fields");

    try {
        const accounts = await web3.eth.getAccounts();
        await contract.methods.addProduct(name, origin).send({ from: accounts[0] });
        alert("Success! Product added.");
        
        const id = prompt("Enter the Product ID assigned by the contract to see the QR:");
        if(id) generateQRCode(id);
    } catch (e) { alert("Fail: Check if you are the authorized Agent."); }
}

function generateQRCode(productId) {
    const qrContainer = document.getElementById("qrcode");
    const qrResultDiv = document.getElementById("qr-result");
    
    qrResultDiv.style.display = "block";
    document.getElementById("displayID").innerText = productId;
    qrContainer.innerHTML = "";

    new QRCode(qrContainer, {
        text: window.location.origin + window.location.pathname + "?id=" + productId,
        width: 128,
        height: 128
    });
}

async function addTracking() {
    const id = document.getElementById("id").value;
    const status = document.getElementById("status").value;
    if(!id || !status) return alert("Fill fields");

    try {
        const accounts = await web3.eth.getAccounts();
        await contract.methods.addTracking(id, status).send({ from: accounts[0] });
        alert("Status Updated!");
    } catch (e) { alert("Update failed."); }
}

async function getHistory() {
    const id = document.getElementById("viewId").value;
    const container = document.getElementById("timelineContainer");
    if(!id) return;

    try {
        container.innerHTML = "Fetching...";
        const data = await contract.methods.getHistory(id).call();
        container.innerHTML = "";

        if(data.length === 0) {
            container.innerHTML = "No history found.";
            return;
        }

        data.forEach((step, index) => {
            const date = new Date(Number(step.timestamp) * 1000).toLocaleString();
            container.innerHTML += `
                <p><strong>Step ${index + 1}: ${step.status}</strong><br>
                Date: ${date}<br>
                By: ${step.updatedBy}</p><hr>`;
        });
    } catch (e) { container.innerHTML = "ID not found on blockchain."; }
}

function startScanner() {
    const scanner = new Html5QrcodeScanner("qr-reader", { fps: 10, qrbox: 250 });
    scanner.render((decodedText) => {
        const url = new URL(decodedText);
        const id = url.searchParams.get("id");
        if(id) {
            document.getElementById("viewId").value = id;
            getHistory();
            scanner.clear();
        }
    });
}

function checkUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (id) {
        document.getElementById("viewId").value = id;
        getHistory();
    }
}

if (window.ethereum) {
    window.ethereum.on('accountsChanged', () => window.location.reload());
}

