import React, { useState } from 'react';
import axios from 'axios';
import TrendChart from './components/TrendChart';
import SentimentChart from './components/SentimentChart';
import SummaryCard from './components/SummaryCard';

function App() {
  const [keyword, setKeyword] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false); // optional: show loading state

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!keyword) return;
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/analyze', { text: keyword });
      setResult(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setResult(null);
    }
    setLoading(false);
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>TrendLens – AI Market Trend Analyzer</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          placeholder="Enter keyword"
          style={{ padding: '5px', width: '250px', marginRight: '10px' }}
        />
        <button type="submit" style={{ padding: '5px 15px' }}>Analyze</button>
      </form>

      {loading && <p>Analyzing keyword...</p>}

      {result && (
        <>
          <TrendChart key={`trend-${keyword}`} data={result.trend_data || []} />
          <SentimentChart key={`sentiment-${keyword}`} sentiment={result.sentiment} />
          <SummaryCard key={`summary-${keyword}`} summary={result.summary} />
        </>
      )}
    </div>
  );
}

export default App;
