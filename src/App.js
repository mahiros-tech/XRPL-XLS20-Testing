// Dependencies
import React, { useState } from 'react';

// Components
import WalletCreationContainer from './components/WalletCreationContainer.component';
import QueryContainer from './components/QueryContainer.component';
import XRPSendingContainer from './components/XRPSendingContainer.component';

const App = ({ xrplClient, xrpl }) => {
  console.log('>> App component rendered <<');

  const [walletsState, setWalletsState] = useState([]);

  return (
    <div className="App">
      <WalletCreationContainer xrplClient={xrplClient} walletsState={walletsState} setWalletsState={setWalletsState} />
      <QueryContainer xrplClient={xrplClient} />
      <XRPSendingContainer xrplClient={xrplClient} xrpl={xrpl} walletsState={walletsState} />
    </div>
  );
};

export default App;
