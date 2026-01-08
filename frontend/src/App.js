import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, Plus, X, Sun, Moon, Download, FileText, TrendingUp, PieChart, MessageSquare } from 'lucide-react';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// Components
import TrendChart from "./components/TrendChart";
import SentimentChart from "./components/SentimentChart";
import SummaryCard from "./components/SummaryCard";
import RelatedKeywords from "./components/RelatedKeywords";
import Footer from "./components/Footer";
import "./App.css";

function App() {
  // State for multiple keyword inputs (Array of strings)
  const [keywordInputs, setKeywordInputs] = useState([""]);
  
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  
  // Theme & Chart Settings
  const [chartType, setChartType] = useState("line");
  const [period, setPeriod] = useState("12");
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Initialize
  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("searchHistory") || "[]");
    setHistory(savedHistory);
    // Apply theme to body
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // --- Input Handlers ---
  const addInputField = () => {
    if (keywordInputs.length < 5) setKeywordInputs([...keywordInputs, ""]);
  };

  const removeInputField = (index) => {
    if (keywordInputs.length > 1) {
      const newInputs = keywordInputs.filter((_, i) => i !== index);
      setKeywordInputs(newInputs);
    }
  };

  const handleInputChange = (index, value) => {
    const newInputs = [...keywordInputs];
    newInputs[index] = value;
    setKeywordInputs(newInputs);
  };

  // --- API Logic ---
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    // Filter out empty strings
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

      // Call your Real Backend
      const res = await axios.post(`${backendUrl}/analyze`, { keywords: validKeywords });
      
      setResults(res.data);
      saveHistory(validKeywords);
      
      // Scroll to results
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

  const saveHistory = (keywords) => {
    const term = keywords.join(", ");
    const updated = [...new Set([term, ...history])].slice(0, 10);
    localStorage.setItem("searchHistory", JSON.stringify(updated));
    setHistory(updated);
  };

  // --- Exports ---
  const exportPDF = async () => {
    const input = document.getElementById("dashboard");
    if (!input) return;
    const canvas = await html2canvas(input, { 
      backgroundColor: isDarkMode ? "#0f0f23" : "#f8f9fa",
      scale: 2 
    });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save("trendlens-report.pdf");
  };

  return (
    <div className={`app ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="container">
        
        {/* Header */}
        <header className="header">
          <div className="header-top">
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="theme-btn">
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
          <h1 className="title">Trend<span className="gradient-text">Lens</span></h1>
          <p className="subtitle">AI-Powered Market Intelligence & Forecasts</p>
        </header>

        {/* Search Section */}
        <section className="search-section">
          {keywordInputs.map((kw, index) => (
            <div key={index} className="search-row">
              <input 
                type="text" 
                className="search-input"
                placeholder={`Enter keyword ${index + 1} (e.g. AI, Crypto)...`}
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

        {/* Dashboard Results */}
        {results && (
          <div id="dashboard" className="dashboard-grid">
            
            {/* Header Actions */}
            <div className="full-width" style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'10px' }}>
              <h2 className="card-title"><TrendingUp className="gradient-text"/> Analysis Report</h2>
              <button onClick={exportPDF} className="btn-secondary" style={{width: 'auto'}}>
                <FileText size={16}/> Export PDF
              </button>
            </div>

            {/* Main Trend Chart */}
            <div className="glass-card full-width">
              <div className="card-header">
                <h3 className="card-title">📉 Trend Forecast</h3>
                <select 
                  style={{ background:'transparent', color: 'inherit', border:'none', outline:'none', cursor:'pointer' }}
                  value={period} onChange={(e) => setPeriod(e.target.value)}
                >
                  <option value="6">Last 6 Months</option>
                  <option value="12">Last 1 Year</option>
                  <option value="24">Last 2 Years</option>
                </select>
              </div>
              <TrendChart results={results} chartType={chartType} period={period} isDarkMode={isDarkMode} />
            </div>

            {/* Related Keywords */}
            <div className="full-width">
              <RelatedKeywords data={results} />
            </div>

            {/* Cards Loop */}
            {Object.keys(results).map((kw) => (
              <React.Fragment key={kw}>
                {/* Summary */}
                <div className="glass-card">
                  <div className="card-header">
                    <span className="tag" style={{background: 'var(--accent-primary)', color:'white'}}>{kw}</span>
                    <MessageSquare size={18} style={{opacity:0.7}}/>
                  </div>
                  <SummaryCard summary={results[kw].summary || "No summary available."} />
                </div>

                {/* Sentiment */}
                <div className="glass-card" style={{ textAlign: 'center' }}>
                  <div className="card-header" style={{justifyContent:'center'}}>
                    <h3 className="card-title"><PieChart size={18}/> Sentiment</h3>
                  </div>
                  <div style={{ height: '220px', width:'100%', display:'flex', justifyContent:'center' }}>
                    <SentimentChart sentiment={results[kw].sentiment} />
                  </div>
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