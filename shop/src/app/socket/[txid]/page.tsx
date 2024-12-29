'use client'

import * as React from 'react'

import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface TransactionEvent {
  status: number; 
  txid: string;
}

export default function RealTimeTransactionStatus({ 
  params 
}: { 
  params: { txid: string }
}) {
  const [status, setStatus] = useState<number | null>(null);
  const [description, setSDescription] = useState<string | null>(null);

  const [isListening, setIsListening] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { txid } = useParams()
  // const { txid } = React.use(params)


  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isListening) {
      intervalId = setInterval(async () => {
        try {
          const response = await axios.get(`/api/transaction/status/${txid}`);
          setStatus(response.data.success);
          setSDescription(response.data.description)
        } catch (error) {
          setError('Failed to fetch status');
        }
      }, 3000);
    }

    return () => clearInterval(intervalId);
  }, [isListening, txid]);

  const startEventListener = () => setIsListening(true);
  const stopEventListener = () => setIsListening(false);

  return (
    <div className=''>
      <h1>🚀 Real-Time Transaction Status</h1>
      <h3>Tracking Transaction: <strong>{txid}</strong></h3>

      <div style={{ marginBottom: '20px' }}>
        <div>
          {description}
        </div>
        <button onClick={startEventListener} disabled={isListening || loading}>
          {loading ? 'Starting...' : 'Start Event Listener 🔥'}
        </button>

        <button onClick={stopEventListener} disabled={!isListening || loading}>
          {loading ? 'Stopping...' : 'Stop Event Listener ❌'}
        </button>
      </div>

      {error && <p style={{ color: 'red' }}>❌ {error}</p>}

      {status === null && !loading && <p>Listening for updates... ⏳</p>}
    </div>
  );
}

function statusLabel(status: number) {
  switch (status) {
    case 1:
      return 'Pending';
    case 2:
      return 'Rejected';
    case 3:
      return 'Approved';
    default:
      return 'Unknown';
  }
}