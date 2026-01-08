import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, Plus, X, Download, FileText, TrendingUp, PieChart, MessageSquare, Clock } from 'lucide-react';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// Components
import TrendChart from "./components/TrendChart";
import SentimentChart from "./components/SentimentChart";
import SummaryCard from "./components/SummaryCard";
import RelatedKeywords from "./components/RelatedKeywords";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "./App.css";

function App() {
  const [keywordInputs, setKeywordInputs] = useState([""]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  
  // Settings
  const [chartType, setChartType] = useState("line");
  const [period, setPeriod] = useState("12");
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Init
  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("searchHistory") || "[]");
    setHistory(savedHistory);
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Input Handlers
  const addInputField = () => {
    if (keywordInputs.length < 5) setKeywordInputs([...keywordInputs, ""]);
  };

  const removeInputField = (index) => {
    if (keywordInputs.length > 1) {
      setKeywordInputs(keywordInputs.filter((_, i) => i !== index));
    }
  };

  const handleInputChange = (index, value) => {
    const newInputs = [...keywordInputs];
    newInputs[index] = value;
    setKeywordInputs(newInputs);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    const validKeywords = keywordInputs.map(k => k.trim()).filter(Boolean);

    if (validKeywords.length === 0) {
      setError("Please enter at least one keyword.");
      return;
    }

    setError("");
    setLoading(true);
    setResults(null);

    try {
      let backendUrl = process.env.REACT_APP_BACKEND_URL;
      if (backendUrl && backendUrl.endsWith("/")) {
        backendUrl = backendUrl.slice(0, -1);
      }

      const res = await axios.post(`${backendUrl}/analyze`, { keywords: validKeywords });
      
      setResults(res.data);
      
      // Save History
      const term = validKeywords.join(", ");
      const updated = [...new Set([term, ...history])].slice(0, 10);
      localStorage.setItem("searchHistory", JSON.stringify(updated));
      setHistory(updated);
      
      // Scroll
      setTimeout(() => {
        document.getElementById("dashboard")?.scrollIntoView({ behavior: 'smooth' });
      }, 500);

    } catch (err) {
      console.error(err);
      setError("Failed to fetch analysis. Server might be sleeping. Try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  const exportPDF = async () => {
    const input = document.getElementById("dashboard");
    if (!input) return;
    const canvas = await html2canvas(input, { 
      backgroundColor: isDarkMode ? "#0f0f23" : "#f8f9fa",
      scale: 2 
    });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("trendlens-report.pdf");
  };

  return (
    <div className={`app ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="container">
        
        {/* Header (Updated with new Logo logic) */}
        <Header 
          isDarkMode={isDarkMode} 
          setIsDarkMode={setIsDarkMode} 
        />

        {/* --- HERO / SEARCH SECTION --- */}
        <section className="search-section">
          <div style={{ textAlign:'center', marginBottom:'30px' }}>
             <h1 style={{ fontSize:'2.5rem', fontWeight:'800', marginBottom:'10px' }}>
               Market Intelligence <span className="gradient-text">AI</span>
             </h1>
             <p className="subtitle">Analyze trends, forecast growth & discover niches.</p>
          </div>

          {/* Time Period Selector - Moved Here */}
          <div style={{ display:'flex', justifyContent:'center', marginBottom:'20px' }}>
             <div className="glass-card" style={{ padding:'8px 20px', borderRadius:'50px', display:'flex', alignItems:'center', gap:'10px' }}>
                <Clock size={16} color="var(--accent-primary)" />
                <span style={{ fontSize:'0.9rem', whiteSpace:'nowrap' }}>Time Range:</span>
                <select 
                  className="custom-select" 
                  value={period} 
                  onChange={(e) => setPeriod(e.target.value)}
                  style={{ background:'transparent', border:'none', color:'inherit', fontWeight:'bold', cursor:'pointer', outline:'none' }}
                >
                  <option value="6">Last 6 Months</option>
                  <option value="12">Last 1 Year</option>
                  <option value="24">Last 2 Years</option>
                  <option value="60">Last 5 Years</option>
                </select>
             </div>
          </div>

          {/* Search Inputs */}
          {keywordInputs.map((kw, index) => (
            <div key={index} className="search-row">
              <input 
                type="text" 
                className="search-input"
                placeholder={`Enter keyword ${index + 1}...`}
                value={kw}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              />
              {keywordInputs.length > 1 && (
                <button onClick={() => removeInputField(index)} className="icon-btn">
                  <X size={20} />
                </button>
              )}
            </div>
          ))}

          {/* Buttons */}
          <div className="action-row">
            {keywordInputs.length < 5 && (
              <button onClick={addInputField} className="btn-secondary">
                <Plus size={18} /> Compare
              </button>
            )}
            <button onClick={handleSubmit} disabled={loading} className="btn-primary">
              {loading ? <div className="loading-spinner"></div> : <><Search size={20} /> Analyze Trends</>}
            </button>
          </div>
          
          {error && <div className="error-msg">{error}</div>}

          {/* History */}
          {history.length > 0 && (
            <div className="history-section">
              <span className="history-label">Recent Searches:</span>
              <div className="tags-container">
                {history.map((term, i) => (
                  <span key={i} className="tag" onClick={() => {
                    setKeywordInputs(term.split(", "));
                  }}>
                    {term}
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* --- RESULTS DASHBOARD --- */}
        {results && (
          <div id="dashboard" className="dashboard-grid">
            
            {/* Header Actions */}
            <div className="full-width" style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'10px' }}>
              <h2 className="card-title"><TrendingUp className="gradient-text"/> Report Analysis</h2>
              <button onClick={exportPDF} className="btn-secondary" style={{width: 'auto'}}>
                <FileText size={16}/> Export PDF
              </button>
            </div>

            {/* Main Trend Chart */}
            <div className="glass-card full-width">
              <div className="card-header">
                <h3 className="card-title">📉 Comparison & Forecast</h3>
              </div>
              <TrendChart results={results} chartType={chartType} period={period} isDarkMode={isDarkMode} />
            </div>

            {/* Related Keywords */}
            <div className="full-width">
              <RelatedKeywords data={results} />
            </div>

            {/* Cards Loop - Grid Layout Fixed with minmax to prevent overlap */}
            {Object.keys(results).map((kw) => (
              <React.Fragment key={kw}>
                
                {/* Sentiment - Fixed height/width to prevent overlap */}
                <div className="glass-card" style={{ 
                    textAlign: 'center', 
                    minHeight:'450px',
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent:'space-between' 
                }}>
                  <div className="card-header" style={{justifyContent:'center'}}>
                    <h3 className="card-title"><PieChart size={18}/> {kw} Sentiment</h3>
                  </div>
                  
                  {/* Container ensures pie chart doesn't grow uncontrollably */}
                  <div style={{ height: '250px', width: '100%', display:'flex', justifyContent:'center', position:'relative' }}>
                    <SentimentChart sentiment={results[kw].sentiment} />
                  </div>
                  
                  <button onClick={() => {}} className="btn-secondary" style={{marginTop:'20px', width:'100%'}}>
                     Download CSV
                  </button>
                </div>

                {/* Summary */}
                <div className="glass-card" style={{ minHeight:'450px' }}>
                  <div className="card-header">
                    <span className="tag" style={{background: 'var(--accent-primary)', color:'white'}}>{kw}</span>
                    <MessageSquare size={18} style={{opacity:0.7}}/>
                  </div>
                  <SummaryCard summary={results[kw].summary || "No summary available."} />
                </div>
              </React.Fragment>
            ))}

          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default App;