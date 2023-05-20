// SPDX-License-Identifier: GPL-3.0
// Specifies that the source code is for a version
pragma solidity ^0.8.0;

contract DocumentVerification {
    struct Document {
        address studentAddress;
        bool revoked;
    }

    mapping(string => Document) public documents;
    mapping(address => string[]) public studentDocuments;

    function submitDocument(string memory documentHash, address studentAddress) public {
        // Check if the document hash already exists
        require(!documentExists(documentHash), "Document hash already exists");

        // Create a new document and store it in the mapping
        Document memory newDocument = Document({
            studentAddress: studentAddress,
            revoked: false
        });
        documents[documentHash] = newDocument;

        // Associate the document hash with the student address
        studentDocuments[studentAddress].push(documentHash);
    }

    function updateDocument(string memory documentHash, string memory updateHash) public {
        require(documentExists(documentHash), "Document hash does not exists");
        require(!documentExists(updateHash), "Updated document hash already exists");
        
        address studentAddress = documents[documentHash].studentAddress;

        revokeDocument(documentHash, true);

        Document memory newDocument = Document({
            studentAddress: studentAddress,
            revoked: false
        });

        documents[updateHash] = newDocument;
        studentDocuments[studentAddress].push(updateHash);
    }

    function revokeDocument(string memory documentHash, bool revoked) public {
        require(documentExists(documentHash), "Document hash does not exists");

        documents[documentHash].revoked = revoked;
    }

    function verifyDocument(string memory documentHash) public view returns (bool) {
        return documentExists(documentHash) && documents[documentHash].revoked == false;
    }

    function documentExists(string memory documentHash) internal view returns (bool) {
        return documents[documentHash].studentAddress != address(0x0);
    }

    function getStudentsDocs(address studentAddress) public view returns (string[] memory) {
        return studentDocuments[studentAddress];
    }

    function findElementInArray(string memory element, string[] memory arr) internal pure returns(uint index) {
        for (uint i = 0 ; i < arr.length; i++) {
            if (keccak256(abi.encode(arr[i])) == keccak256(abi.encode(element))) {
                return i;
            }
        }
    }
}

