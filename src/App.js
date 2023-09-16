import { Alchemy, Network } from 'alchemy-sdk';
import { useEffect, useState } from 'react';

import './App.css';

// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.
const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};


// In this week's lessons we used ethers.js. Here we are using the
// Alchemy SDK is an umbrella library with several different packages.
//
// You can read more about the packages here:
//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
const alchemy = new Alchemy(settings);

function App() {
  const [blockNumber, setBlockNumber] = useState();
  const [blockTimestamp, setBlockTimestamp] = useState();
  const [blockDifficulty, setBlockDifficulty] = useState();
  const [blockTransactions, setBlockTransactions] = useState();

  function truncateHash(hash){
    if (hash) {
      return hash.slice(0, 6) + "..." + hash.slice(-4);
    }
    return "";
  }

  useEffect(() => {
    async function getBlockNumber() {
      setBlockNumber(await alchemy.core.getBlockNumber());

      if (blockNumber) {
        let data = await alchemy.core.getBlock(blockNumber);
        setBlockTimestamp(data.timestamp);
        setBlockDifficulty(data.difficulty);

        console.log("request");

        let transactionsData = await alchemy.core.getBlockWithTransactions(blockNumber);
        setBlockTransactions(transactionsData.transactions)

        console.log(blockTransactions)

      }

    }

    getBlockNumber();
  });

  return <div className="App">
    <p>Block Number: {blockNumber}</p>
    <p>Block Difficulty: {blockDifficulty}</p>
    <p>Block Timestamp: {blockTimestamp}</p>
    <br></br>
    <p>Number of transactions: {blockTransactions ? blockTransactions.length : "undefined"}</p>

    <hr></hr>

    <table>
      <thead>
        <tr>
          <th>TX hash</th>
          <th>Block hash</th>
          <th>From</th>
          <th>To</th>
          <th>Data</th>
        </tr>
      </thead>
      <tbody>
        {blockTransactions && (blockTransactions.map((transaction, index) => 
          <tr id={ index }>
            <td>{ truncateHash(transaction.hash) }</td>
            <td>{ truncateHash(transaction.blockHash) }</td>
            <td>{ truncateHash(transaction.from) }</td>
            <td>{ truncateHash(transaction.to) }</td>
            <td>{ transaction.data }</td>
          </tr>
        ))}
      </tbody>
    </table>    

  </div>;
}

export default App;
