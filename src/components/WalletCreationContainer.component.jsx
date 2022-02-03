import React, { useEffect, useState } from 'react';

// Components
import WalletList from './WalletList.component';

const WalletCreationContainer = ({ xrplClient, walletsState, setWalletsState }) => {
  console.log('>> WalletCreationContainer component rendered <<');

  const createFundedWallet = () => {
    xrplClient.fundWallet()
      .then((response) => {
        setWalletsState((prev) => [...prev, response]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    console.log(walletsState);
  }, [walletsState]);

  return (
    <div
      className='wallet-creation-container-component'
      style={{ outline: '5px solid black', padding: '25px' }}
    >
      <h1>WalletCreationContainer component</h1>
      <button onClick={createFundedWallet}>Create Funded Wallet</button>
      <div className='wallet-list-component-container'>
        <WalletList wallets={walletsState} />
      </div>
    </div>
  );
};

export default WalletCreationContainer;