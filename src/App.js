// Dependencies
import React from 'react';

// Components
import WalletCreationContainer from './components/WalletCreationContainer.component';
import QueryContainer from './components/QueryContainer.component';
import XRPSendingContainer from './components/XRPSendingContainer.component';

const App = ({ xrplClient, xrpl }) => {
  console.log('>> App component rendered <<');

  return (
    <div className="App">
      <WalletCreationContainer xrplClient={xrplClient} />
      <QueryContainer xrplClient={xrplClient} />
      <XRPSendingContainer xrplClient={xrplClient} xrpl={xrpl} />
    </div>
  );
};

export default App;
