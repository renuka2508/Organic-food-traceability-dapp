
---

# 🌱 EcoTrack – Blockchain-Based Food Traceability DApp

EcoTrack is a **decentralized blockchain application** that enables transparent and tamper-proof tracking of organic food products from origin to consumer.
It uses **Ethereum smart contracts**, **MetaMask**, and **QR codes** to ensure authenticity, trust, and supply-chain transparency.

---

## 🚀 Features

### 🛡️ Agent (Authorized User)

* Register food products on the blockchain
* Update logistics and supply chain status
* Generate QR codes for product verification
* All updates are immutable and verifiable

### 👤 Consumer (Public User)

* Verify product journey using Product ID or QR code
* View complete tracking timeline
* Check timestamps and wallet addresses of updates

---

## 🧱 Tech Stack

* **Frontend**: HTML, CSS, JavaScript
* **Blockchain**: Solidity (Ethereum)
* **Web3**: Web3.js
* **Wallet**: MetaMask
* **QR Code**: qrcode.js
* **Deployment**: GitHub Pages, Ethereum Test Network

---

## 📁 Project Structure

```
EcoTrack/
│
├── index.html              # Frontend UI
├── app.js                  # Web3 & smart contract interaction
├── FoodTraceability.sol    # Solidity smart contract
├── README.md               # Project documentation
```

---

## 🔐 Smart Contract Overview

### Contract Name: `FoodTraceability`

### Components

* **Product Struct** – Stores product ID, name, origin, creator
* **Track Struct** – Stores status, timestamp, updater address

### Functions

* `addProduct()` – Register a new product
* `addTracking()` – Add logistics/status updates
* `getHistory()` – Retrieve full product journey
* `getProduct()` – Get product details

All records are **secure, transparent, and immutable** on the blockchain.

---

## 🔑 Role-Based Access

* Agent wallet address is predefined in `app.js`
* If connected MetaMask wallet matches agent address → **Agent Dashboard**
* Other users automatically get **Consumer View**

---

## 🧪 How to Run the Project

### 1️⃣ Requirements

* MetaMask browser extension
* Ethereum test network (Ganache / Sepolia)
* Modern web browser

### 2️⃣ Clone Repository

```bash
git clone https://github.com/renuka2508/EcoTrack.git
cd EcoTrack
```

### 3️⃣ Update Contract Address

In `app.js`, update:

```javascript
const contractAddress = "xfb7Db33505e76b13C804523831103c8236fA60E7";
```

### 4️⃣ Run Application

* Open `index.html` in browser
* OR deploy frontend using GitHub Pages



## 🔍 Application Flow

1. Agent connects MetaMask
2. Registers product on blockchain
3. Adds supply-chain status updates
4. QR code is generated with Product ID
5. Consumer scans QR or enters Product ID
6. Blockchain returns verified journey



## 🎯 Use Cases

* Organic food traceability
* Supply chain transparency
* Product authenticity verification
* Anti-counterfeit systems



## 🛠️ Future Enhancements

* IPFS integration for certificates
* Multiple roles (Farmer, Transporter, Retailer)
* Mobile-responsive UI
* NFT-based product identity








