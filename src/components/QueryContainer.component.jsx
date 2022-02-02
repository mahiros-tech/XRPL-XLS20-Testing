import React from 'react';

const QueryContainer = ({ xrplClient }) => {
  console.log('>> QueryContainer component rendered <<')

  return (
    <div
      className='query-container-component'
      style={{ outline: '5px solid black', padding: '25px', marginTop: '1em' }}
    >
      <h1>QueryContainer component</h1>
    </div>
  );
};

export default QueryContainer;