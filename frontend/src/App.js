import React, { useState, useEffect } from "react";
import axios from "axios";
import TrendChart from "./components/TrendChart";
import SentimentChart from "./components/SentimentChart";
import SummaryCard from "./components/SummaryCard";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import demo from "./assets/demo.png";

function App() {
  const [keywords, setKeywords] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const [chartType, setChartType] = useState("line");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [period, setPeriod] = useState("12");

  // Load search history
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("searchHistory") || "[]");
    setHistory(saved);
  }, []);

  const saveHistory = (arr) => {
    const updated = [...new Set([...arr, ...history])].slice(0, 20);
    localStorage.setItem("searchHistory", JSON.stringify(updated));
    setHistory(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const arr = keywords.split(",").map((k) => k.trim()).filter(Boolean);
    if (arr.length === 0) {
      setError("Please enter at least one keyword.");
      return;
    }
    setError("");
    setLoading(true);
    setResults(null);

    try {
      const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
      const res = await axios.post(`${BACKEND_URL}/analyze`, { keywords: arr });


      setResults(res.data);
      saveHistory(arr);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch analysis. Try again.");
      setResults(null);
    }

    setLoading(false);
  };

  const downloadCSV = (keyword, trendData) => {
    if (!trendData || trendData.length === 0) return;
    const filteredData = trendData.slice(-period);
    const headers = ["Date", "Value"];
    const rows = filteredData.map((d) => [d.date, d.value]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `${keyword}_trend.csv`);
    link.click();
  };

  const exportPDF = async () => {
    const input = document.getElementById("pdf-content");
    if (!input) return;

    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("trendlens_report.pdf");
  };

  const appStyle = {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: isDarkMode ? "#121212" : "#f9f9f9",
    color: isDarkMode ? "#fff" : "#000",
    minHeight: "100vh",
  };

  const sectionStyle = {
    padding: "40px 20px",
    maxWidth: "1200px",
    margin: "0 auto",
  };

  return (
    <div style={appStyle}>
      {/* Header with Dark/Light toggle */}
      <Header
        chartType={chartType}
        setChartType={setChartType}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />

      {/* Landing Section */}
      <section style={{ ...sectionStyle, textAlign: "center" }}>
        <h1>Welcome to TrendLens</h1>
        <p>Your AI-powered market trend analyzer. Explore keyword trends, sentiment, and AI summaries instantly.</p>
        <div>
            <img
              src={demo}
              alt="Demo Chart Placeholder"
              style={{ width: "80%", opacity: 0.7 }}
            />
          </div>

        
        <button onClick={() => window.scrollTo({ top: 600, behavior: "smooth" })} style={{ padding: "12px 24px", fontSize: "16px", borderRadius: "8px", border: "none", backgroundColor: "#4caf50", color: "#fff", cursor: "pointer" }}>
          Start Analyzing
        </button>
      </section>

      {/* How it works */}
      <section style={{ ...sectionStyle, textAlign: "center" }}>
        <h2>How It Works</h2>
        <div style={{ display: "flex", justifyContent: "center", gap: "40px", flexWrap: "wrap", marginTop: "30px" }}>
          {["Enter Keywords", "Analyze Trends", "Download Reports"].map((step, idx) => (
            <div key={idx} style={{ width: "250px", padding: "20px", backgroundColor: isDarkMode ? "#1e1e1e" : "#fff", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
              <div style={{ fontSize: "50px", marginBottom: "15px" }}>🔹</div>
              <h3>{step}</h3>
              <p>Step {idx+1} description goes here. You can explain briefly how users complete this step.</p>
            </div>
          ))}
        </div>
      </section>

      {/* Search Form with chart type & period selectors */}
      <section style={{ ...sectionStyle, textAlign: "center" }}>
        <form onSubmit={handleSubmit} style={{ display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap" }}>
          <input
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="Enter keywords separated by commas"
            style={{ flex: 1, minWidth: "250px", maxWidth: "400px", padding: "10px", fontSize: "16px", borderRadius: "8px", border: "1px solid #ccc", textAlign: "center" }}
          />
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            style={{ padding: "10px", borderRadius: "8px", cursor: "pointer" }}
          >
            <option value="line">Line Chart</option>
            <option value="bar">Bar Chart</option>
            <option value="radar">Radar Chart</option>
          </select>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            style={{ padding: "10px", borderRadius: "8px", cursor: "pointer" }}
          >
            <option value="6">Last 6 Months</option>
            <option value="12">Last 12 Months</option>
            <option value="24">Last 24 Months</option>
          </select>
          <button type="submit" style={{ padding: "10px 20px", fontSize: "16px", backgroundColor: "#4caf50", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}>
            Analyze
          </button>
        </form>

        {error && <p style={{ color: "red", marginTop: "15px" }}>{error}</p>}
        {loading && (
          <div style={{ margin: "20px 0" }}>
            <div className="spinner"></div>
            <p>Analyzing… Please wait.</p>
          </div>
        )}
      </section>

      {/* Search History */}
      {history.length > 0 && (
        <section style={sectionStyle}>
          <h3>Search History</h3>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "10px" }}>
            {history.map((kw, idx) => (
              <button key={idx} onClick={() => setKeywords(kw)} style={{ margin: "5px", padding: "5px 10px", cursor: "pointer", borderRadius: "5px", border: "1px solid #4caf50", backgroundColor: "#e8f5e9" }}>
                {kw}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Results Section */}
      {results && (
        <section id="pdf-content" style={sectionStyle}>
          <TrendChart results={results} chartType={chartType} period={period} isDarkMode={isDarkMode} />
          {Object.keys(results).map((kw) => (
            <div key={kw} style={{ padding: "25px", borderRadius: "12px", backgroundColor: isDarkMode ? "#1e1e1e" : "#fff", margin: "20px auto" }}>
              <h2 style={{ textAlign: "center" }}>{kw}</h2>
              {results[kw].error ? <p style={{ color: "red" }}>{results[kw].error}</p> :
                <div style={{ display: "flex", flexWrap: "wrap", gap: "30px", justifyContent: "center", alignItems: "center" }}>
                  <SentimentChart sentiment={results[kw].sentiment || { positive: 0, neutral: 0, negative: 0 }} />
                  <SummaryCard summary={results[kw].summary || "No summary"} />
                </div>
              }
              <button onClick={() => downloadCSV(kw, results[kw].trend_data)} style={{ padding: "8px 12px", backgroundColor: "#1976d2", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", marginTop: "15px" }}>
                Download Trend CSV
              </button>
            </div>
          ))}
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <button onClick={exportPDF} style={{ padding: "12px 24px", fontSize: "16px", borderRadius: "8px", border: "none", backgroundColor: "#ff5722", color: "#fff", cursor: "pointer" }}>
              Export Full Report as PDF
            </button>
          </div>
        </section>
      )}

      {/* Testimonials / Stats */}
      <section style={{ ...sectionStyle, textAlign: "center" }}>
        <h2>What Our Users Say</h2>
        <div style={{ display: "flex", justifyContent: "center", gap: "40px", flexWrap: "wrap", marginTop: "30px" }}>
          {["500+ Keywords Analyzed", "200+ Trend Reports Generated", "Trusted by Marketers"].map((stat, idx) => (
            <div key={idx} style={{ width: "250px", padding: "20px", backgroundColor: isDarkMode ? "#1e1e1e" : "#fff", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
              <div style={{ fontSize: "40px", marginBottom: "10px" }}>⭐</div>
              <h3>{stat}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <Footer isDarkMode={isDarkMode} />
      {/* Spinner CSS */}
      <style>{`
        .spinner {
          border: 6px solid #f3f3f3;
          border-top: 6px solid #4caf50;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          animation: spin 1s linear infinite;
          margin: auto;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default App;
