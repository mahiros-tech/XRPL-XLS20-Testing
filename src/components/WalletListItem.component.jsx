import React from 'react';

const WalletListItem = ({ wallet }) => {
  console.log('>> WalletListItem component rendered <<')

  return (
    <li style={{ display: 'flex', flexDirection: 'column', margin: '25px' }}>
      <h1>WalletListItem component</h1>
      <span className='balance'><b>balance:</b> {wallet.balance}</span>
      <span className='wallet-classic-address'><b>classicAddress:</b> {wallet.wallet.classicAddress}</span>
      <span className='wallet-private-key'><b>privateKey:</b> {wallet.wallet.privateKey}</span>
      <span className='wallet-public-key'><b>publicKey:</b> {wallet.wallet.publicKey}</span>
      <span className='wallet-seed'><b>seed:</b> {wallet.wallet.seed}</span>
    </li>
  );
};

export default WalletListItem