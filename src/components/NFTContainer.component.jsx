import React, { useEffect, useState } from 'react';

const NFTContainer = ({ xrpl }) => {
  // State to hold connection to xls 20 developer network
  const [xls20ClientState, setXls20ClientState] = useState(null);



  const connectToXls20Network = async () => {
    const client = new xrpl.Client("wss://xls20-sandbox.rippletest.net:51233");
    await client.connect();

    setXls20ClientState(client);
  };

  return (
    <div
      className='nft-container-component'
      style={{ outline: '5px solid black', padding: '25px', marginTop: '1em' }}
    >
      <h1>NFTContainer component</h1>
      <div
        className='mint'
        style={{ display: 'flex', flexDirection: 'column' }}
      >
        <div
          className='input'
          style={{ display: 'flex', flexDirection: 'column' }}
        >
          <h2>(STEP 1) Connect to wss://xls20-sandbox.rippletest.net:51233</h2>
          <span style={{ marginBottom: '25px' }}>Note: not an important step, but included to be used as a reminder that xls 20 functionality has its own network for testing for the time being.</span>
          <span style={{ marginBottom: '25px' }}><b>Status</b>: {xls20ClientState ? 'Connected' : 'Not Connected'}</span>
          <button onClick={connectToXls20Network}>CONNECT TO THE XLS20 DEVELOPER NETWORK</button>

          <h2>(STEP 2) Specify Seed/Secret of Wallet to use for the NFTokenMint Transaction</h2>
          <input placeholder='Seed/Secret' />


          <h2>(STEP 2) Prepare Transaction Blob</h2>
          <input placeholder='TransactionType' />
          <input placeholder='Account' />
          <input placeholder='URI' />
          <input placeholder='Flags' />
          <input placeholder='TokenTaxon' />

        </div>

      </div>
    </div>
  );
};

export default NFTContainer;