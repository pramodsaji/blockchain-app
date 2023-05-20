import React, { useState, useEffect } from "react";
import Web3 from "web3";
import DataStorageContract from "./contracts/DataStorageContract.json";

function App() {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [data, setData] = useState("");

  var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));

  var contract = null;
  useEffect(() => {
    loadBlockchainData();
  }, []);

  // You can now interact with the contract methods
  // For example, to call the getData function:
  const getDataFromContract = async () => {
    try {
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = DataStorageContract.networks[networkId];

      contract = new web3.eth.Contract(
        DataStorageContract.abi,
        deployedNetwork && deployedNetwork.address
      );
      if (id !== "") {
        const result = await contract.methods.getData(id).call();
        setData(result);
      }
    } catch (error) {
      console.error("Error retrieving data:", error);
    }
  };

  const loadBlockchainData = async () => {
    try {
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = DataStorageContract.networks[networkId];

      contract = new web3.eth.Contract(
        DataStorageContract.abi,
        deployedNetwork && deployedNetwork.address
      );

      getDataFromContract();
    } catch (error) {
      console.error("Error loading blockchain data:", error);
    }
  };

  const handleAddData = async () => {
    try {
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = DataStorageContract.networks[networkId];

      const contract = new web3.eth.Contract(
        DataStorageContract.abi,
        deployedNetwork && deployedNetwork.address
      );

      await contract.methods
        .addData(id, name)
        .send({ from: web3.eth.defaultAccount });
    } catch (error) {
      console.error("Error adding data:", error);
    }
  };

  const handleGetData = () => {
    // Call the getDataFromContract function or any other method to retrieve data
    getDataFromContract();
  };

  return (
    <div className="App">
      <h1>Data Storage App</h1>
      <div>
        <label>ID:</label>
        <input
          type="number"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
      </div>
      <div>
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <button onClick={handleAddData}>Add Data</button>
      <button onClick={handleGetData}>Get Data</button>
      {data && (
        <div>
          <p>
            Data: ID - {data[0]}, Name - {data[1]}
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
