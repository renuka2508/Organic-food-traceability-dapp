let web3;
let contract;

// 🔴 CONFIGURATION
const contractAddress = "0xfb7Db33505e76b13C804523831103c8236fA60E7";
const agentAddress = "0x43261D8009F7A13E1E0498A0F644226DfAf326cb".toLowerCase();

const abi = [
    {
        "inputs": [{ "internalType": "string", "name": "_name", "type": "string" },{ "internalType": "string", "name": "_origin", "type": "string" }],
        "name": "addProduct", "outputs": [], "stateMutability": "nonpayable", "type": "function"
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "_id", "type": "uint256" },{ "internalType": "string", "name": "_status", "type": "string" }],
        "name": "addTracking", "outputs": [], "stateMutability": "nonpayable", "type": "function"
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "_id", "type": "uint256" }],
        "name": "getHistory",
        "outputs": [{
            "components": [
                { "internalType": "string", "name": "status", "type": "string" },
                { "internalType": "uint256", "name": "timestamp", "type": "uint256" },
                { "internalType": "address", "name": "updatedBy", "type": "address" }
            ],
            "internalType": "struct FoodTraceability.Track[]", "name": "", "type": "tuple[]"
        }],
        "stateMutability": "view", "type": "function"
    }
];

// --- CORE LOGIC ---

async function connectWallet() {
    if (window.ethereum) {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            web3 = new Web3(window.ethereum);
            contract = new web3.eth.Contract(abi, contractAddress);
            const userAccount = accounts[0].toLowerCase();
            
            document.getElementById("walletBtn").innerText = userAccount.substring(0, 6) + "..." + userAccount.slice(-4);
            
            if (userAccount === agentAddress) {
                document.getElementById("agentDash").classList.remove("hidden");
                document.getElementById("roleStatus").innerHTML = "🛡️ Authenticated: Agent";
            } else {
                document.getElementById("roleStatus").innerHTML = "👤 Public View: Consumer";
            }
            document.getElementById("customerDash").classList.remove("hidden");
            
            // Check if there is an ID in the URL to auto-load
            checkUrlParams();
            
        } catch (error) { alert("Connect Failed!"); }
    } else { alert("Install MetaMask!"); }
}

async function addProduct() {
    const btn = document.getElementById("regBtn");
    const name = document.getElementById("name").value;
    const origin = document.getElementById("origin").value;
    if(!name || !origin) return alert("Fill fields");

    try {
        btn.innerText = "Syncing...";
        const accounts = await web3.eth.getAccounts();
        await contract.methods.addProduct(name, origin).send({ from: accounts[0] });
        alert("Product Registered!");
        
        // Ask to generate QR
        const id = prompt("Enter the numeric ID you assigned to this product to generate a QR");
        if(id) {
            generateQRCode(id);
        }
    } catch (e) { 
        alert("Transaction failed"); 
    }
    btn.innerText = "Register";
}

function generateQRCode(productId) {
    const qrContainer = document.getElementById("qrcode");
    const qrResultDiv = document.getElementById("qr-result");

    if (qrResultDiv) { qrResultDiv.style.display = "flex"; }
    qrContainer.innerHTML = "";

    new QRCode(qrContainer, {
        
        text: "https://renuka2508.github.io/Organic-food-traceability-dapp/?id=" + productId,
        width: 128,
        height: 128,
        colorDark : "#000000",
        colorLight : "#ffffff"
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
        generateQRCode(id); // Update QR display
    } catch (e) { alert("Update failed"); }
}

async function getHistory() {
    const id = document.getElementById("viewId").value;
    const container = document.getElementById("timelineContainer");
    if(!id) return;

    try {
        container.innerHTML = "Accessing Blockchain...";
        const data = await contract.methods.getHistory(id).call();
        container.innerHTML = "";

        if(data.length === 0) {
            container.innerHTML = "No records found.";
            return;
        }

        data.forEach((step, index) => {
            const date = new Date(step.timestamp * 1000).toLocaleString();
            container.innerHTML += `
                <div class="step">
                    <div class="step-status">Step ${index + 1}: ${step.status}</div>
                    <div class="step-meta">📅 ${date}<br>👤 Verified by: ${step.updatedBy.substring(0,12)}...</div>
                </div>`;
        });
    } catch (e) { container.innerHTML = "Error fetching data."; }
}

function checkUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (id) {
        document.getElementById("viewId").value = id;
        getHistory();
    }
}