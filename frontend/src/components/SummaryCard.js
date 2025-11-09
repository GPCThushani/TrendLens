import React from 'react';

const SummaryCard = ({ summary }) => (
    <div style={{border:'1px solid #ccc', padding:'10px', marginTop:'20px'}}>
        <h3>AI Summary</h3>
        <p>{summary}</p>
    </div>
);

export default SummaryCard;
