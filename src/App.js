import React, { useState, useEffect } from "react";
import Web3 from "web3";
import DocumentVerificationContract from "./contracts/DocumentVerificationContract.json";
import { SHA256 } from 'crypto-js';
import './App.css';

function App() {

  const [name, setName] = useState("");
  const [data, setData] = useState("");

  const [file, setFile] = useState();
  const [sid, setSID] = useState('');
  const [address, setAddress] = useState('');

  var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));

  const handleSIDChange = (event) => {
    setSID(event.target.value);
  };

  function handleFile(event) {
    setFile(event.target.files[0]);
  }

  var contract = null;
  // useEffect(() => {
  //   loadBlockchainData();
  // }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Perform form validation
      if (!validateSID(sid)) {
        alert('Please enter a valid SID.');
        return;
      }



      // Generate hash of sid and file content together
      const combinedData = `${sid}${getFileContent()}`;
      const hash = SHA256(combinedData).toString();

      const networkId = await web3.eth.net.getId();
      const deployedNetwork = DocumentVerificationContract.networks[networkId];

      contract = new web3.eth.Contract(
        DocumentVerificationContract.abi,
        deployedNetwork && deployedNetwork.address
      );
        console.log(hash);
        console.log(address);
      const result = await contract.methods.submitDocument(hash, address).send({ from: "0x35219cb510424B83b1f37640C93802Aa536B9915",
      gas: '1000000' });
      console.log(result);
    } catch (error) {
      console.error("Error retrieving data:", error);
    }


  };

  const validateSID = (sid) => {
    // SID validation: Must be a positive number
    const sidNumber = parseFloat(sid);
    return !isNaN(sidNumber) && sidNumber > 0;
  };

  function getFileContent() {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error('No file selected.'));
      }

      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        const fileContent = e.target.result;
        resolve(fileContent);
      };
      fileReader.onerror = (e) => {
        reject(new Error('Error reading the file.'));
      };
      fileReader.readAsText(file);
    });
  };

  const handleUpload = async () => {
    const combinedData = `${sid}${getFileContent()}`;
    const hash = SHA256(combinedData).toString();

    const networkId = await web3.eth.net.getId();
    const deployedNetwork = DocumentVerificationContract.networks[networkId];

    contract = new web3.eth.Contract(
      DocumentVerificationContract.abi,
      deployedNetwork && deployedNetwork.address
    );

    console.log('hash + ' + hash);

    const result = await contract.methods.verifyDocument(hash).call();
    console.log('hi'+ result);
  }


return (
  <div className="container">
    <div className="sub-container">
      <h2>Student Information</h2>
      {/* <form onSubmit={handleSubmit}> */}

        <div className="form-group">
          <label htmlFor="sid">SID:</label>
          <input type="text" id="sid" name="sid" value={sid} onChange={handleSIDChange} />
        </div>

        <div className="form-group">
          <label htmlFor="address">Address:</label>
          <select id="address" name="address" value={address} onChange={(e) => setAddress(e.target.value)}>
            <option value="">Select an address</option>
            <option value="0x3e0604a8429bA70C19a7a5c728662dABe1F0969B">0x3e0604a8429bA70C19a7a5c728662dABe1F0969B</option>
            <option value="0x82dAf97698cD8C022fD93FBC27ea3bF926A8CCa2">Address 2</option>
            <option value="Address 3">Address 3</option>
          </select>
          <input type="file" name="file" onChange={handleFile} className="file-input" />
        </div>

        <div className="login-button">
          <button type="submit" onClick={handleSubmit}>Submit</button>
        </div>

      {/* </form> */}

      <div>
        <h2>Verify File</h2>
        {/* <form onClick={handleUpload}> */}
          <input type="file" name="file" onChange={handleFile} className="file-input2" />
          <div className="login-button">
            <button onClick={handleUpload}>Verify</button>
          </div>
        {/* </form> */}
      </div>


    </div>



  </div>


)
}
export default App;
