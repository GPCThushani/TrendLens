import React, { useState } from 'react';
import axios from 'axios';
import TrendChart from './components/TrendChart';
import SentimentChart from './components/SentimentChart';
import SummaryCard from './components/SummaryCard';

function App() {
  const [keywords, setKeywords] = useState(''); // comma-separated keywords
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!keywords.trim()) return;

    setLoading(true);

    // Split keywords by comma, trim spaces, remove empty strings
    const keywordsArray = keywords
      .split(',')
      .map(k => k.trim())
      .filter(k => k);

    try {
      const response = await axios.post('http://localhost:5000/analyze', { keywords: keywordsArray });
      setResult(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setResult(null);
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

      {result && Object.keys(result).map((kw) => (
        <div key={kw} style={{ marginBottom: '40px' }}>
          <h2>{kw}</h2>
          <TrendChart data={result[kw].trend_data || []} />
          <SentimentChart sentiment={result[kw].sentiment} />
          <SummaryCard summary={result[kw].summary} />
        </div>
      ))}
    </div>
  );
}

export default App;
