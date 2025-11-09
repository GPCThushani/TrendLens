def analyze_trend(keyword):
    # Replace this with your real model code
    trend_data = [
        {'date': '2025-11-01', 'count': 10},
        {'date': '2025-11-02', 'count': 15},
        {'date': '2025-11-03', 'count': 7},
    ]
    sentiment = {'positive': 60, 'neutral': 25, 'negative': 15}
    summary = f"Summary for '{keyword}'"

    return {
        'trend_data': trend_data,
        'sentiment': sentiment,
        'summary': summary
    }
