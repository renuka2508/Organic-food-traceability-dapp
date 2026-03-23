// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FoodTraceability {

    struct Product {
        uint id;
        string name;
        string origin;
        address createdBy;  
    }

    struct Track {
        string status;
        uint timestamp;
        address updatedBy;
    }

    uint public productCount;

    mapping(uint => Product) public products;
    mapping(uint => Track[]) public productHistory;

    // Add new product
    function addProduct(string memory _name, string memory _origin) public {
        productCount++;

        products[productCount] = Product(
            productCount,
            _name,
            _origin,
            msg.sender
        );
    }

    // Add tracking step
    function addTracking(uint _id, string memory _status) public {
        require(_id > 0 && _id <= productCount, "Invalid product ID");

        productHistory[_id].push(Track(
            _status,
            block.timestamp,
            msg.sender
        ));
    }

    // Get full history
    function getHistory(uint _id) public view returns (Track[] memory) {
        return productHistory[_id];
    }

    // Get product details
    function getProduct(uint _id) public view returns (Product memory) {
        return products[_id];
    }
}