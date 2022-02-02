import React, { useEffect, useState } from 'react';

const XRPSendingContainer = ({ xrplClient, xrpl }) => {
  console.log('>> XRPSendingContainer component rendered <<')

  // State to hold basic instructions to use when preparing for a Payment transaction
  const [preparedInputState, setPreparedInputState] = useState({
    transactionType: '',
    account: '',
    amount: '',
    destination: ''
  });

  // State to hold prepared instruction after it is autofilled with good defaults
  const [preparedPaymentTransactionState, setPreparedPaymentTransactionState] = useState();

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
        <div
          className='prepare-transaction'
        >
          <div
            className='input'
            style={{ display: 'flex', flexDirection: 'column' }}
          >
            <h2>1. Prepare Transaction</h2>
            <input value={preparedInputState.transactionType} onChange={(event) => onChangeTransactionType(event)} placeholder='TransactionType' />
            <input value={preparedInputState.account} onChange={(event) => onChangeAccount(event)} placeholder='Account' />
            <input value={preparedInputState.amount} onChange={(event) => onChangeAmount(event)} placeholder='Amount' />
            <input value={preparedInputState.destination} onChange={(event) => onChangeDestination(event)} placeholder='Destination' />
            <button onClick={prepareTransaction}>PREPARE TRANSACTION</button>
          </div>

          <div
            className='output'
            style={{ display: 'flex', flexDirection: 'column' }}
          >
            <h2>2. Prepared Transaction</h2>
            <span></span>
            <span><b>Transaction Cost:</b></span>
            <span></span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default XRPSendingContainer;