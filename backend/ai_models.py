import tweepy
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from transformers import pipeline

# Initialize sentiment analyzer
sia = SentimentIntensityAnalyzer()

# Optional summarizer
summarizer = pipeline("summarization")

# Tweepy setup
client = tweepy.Client(bearer_token='YOUR_TWITTER_BEARER_TOKEN')

def fetch_tweets(keyword, max_results=50):
    tweets = client.search_recent_tweets(query=keyword, max_results=max_results)
    return [tweet.text for tweet in tweets.data]

def sentiment_analysis(tweets):
    sentiment_counts = {'positive':0, 'neutral':0, 'negative':0}
    for text in tweets:
        score = sia.polarity_scores(text)
        if score['compound'] >= 0.05:
            sentiment_counts['positive'] += 1
        elif score['compound'] <= -0.05:
            sentiment_counts['negative'] += 1
        else:
            sentiment_counts['neutral'] += 1
    return sentiment_counts

def generate_summary(tweets):
    text = " ".join(tweets)
    if len(text.split()) > 10:
        summary = summarizer(text, max_length=50, min_length=20, do_sample=False)
        return summary[0]['summary_text']
    return text

def analyze_trend(keyword):
    tweets = fetch_tweets(keyword)
    sentiment = sentiment_analysis(tweets)
    summary = generate_summary(tweets)
    trend_data = []  # Optional: you can calculate daily counts for graph later
    return {
        'trend_data': trend_data,
        'sentiment': sentiment,
        'summary': summary
    }
