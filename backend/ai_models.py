# ai_models.py
import os
import random
import nltk
from textblob import TextBlob
from sumy.parsers.plaintext import PlaintextParser
from sumy.nlp.tokenizers import Tokenizer
from sumy.summarizers.lex_rank import LexRankSummarizer
from pytrends.request import TrendReq
import pandas as pd
import numpy as np # Make sure numpy is in requirements.txt

# --- VERCEL FIX: Download NLTK data to /tmp ---
nltk_data_path = "/tmp/nltk_data"
if not os.path.exists(nltk_data_path):
    os.makedirs(nltk_data_path)
nltk.data.path.append(nltk_data_path)

try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt', download_dir=nltk_data_path)
try:
    nltk.data.find('tokenizers/punkt_tab')
except LookupError:
    nltk.download('punkt_tab', download_dir=nltk_data_path)
# ---------------------------------------------

pytrends = TrendReq(hl='en-US', tz=360)

def summarize_text(text, sentences_count=2):
    try:
        parser = PlaintextParser.from_string(text, Tokenizer("english"))
        summarizer = LexRankSummarizer()
        summary = summarizer(parser.document, sentences_count)
        return ' '.join(str(sentence) for sentence in summary)
    except Exception as e:
        print(f"Summarization error: {e}")
        return text[:150] + "..."

def predict_next_3_months(data_points):
    """
    Simple Linear Regression to forecast next 3 points.
    Input: List of integers (y-values)
    Output: List of 3 integers (forecast)
    """
    if not data_points or len(data_points) < 2:
        return []
    
    # Create x (0, 1, 2...) and y arrays
    x = np.arange(len(data_points))
    y = np.array(data_points)
    
    # Calculate slope (m) and intercept (b)
    # y = mx + b
    A = np.vstack([x, np.ones(len(x))]).T
    m, b = np.linalg.lstsq(A, y, rcond=None)[0]
    
    # Predict next 3 months
    future_x = np.arange(len(data_points), len(data_points) + 3)
    forecast = (m * future_x + b).astype(int)
    
    # Ensure no negative values
    return [max(0, val) for val in forecast]

def analyze_trend(keyword):
    # 1. Fetch Trend Data
    try:
        pytrends.build_payload([keyword], cat=0, timeframe='today 12-m', geo='', gprop='')
        df = pytrends.interest_over_time()
        if df.empty:
            raise ValueError("No trend data returned")
        
        trend_data = []
        values_only = []
        for date, row in df.iterrows():
            val = int(row[keyword])
            trend_data.append({
                "date": date.strftime("%Y-%m-%d"),
                "value": val
            })
            values_only.append(val)
            
    except Exception as e:
        print(f"Google Trends API Error: {e}")
        # Fallback dummy data
        values_only = [random.randint(20, 80) for _ in range(12)]
        trend_data = [{"date": f"2024-{i:02d}-01", "value": v} for i, v in enumerate(values_only, 1)]

    # 2. Forecasting
    forecast_values = predict_next_3_months(values_only)
    
    # 3. Related Queries (Rising topics)
    related_queries = []
    try:
        related_payload = pytrends.related_queries()
        if related_payload and keyword in related_payload:
            top_df = related_payload[keyword]['rising']
            if top_df is not None:
                # Get top 5 rising queries
                related_queries = top_df.head(5).to_dict('records')
    except Exception as e:
        print(f"Related queries error: {e}")

    # 4. Summarization
    avg_val = sum(values_only) // len(values_only)
    trend_direction = "increasing" if values_only[-1] > values_only[0] else "decreasing"
    
    description = (
        f"The interest in '{keyword}' is {trend_direction} with an average score of {avg_val}. "
        f"Our AI forecast suggests it might {'rise' if forecast_values[-1] > values_only[-1] else 'drop'} "
        f"to {forecast_values[-1]} in the coming months."
    )
    summary = summarize_text(description)

    # 5. Sentiment (Simulation)
    positive = round(random.uniform(0.3, 0.9), 2)
    negative = round(random.uniform(0, 1 - positive), 2)
    neutral = round(1 - positive - negative, 2)
    sentiment = {"positive": positive, "negative": negative, "neutral": neutral}

    return {
        "trend_data": trend_data,
        "forecast": forecast_values,
        "related_queries": related_queries,
        "summary": summary,
        "sentiment": sentiment
    }
