// Dependencies
import React, { useState } from 'react';

// Components
import WalletCreationContainer from './components/WalletCreationContainer.component';
import NFTContainer from './components/NFTContainer.component';
import XRPSendingContainer from './components/XRPSendingContainer.component';
import QueryContainer from './components/QueryContainer.component';

const App = ({ xrplClient, xrpl }) => {
  console.log('>> App component rendered <<');

  const [walletsState, setWalletsState] = useState([]);

  return (
    <div className="App">
      <WalletCreationContainer xrplClient={xrplClient} walletsState={walletsState} setWalletsState={setWalletsState} />
      {/* <NFTContainer xrpl={xrpl} walletsState={walletsState} setWalletsState={setWalletsState} /> */}
      <XRPSendingContainer xrplClient={xrplClient} xrpl={xrpl} walletsState={walletsState} setWalletsState={setWalletsState} />
      <QueryContainer xrplClient={xrplClient} />
    </div>
  );
};

export default App;
