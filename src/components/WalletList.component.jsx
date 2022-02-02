import React from 'react';

// Components
import WalletListItem from './WalletListItem.component';

const WalletList = ({ wallets }) => {
  console.log('>> WalletList component rendered <<');

  return (
    <div
      className='wallet-list-component'
      style={{ outline: '5px solid grey', display: 'flex', flexDirection: 'column', padding: '25px' }}
    >
      <h1>WalletList component</h1>
      <ul>
        {wallets.map((wallet) => <WalletListItem key={wallet.wallet.classicAddress} wallet={wallet} />)}
      </ul>
    </div>
  );
};

export default WalletList;