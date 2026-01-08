import React, { useState, useEffect } from "react";
import axios from "axios";
import TrendChart from "./components/TrendChart";
import SentimentChart from "./components/SentimentChart";
import SummaryCard from "./components/SummaryCard";
import RelatedKeywords from "./components/RelatedKeywords"; // New Component
import Header from "./components/Header";
import Footer from "./components/Footer";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import "./App.css"; // Ensure you created this file from the previous step

function App() {
  const [keywords, setKeywords] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const [chartType, setChartType] = useState("line");
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to Dark for new theme
  const [period, setPeriod] = useState("12");

  // Load search history on mount
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("searchHistory") || "[]");
    setHistory(saved);
  }, []);

  // Save history to local storage
  const saveHistory = (arr) => {
    // Join array to string for history display if multiple keywords
    const keywordString = arr.join(", ");
    const updated = [...new Set([keywordString, ...history])].slice(0, 10);
    localStorage.setItem("searchHistory", JSON.stringify(updated));
    setHistory(updated);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    // Split by comma to support comparison mode (e.g., "AI, Crypto")
    const arr = keywords.split(",").map((k) => k.trim()).filter(Boolean);
    
    if (arr.length === 0) {
      setError("Please enter at least one keyword.");
      return;
    }

    setError("");
    setLoading(true);
    setResults(null);

    // Scroll to results area smoothly
    setTimeout(() => {
      const resultsEl = document.getElementById("results-section");
      if (resultsEl) resultsEl.scrollIntoView({ behavior: "smooth" });
    }, 100);

    try {
      let backendUrl = process.env.REACT_APP_BACKEND_URL;
      
      // Safety: Remove trailing slash to prevent double-slash errors
      if (backendUrl && backendUrl.endsWith("/")) {
        backendUrl = backendUrl.slice(0, -1);
      }

      // Send the array of keywords to the backend
      const res = await axios.post(`${backendUrl}/analyze`, { keywords: arr });
      
      setResults(res.data);
      saveHistory(arr);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch analysis. The server might be sleeping (Free Tier). Please try again in 10 seconds.");
      setResults(null);
    }

    setLoading(false);
  };

  // Handle clicking a history chip to re-search
  const handleHistoryClick = (kw) => {
    setKeywords(kw);
    // You can optionally auto-submit here if you refactor the fetch logic
  };

  const downloadCSV = (keyword, trendData) => {
    if (!trendData || trendData.length === 0) return;
    // Filter data based on selected period
    const filteredData = trendData.slice(-parseInt(period));
    
    const headers = ["Date", "Value"];
    const rows = filteredData.map((d) => [d.date, d.value]);
    const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `${keyword}_trend.csv`);
    link.click();
  };

  const exportPDF = async () => {
    const input = document.getElementById("pdf-content");
    if (!input) return;
    
    // Capture with dark background color
    const canvas = await html2canvas(input, { backgroundColor: "#0f172a" });
    const imgData = canvas.toDataURL("image/png");
    
    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("trendlens_report.pdf");
  };

  return (
    <div className="app-container">
      {/* Header */}
      <Header
        chartType={chartType}
        setChartType={setChartType}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />

      {/* --- HERO SECTION --- */}
      <section className="hero-section">
        <h1 className="title-gradient">TrendLens AI</h1>
        <p className="subtitle">
          Advanced market intelligence. Compare trends, forecast growth, 
          and discover rising niches in seconds.
        </p>

        <form onSubmit={handleSubmit} className="search-wrapper">
          <div className="search-container">
            <span style={{ fontSize: "24px", alignSelf: "center", marginLeft: "15px" }}>🔍</span>
            <input
              type="text"
              className="search-input"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="Enter keywords (e.g. Bitcoin, Gold)..."
            />
            <button type="submit" className="search-btn">
              Analyze
            </button>
          </div>

          <div className="controls-row">
            <select
              className="custom-select"
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
            >
              <option value="line">Line Chart</option>
              <option value="bar">Bar Chart</option>
              <option value="radar">Radar Chart</option>
            </select>
            <select
              className="custom-select"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            >
              <option value="6">Last 6 Months</option>
              <option value="12">Last 1 Year</option>
              <option value="24">Last 2 Years</option>
            </select>
          </div>
        </form>

        {/* History Chips */}
        {history.length > 0 && (
          <div className="history-tags">
            <span style={{ color: "#666", fontSize: "14px", alignSelf: "center" }}>
              Recent:
            </span>
            {history.map((kw, i) => (
              <span key={i} className="history-chip" onClick={() => handleHistoryClick(kw)}>
                {kw}
              </span>
            ))}
          </div>
        )}

        {error && (
          <p style={{ color: "#ff6b6b", marginTop: "20px", fontWeight: "bold" }}>
            {error}
          </p>
        )}

        {loading && (
          <div className="spinner-container">
            <div className="spinner"></div>
            <p style={{ marginTop: "15px", color: "#a0a0a0" }}>
              Crunching big data...
            </p>
          </div>
        )}
      </section>

      {/* --- RESULTS DASHBOARD --- */}
      {results && (
        <div id="results-section">
          <div className="dashboard-grid" id="pdf-content">
            
            {/* 1. Main Trend Chart (Full Width) with Forecast */}
            <div className="glass-card full-width">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2 style={{ margin: 0 }}>📈 Comparison & Forecast</h2>
                <button
                  onClick={exportPDF}
                  style={{
                    background: "transparent",
                    border: "1px solid #fff",
                    color: "#fff",
                    padding: "5px 10px",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Export Report (PDF)
                </button>
              </div>
              <div style={{ marginTop: "20px" }}>
                <TrendChart
                  results={results}
                  chartType={chartType}
                  period={period}
                  isDarkMode={true}
                />
              </div>
            </div>

            {/* 2. Related Keywords (New Component) */}
            <div className="full-width">
               <RelatedKeywords data={results} />
            </div>

            {/* 3. Detailed Cards for each Keyword */}
            {Object.keys(results).map((kw) => (
              <React.Fragment key={kw}>
                {/* Summary Card */}
                <div className="glass-card">
                  <span className="keyword-badge">{kw}</span>
                  <SummaryCard summary={results[kw].summary || "No summary available."} />
                </div>

                {/* Sentiment Card */}
                <div className="glass-card" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <h3>Sentiment Analysis</h3>
                  <div style={{ width: "100%", height: "250px" }}>
                    <SentimentChart sentiment={results[kw].sentiment} />
                  </div>
                  <button
                    onClick={() => downloadCSV(kw, results[kw].trend_data)}
                    style={{
                      marginTop: "auto",
                      background: "rgba(255,255,255,0.1)",
                      border: "none",
                      color: "#4caf50",
                      padding: "8px",
                      width: "100%",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                  >
                    Download CSV
                  </button>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}

export default App;
