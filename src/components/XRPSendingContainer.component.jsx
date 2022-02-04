import React, { useEffect, useState } from 'react';

const XRPSendingContainer = ({ xrplClient, xrpl, walletsState, setWalletsState }) => {
  console.log('>> XRPSendingContainer component rendered <<')

  // State to hold basic instructions to use when preparing for a Payment transaction
  const [preparedInputState, setPreparedInputState] = useState({
    transactionType: '',
    account: '',
    amount: '',
    destination: ''
  });

  // State to hold prepared instruction after it is autofilled with good defaults
  const [preparedPaymentTransactionState, setPreparedPaymentTransactionState] = useState(null);

  // State to hold the transaction object after the signing operation
  const [transactionObjectState, setTransactionObjectState] = useState(null);

  // State to hold the transaction status after submitting the transaction blob from the transaction object
  const [transactionStatusState, setTransactionStatusState] = useState(null);

  // Prepare transaction
  const prepareTransaction = async () => {
    setPreparedPaymentTransactionState(
      await xrplClient.autofill({
        'TransactionType': preparedInputState.transactionType,
        'Account': preparedInputState.account,
        'Amount': xrpl.xrpToDrops(preparedInputState.amount),
        'Destination': preparedInputState.destination
      })
    );
  };

  // Sign transaction
  const signTransaction = () => {
    // Get transaction sender's wallet's seed with classicAddress
    const walletSeed = walletsState.find((wallet) => wallet.wallet.classicAddress === preparedPaymentTransactionState.Account).wallet.seed;

    // Instantiate transaction sender's wallet from seed encoded in base58
    const wallet = xrpl.Wallet.fromSeed(walletSeed);

    // Sign prepared transaction and store the returned transaction object
    setTransactionObjectState(wallet.sign(preparedPaymentTransactionState));
  };

  // Submit signed blob
  const submitSignedBlob = async () => {
    setTransactionStatusState(await xrplClient.submitAndWait(transactionObjectState.tx_blob));
  };

  // Input on change handlers (to update preparedInputState)
  const onChangeTransactionType = (event) => {
    setPreparedInputState((prev) => ({ ...prev, transactionType: event.target.value }));
  };

  const onChangeAccount = (event) => {
    setPreparedInputState((prev) => ({ ...prev, account: event.target.value }));
  };

  const onChangeAmount = (event) => {
    setPreparedInputState((prev) => ({ ...prev, amount: event.target.value }));
  };

  const onChangeDestination = (event) => {
    setPreparedInputState((prev) => ({ ...prev, destination: event.target.value }));
  };

  const queryAccounts = () => {
    walletsState.map(async (wallet) => {
      const response = await xrplClient.request({
        "command": "account_info",
        "account": wallet.wallet.classicAddress,
        "ledger_index": "validated"
      });

      console.log(response);

      await setWalletsState(walletsState.map((wallet) => {
        if (wallet.wallet.classicAddress === response.result.account_data.Account) {
          return { ...wallet, balance: response.result.account_data.Balance };
        }
      }));
    });
  };

  // useEffect((prev) => {
  //   if (prev) {
  //     walletsState.map(async (wallet) => {
  //       const response = await xrplClient.request({
  //         "command": "account_info",
  //         "account": wallet.wallet.classicAddress,
  //         "ledger_index": "validated"
  //       });

  //       setWalletsState(walletsState.map((wallet) => {
  //         if (wallet.wallet.classicAddress === response.result.account_data.Account) {
  //           return { ...wallet, balance: response.result.account_data.Balance };
  //         }

  //         return wallet;
  //       }));
  //     });
  //   }
  // }, [transactionStatusState, xrplClient, walletsState, setWalletsState])

  // Output of states for debugging purposes
  useEffect(() => {
    console.log('preparedInputState:', preparedInputState);
  }, [preparedInputState]);

  useEffect(() => {
    console.log('preparedPaymentTransactionState:', preparedPaymentTransactionState);
  }, [preparedPaymentTransactionState]);

  return (
    <div
      className='xrp-sending-container-component'
      style={{ outline: '5px solid black', padding: '25px', marginTop: '1em' }}
    >
      <h1>XRPSendingContainer component</h1>
      <div className='flow'>
        <div className='prepare-transaction'>
          <div
            className='input'
            style={{ display: 'flex', flexDirection: 'column' }}
          >
            <h2>(STEP 1) Prepare Payment Transaction</h2>
            <span style={{ marginBottom: '25px' }}>Note: the remaining fields for preparing a payment transaction are automatically filled with good defaults.</span>
            <input value={preparedInputState.transactionType} onChange={(event) => onChangeTransactionType(event)} placeholder='TransactionType' />
            <input value={preparedInputState.account} onChange={(event) => onChangeAccount(event)} placeholder='Account' />
            <input value={preparedInputState.amount} onChange={(event) => onChangeAmount(event)} placeholder='Amount' />
            <input value={preparedInputState.destination} onChange={(event) => onChangeDestination(event)} placeholder='Destination' />
            {
              (preparedInputState.transactionType && preparedInputState.account && preparedInputState.amount && preparedInputState.destination) ?
                <button onClick={prepareTransaction}>PREPARE TRANSACTION</button> : <button disabled>BUTTON DISABLED - EMPTY PREPARATION FIELDS FOR TRANSACTION</button>
            }
          </div>
          <div
            className='output'
            style={{ display: 'flex', flexDirection: 'column' }}
          >
            <h2>(STEP 2) View Prepared Transaction</h2>
            <span>{'{'}</span>
            <span style={{ marginLeft: '25px' }}><b>Transaction Type:</b> {preparedPaymentTransactionState && preparedPaymentTransactionState.TransactionType}</span>
            <span style={{ marginLeft: '25px' }}><b>Account:</b> {preparedPaymentTransactionState && preparedPaymentTransactionState.Account}</span>
            <span style={{ marginLeft: '25px' }}><b>Amount:</b> {preparedPaymentTransactionState && (xrpl.dropsToXrp(preparedPaymentTransactionState.Amount) + ' XRP // XRP value from original drops value (conversion done using .dropsToXrp() method)')}</span>
            <span style={{ marginLeft: '25px' }}><b>Destination:</b> {preparedPaymentTransactionState && preparedPaymentTransactionState.Destination}</span>
            <span style={{ marginLeft: '25px' }}><b>Flags:</b> {preparedPaymentTransactionState && preparedPaymentTransactionState.Flags}</span>
            <span style={{ marginLeft: '25px' }}><b>Sequence:</b> {preparedPaymentTransactionState && preparedPaymentTransactionState.Sequence}</span>
            <span style={{ marginLeft: '25px' }}><b>Fee:</b> {preparedPaymentTransactionState && (xrpl.dropsToXrp(preparedPaymentTransactionState.Fee) + ' XRP // XRP value from original drops value (conversion done using .dropsToXrp() method)')}</span>
            <span style={{ marginLeft: '25px' }}><b>LastLedgerSequence:</b> {preparedPaymentTransactionState && (preparedPaymentTransactionState.LastLedgerSequence + ' // Transaction expires after this ledger')}</span>
            <span>{'}'}</span>
          </div>
        </div>
        <div className='sign-transaction'>
          <div
            className='input'
            style={{ display: 'flex', flexDirection: 'column' }}
          >
            <h2>(STEP 3) Sign Prepared Transaction</h2>
            {preparedPaymentTransactionState ? <button onClick={signTransaction}>SIGN PAYMENT TRANSACTION</button> : <button disabled>BUTTON DISABLED - NO PAYMENT TRANSACTION TO SIGN</button>}
          </div>
          <div
            className='output'
            style={{ display: 'flex', flexDirection: 'column' }}
          >
            <h2>(STEP 4) View Resulting Transaction Object</h2>
            <span>{'{'}</span>
            <span style={{ marginLeft: '25px' }}><b>hash:</b> {(transactionObjectState && transactionObjectState.hash + ' // Transaction\'s ID or identifying hash, which can be used to look up this transaction later. This is a 64-character hexadecimal string that is unique to this transaction.')}</span>
            <span style={{ marginLeft: '25px', width: '500px', wordWrap: 'break-word' }}><b>tx_blob:</b> {(transactionObjectState && transactionObjectState.tx_blob + ' // Signature which is the hexadecimal representation of the transaction\'s canonical binary format called a "blob".')}</span>
            <span>{'}'}</span>
          </div>
        </div>
        <div
          className='submit-signed-blob'
          style={{ display: 'flex', flexDirection: 'column' }}
        >
          <div
            className='input'
            style={{ display: 'flex', flexDirection: 'column' }}
          >
            <h2>(STEP 5) Submit Signed Transaction Blob and Verify Validated Ledger Inclusion/Exclusion</h2>
            <span style={{ marginBottom: '25px' }}>Note: demonstration uses .submitAndWait() method to wait for the transaction's outcome (verification).</span>
            {transactionObjectState ? <button onClick={submitSignedBlob}>SUBMIT SIGNED BLOB</button> : <button disabled>BUTTON DISABLED - NO TRANSACTION BLOB DETECTED</button>}
          </div>
          <div
            className='output'
            style={{ display: 'flex', flexDirection: 'column', marginTop: '25px' }}
          >
            <span>{'{'}</span>
            <span style={{ marginLeft: '25px' }}><b>id:</b> {transactionStatusState && transactionStatusState.id}</span>
            <span style={{ marginLeft: '25px' }}><b>type:</b> {transactionStatusState && transactionStatusState.type}</span>
            <span style={{ marginLeft: '25px' }}><b>result:</b> {'{'}</span>
            <span style={{ marginLeft: '50px' }}><b>Account:</b> {transactionStatusState && transactionStatusState.result.Account}</span>
            <span style={{ marginLeft: '50px' }}><b>Amount:</b> {transactionStatusState && transactionStatusState.result.Amount}</span>
            <span style={{ marginLeft: '50px' }}><b>Destination:</b> {transactionStatusState && transactionStatusState.result.Destination}</span>
            <span style={{ marginLeft: '50px' }}><b>Fee:</b> {transactionStatusState && transactionStatusState.result.Fee}</span>
            <span style={{ marginLeft: '50px' }}><b>Flags:</b> {transactionStatusState && transactionStatusState.result.Flags}</span>
            <span style={{ marginLeft: '50px' }}><b>LastLedgerSequence:</b> {transactionStatusState && transactionStatusState.result.LastLedgerSequence}</span>
            <span style={{ marginLeft: '50px' }}><b>Sequence:</b> {transactionStatusState && transactionStatusState.result.Sequence}</span>
            <span style={{ marginLeft: '50px' }}><b>SigningPubKey:</b> {transactionStatusState && transactionStatusState.result.SigningPubKey}</span>
            <span style={{ marginLeft: '50px' }}><b>TransactionType:</b> {transactionStatusState && transactionStatusState.result.TransactionType}</span>
            <span style={{ marginLeft: '50px' }}><b>TxnSignature:</b> {transactionStatusState && transactionStatusState.result.TxnSignature}</span>
            <span style={{ marginLeft: '50px' }}><b>date:</b> {transactionStatusState && transactionStatusState.result.date}</span>
            <span style={{ marginLeft: '50px' }}><b>hash:</b> {transactionStatusState && transactionStatusState.result.hash}</span>
            <span style={{ marginLeft: '50px' }}><b>inLedger:</b> {transactionStatusState && transactionStatusState.result.inLedger}</span>
            <span style={{ marginLeft: '50px' }}><b>ledger_index:</b> {transactionStatusState && transactionStatusState.result.ledger_index}</span>
            <span style={{ marginLeft: '50px' }}><b>validated:</b> {transactionStatusState && (transactionStatusState.result.validated ? 'true // Must be true to confirm that the data comes from a validated ledger version' : 'false // Must be true to confirm that the data comes from a validated ledger version')}</span>
            <span style={{ marginLeft: '50px' }}><b>meta:</b> {'{'}</span>
            <span style={{ marginLeft: '75px' }}><b>TransactionIndex:</b> {transactionStatusState && transactionStatusState.result.meta.TransactionIndex}</span>
            <span style={{ marginLeft: '75px' }}><b>TransactionResult:</b> {(transactionStatusState && transactionStatusState.result.meta.TransactionResult + ' // Transaction result')}</span>
            <span style={{ marginLeft: '75px' }}><b>delivered_amount:</b> {transactionStatusState && transactionStatusState.result.meta.delivered_amount}</span>
            <span style={{ marginLeft: '75px' }}><b>AffectedNodes:</b> {'['}</span>
            <span style={{ marginLeft: '100px' }}>
              {transactionStatusState && transactionStatusState.result.meta.AffectedNodes.map((node, index) => {
                return (
                  <div key={`affected-node-${index}`} style={{ display: 'flex', flexDirection: 'column' }}>
                    <span><b>ModifiedNode:</b> {'{'}</span>
                    <span style={{ marginLeft: '25px' }}><b>LedgerEntryType:</b> {node.ModifiedNode.LedgerEntryType}</span>
                    <span style={{ marginLeft: '25px' }}><b>LedgerIndex:</b> {node.ModifiedNode.LedgerIndex}</span>
                    <span style={{ marginLeft: '25px' }}><b>PreviousTxnID:</b> {node.ModifiedNode.PreviousTxnID}</span>
                    <span style={{ marginLeft: '25px' }}><b>PreviousTxnLgrSeq:</b> {node.ModifiedNode.PreviousTxnLgrSeq}</span>
                    <span style={{ marginLeft: '25px' }}><b>FinalFields:</b> {'{'}</span>
                    <span style={{ marginLeft: '50px' }}><b>Account:</b> {node.ModifiedNode.FinalFields.Account}</span>
                    <span style={{ marginLeft: '50px' }}><b>Balance:</b> {node.ModifiedNode.FinalFields.Balance}</span>
                    <span style={{ marginLeft: '50px' }}><b>Flags:</b> {node.ModifiedNode.FinalFields.Flags}</span>
                    <span style={{ marginLeft: '50px' }}><b>OwnerCount:</b> {node.ModifiedNode.FinalFields.OwnerCount}</span>
                    <span style={{ marginLeft: '50px' }}><b>Sequence:</b> {node.ModifiedNode.FinalFields.Sequence}</span>
                    <span style={{ marginLeft: '25px' }}>{'}'}</span>
                    <span style={{ marginLeft: '25px' }}><b>PreviousFields:</b> {'{'}</span>
                    <span style={{ marginLeft: '50px' }}><b>Balance:</b> {node.ModifiedNode.PreviousFields.Balance}</span>
                    <span style={{ marginLeft: '50px' }}><b>Sequence:</b> {node.ModifiedNode.PreviousFields.Sequence}</span>
                    <span style={{ marginLeft: '25px' }}>{'}'}</span>
                    <span>{'}'}</span>
                  </div>
                );
              })}
            </span>
            <span style={{ marginLeft: '75px' }}>{']'}</span>
            <span style={{ marginLeft: '50px' }}>{'}'}</span>
            <span style={{ marginLeft: '25px' }}>{'}'}</span>
            <span>{'}'}</span>
            <h2>(STEP 6) Check Transaction Status</h2>
            <span
              style={{ marginBottom: '25px' }}
            >
              Note: all the information needed to check on the details of a transaction's outcome when it appears in a validated ledger version is above, but the getBalanceChanges() method can give you specific balance changing information on the accounts in focus.
            </span>
            <span
              style={{ display: 'flex', flexDirection: 'column' }}
            >
              <span>{'['}</span>
              {
                transactionStatusState && xrpl.getBalanceChanges(transactionStatusState.result.meta).map((status) => {
                  return (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ marginLeft: '25px' }}>{'{'}</span>
                      <span style={{ marginLeft: '50px' }}><b>account:</b> {status.account}</span>
                      <span style={{ marginLeft: '50px' }}><b>balances:</b> {'['}</span>
                      <span style={{ marginLeft: '75px' }}>{'{'}</span>
                      <span style={{ marginLeft: '100px' }}><b>currency:</b> {status.balances[0].currency}</span>
                      <span style={{ marginLeft: '100px' }}><b>value:</b> {status.balances[0].value}</span>
                      <span style={{ marginLeft: '75px' }}>{'}'}</span>
                      <span style={{ marginLeft: '50px' }}>{']'}</span>
                      <span style={{ marginLeft: '25px' }}>{'}'}</span>
                    </div>
                  );
                })
              }
              <span>{']'}</span>
              <button onClick={queryAccounts}>UPDATE WALLETS</button>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default XRPSendingContainer;