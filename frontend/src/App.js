import React, { useState } from 'react';
import axios from 'axios';
import TrendChart from './components/TrendChart';
import SentimentChart from './components/SentimentChart';
import SummaryCard from './components/SummaryCard';

function App() {
  const [keywords, setKeywords] = useState(''); // comma-separated
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const arr = keywords.split(',').map(k=>k.trim()).filter(Boolean);
    if (arr.length === 0) return;
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/analyze', { keywords: arr });
      setResults(res.data);
    } catch (err) {
      console.error(err);
      setResults(null);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>TrendLens – AI Market Trend Analyzer</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={keywords}
          onChange={e => setKeywords(e.target.value)}
          placeholder="Enter keywords separated by commas"
          style={{ padding: '5px', width: '400px', marginRight: '10px' }}
        />
        <button type="submit" style={{ padding: '5px 15px' }}>Analyze</button>
      </form>

      {loading && <p>Analyzing… Please wait.</p>}

      {results && Object.keys(results).map(kw => (
        <div key={kw} style={{ marginBottom: '40px' }}>
          <h2>{kw}</h2>
          {results[kw].error ? (
            <p style={{color:'red'}}>Error: {results[kw].error}</p>
          ) : (
            <>
              <TrendChart data={results[kw].trend_data || []} />
              <SentimentChart sentiment={results[kw].sentiment || {positive:0,neutral:0,negative:0}}/>
              <SummaryCard summary={results[kw].summary || 'No summary'} />
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default App;
