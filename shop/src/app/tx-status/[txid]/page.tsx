'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';

import { ITransactionStatusResponse } from '../../../interface/transaction';

export default function RealTimeTransactionStatus() {
  const { txid } = useParams();

  const [status, setStatus] = useState<number | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async () => {
    setLoading(true);
    setError(null); // Clear any previous error
    try {
      const response = await axios.get(`/api/transaction/status/${txid}`);
      const payload : ITransactionStatusResponse = response.data
      setStatus(payload.order_status);
      setDescription(payload.description);
    } catch (err) {
      setError('Failed to fetch transaction status.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-black">
      <h1>🚀 Real-Time Transaction Status</h1>
      <h3>Tracking Transaction: <strong>{txid}</strong></h3>

      <div style={{ marginBottom: '20px' }}>
        <p>Description: {description || 'No updates yet...'}</p>
        <div style={{ marginTop: '10px' }}>
          <button onClick={fetchStatus} disabled={loading}>
            {loading ? 'Fetching...' : 'Fetch Status 🔍'}
          </button>
        </div>
      </div>

      {error && <p style={{ color: 'red' }}>❌ {error}</p>}
    </div>
  );
}