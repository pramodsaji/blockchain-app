import React, { useState } from "react";
import Web3 from "web3";
import DocumentVerificationContract from "./contracts/DocumentVerificationContract.json";
import { SHA256 } from "crypto-js";
import "./App.css";

function App() {
  const [file, setFile] = useState();
  const [sid, setSID] = useState("");
  const [address, setAddress] = useState("");

  var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

  const handleSIDChange = (event) => {
    setSID(event.target.value);
  };

  function handleFile(event) {
    setFile(event.target.files[0]);
  }

  var contract = null;

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Perform form validation
      if (!validateSID(sid)) {
        alert("Please enter a valid SID.");
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

      const result = await contract.methods.submitDocument(hash, address).send({
        from: "0xccF291212506dd01901fA6957B9254a74c290507",
        gas: "1000000",
      });
      if (result.transactionHash) alert("Document added successfully");
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
        reject(new Error("No file selected."));
      }

      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        const fileContent = e.target.result;
        resolve(fileContent);
      };
      fileReader.onerror = (e) => {
        reject(new Error("Error reading the file."));
      };
      fileReader.readAsText(file);
    });
  }

  const handleUpload = async () => {
    const combinedData = `${sid}${getFileContent()}`;
    const hash = SHA256(combinedData).toString();

    const networkId = await web3.eth.net.getId();
    const deployedNetwork = DocumentVerificationContract.networks[networkId];

    contract = new web3.eth.Contract(
      DocumentVerificationContract.abi,
      deployedNetwork && deployedNetwork.address
    );
    const result = await contract.methods.verifyDocument(hash).call();
    alert(result);
    if (result) alert("Document is available and verified");
    else alert("Document is not available");
  };

  return (
    <div className="container">
      <div className="sub-container">
        <h2>EduDoc Chain</h2>

        <div className="form-group">
          <table>
            <tbody>
              <tr>
                <td>
                  <label htmlFor="sid">SID:</label>
                </td>
                <td>
                  <input
                    type="text"
                    id="sid"
                    name="sid"
                    value={sid}
                    onChange={handleSIDChange}
                  />
                </td>
              </tr>

              <tr>
                <td>
                  <label htmlFor="address">Address:</label>
                </td>
                <td>
                  <select
                    id="address"
                    name="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  >
                    <option value="">Select an address</option>
                    <option value="0x514cb49891A27EFE69412BE238573611A6aE21aD">
                      0x514cb49891A27EFE69412BE238573611A6aE21aD
                    </option>
                    <option value="0x012485F318f5987c700344550061111615d7f8b1">
                      0x012485F318f5987c700344550061111615d7f8b1
                    </option>
                    <option value="0xA50AB4b907220830431CECE5A9Fe3a187c713bd2">
                      0xA50AB4b907220830431CECE5A9Fe3a187c713bd2
                    </option>
                  </select>
                </td>
              </tr>

              <tr>
                <td>
                  <label htmlFor="address">Document:</label>
                </td>
                <td>
                  <input
                    type="file"
                    name="file"
                    onChange={handleFile}
                    className="file-input"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="login-button">
          <button type="submit" onClick={handleSubmit}>
            Submit
          </button>
        </div>

        <div>
          <div className="login-button">
            <button onClick={handleUpload}>Verify</button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default App;
