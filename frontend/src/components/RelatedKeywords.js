import React from 'react';

const RelatedKeywords = ({ data }) => {
  // data format: { "AI": [ {query: "generative ai", value: 500}, ... ], "Crypto": [...] }
  
  return (
    <div className="dashboard-grid" style={{ padding: '0 20px', marginTop: '-20px' }}>
      {Object.keys(data).map((mainKw) => {
        const related = data[mainKw]?.related_queries;
        if (!related || related.length === 0) return null;

        return (
          <div key={mainKw} className="glass-card">
            <h4 style={{ margin: '0 0 15px 0', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
              🔥 Rising Topics: <span style={{ color: '#667eea' }}>{mainKw}</span>
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {related.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span>{item.query}</span>
                  <span style={{ color: '#4caf50', fontWeight: 'bold' }}>+{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RelatedKeywords;
