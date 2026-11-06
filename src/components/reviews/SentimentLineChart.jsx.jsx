import React, { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

const API_BASE_URL = "http://localhost:5000/sentiment_over_time";

function SentimentLineChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [backendStatus, setBackendStatus] = useState(null);

  const testBackendConnection = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/sentiment_over_time`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const result = await response.json();
      setBackendStatus(result);
      return true;
    } catch (err) {
      setBackendStatus({
        error: err.message,
        timestamp: new Date().toISOString()
      });
      return false;
    }
  };

  const fetchData = async () => {
    setLoading(true);
    
    // First test backend connection
    const isBackendAvailable = await testBackendConnection();
    
    if (!isBackendAvailable) {
      setError("Backend service unavailable");
      setLoading(false);
      return;
    }

    // If backend is available, fetch data
    try {
      const response = await fetch(
        `${API_BASE_URL}/sentiment_over_time?t=${Date.now()}`
      );
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const result = await response.json();
      if (result.status !== "success") throw new Error(result.message);
      
      setData(result.data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return (
    <div className="loading-state">
      <h3>Connecting to backend...</h3>
      {backendStatus && (
        <div className="connection-info">
          <p>Testing connection to: {API_BASE_URL}</p>
        </div>
      )}
    </div>
  );

  if (error) return (
    <div className="error-state">
      <h3>Connection Error</h3>
      <p>{error}</p>
      
      <div className="debug-info">
        <h4>Backend Status:</h4>
        {backendStatus?.error ? (
          <p className="error">Failed to connect: {backendStatus.error}</p>
        ) : backendStatus ? (
          <pre>{JSON.stringify(backendStatus, null, 2)}</pre>
        ) : (
          <p>No connection information available</p>
        )}
        
        <h4>Troubleshooting Steps:</h4>
        <ol>
          <li>Ensure Flask server is running (check terminal)</li>
          <li>Verify the URL: <code>{API_BASE_URL}/healthcheck</code></li>
          <li>Check for CORS errors in browser console</li>
          <li>Try accessing the endpoint directly in your browser</li>
          <li>Verify no firewall is blocking port 5000</li>
        </ol>
      </div>
      
      <button 
        onClick={fetchData}
        style={{ padding: '10px 20px', fontSize: '1rem' }}
      >
        Retry Connection
      </button>
    </div>
  );

  return (
    <div className="chart-container">
      <h3>Sentiment Analysis Over Time</h3>
      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            {/* ... your chart code ... */}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default SentimentLineChart;