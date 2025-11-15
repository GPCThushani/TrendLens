// App.js
import React, { useState } from "react";
import axios from "axios";
import TrendChart from "./components/TrendChart";
import SentimentChart from "./components/SentimentChart";
import SummaryCard from "./components/SummaryCard";

function App() {
  const [keywords, setKeywords] = useState(""); // comma-separated
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const arr = keywords
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);

    if (arr.length === 0) {
      setError("Please enter at least one keyword.");
      return;
    }

    setError("");
    setLoading(true);
    setResults(null);

    try {
      const res = await axios.post("http://localhost:5000/analyze", {
        keywords: arr,
      });
      setResults(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch analysis. Try again.");
      setResults(null);
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        padding: "30px",
        maxWidth: "1000px",
        margin: "0 auto",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "25px" }}>
        TrendLens – AI Market Trend Analyzer
      </h1>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          flexWrap: "wrap",
          marginBottom: "20px",
        }}
      >
        <input
          type="text"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          placeholder="Enter keywords separated by commas"
          style={{
            flex: 1,
            minWidth: "250px",
            maxWidth: "500px",
            padding: "10px",
            fontSize: "16px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            textAlign: "center",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#4caf50",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Analyze
        </button>
      </form>

      {error && (
        <p style={{ color: "red", textAlign: "center", marginBottom: "20px" }}>
          {error}
        </p>
      )}

      {loading && (
        <div style={{ textAlign: "center", margin: "20px 0" }}>
          <div className="spinner"></div>
          <p>Analyzing… Please wait.</p>
        </div>
      )}

      {/* Multi-keyword line chart */}
      {results && <TrendChart results={results} />}

      {/* Individual keyword cards */}
      {results &&
        Object.keys(results).map((kw) => (
          <div
            key={kw}
            style={{
              marginBottom: "40px",
              padding: "25px",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              backgroundColor: "#fff",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              maxWidth: "800px",
              margin: "0 auto",
            }}
          >
            <h2 style={{ marginBottom: "20px", textAlign: "center" }}>{kw}</h2>

            {results[kw].error ? (
              <p style={{ color: "red" }}>Error: {results[kw].error}</p>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "30px",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <SentimentChart
                  sentiment={
                    results[kw].sentiment || {
                      positive: 0,
                      neutral: 0,
                      negative: 0,
                    }
                  }
                />
                <SummaryCard summary={results[kw].summary || "No summary"} />
              </div>
            )}
          </div>
        ))}

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
