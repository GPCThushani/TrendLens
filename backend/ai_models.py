# ai_models.py
from pytrends.request import TrendReq
from nltk.sentiment.vader import SentimentIntensityAnalyzer
import random
import nltk

nltk.download('vader_lexicon')

# Initialize VADER
sentiment_analyzer = SentimentIntensityAnalyzer()

def analyze_trend(keyword):
    # Initialize Google Trends connection
    pytrends = TrendReq(hl='en-US', tz=330)

    try:
        pytrends.build_payload([keyword], timeframe='today 12-m')
        data = pytrends.interest_over_time()
    except Exception as e:
        print("Error fetching Google Trends data:", e)
        data = None

    # Prepare trend data
    trend_data = []
    if data is not None and not data.empty:
        for date, value in data[keyword].items():
            trend_data.append({"date": str(date.date()), "value": int(value)})
    else:
        trend_data = [{"date": f"2024-{i:02d}-01", "value": random.randint(10, 100)} for i in range(1, 13)]

    # Simple summary
    summary = f"The trend for '{keyword}' shows {len(trend_data)} months of data. Latest interest value is {trend_data[-1]['value']}."

    # Sentiment analysis
    sentiment_score = sentiment_analyzer.polarity_scores(keyword)
    sentiment = {
        'positive': int(sentiment_score['pos'] * 100),
        'neutral': int(sentiment_score['neu'] * 100),
        'negative': int(sentiment_score['neg'] * 100)
    }

    return {
        'trend_data': trend_data,
        'sentiment': sentiment,
        'summary': summary
    }
