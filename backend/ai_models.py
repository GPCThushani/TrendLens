import random
from textblob import TextBlob
from sumy.parsers.plaintext import PlaintextParser
from sumy.nlp.tokenizers import Tokenizer
from sumy.summarizers.lex_rank import LexRankSummarizer

def summarize_text(text, sentences_count=2):
    """
    Generate a short summary from the input text.
    """
    parser = PlaintextParser.from_string(text, Tokenizer("english"))
    summarizer = LexRankSummarizer()
    summary = summarizer(parser.document, sentences_count)
    return ' '.join(str(sentence) for sentence in summary)

def analyze_trend(keyword):
    """
    Generate dummy trend data, summary, and sentiment for a given keyword.
    This will produce variable data so charts and summary are dynamic.
    """
    # Generate base value related to keyword length
    base = len(keyword) * 5 + random.randint(10, 40)

    # Generate monthly trend data
    trend_data = []
    for i in range(1, 13):
        value = base + random.randint(-20, 20)
        trend_data.append({
            "date": f"2024-{i:02d}-01",
            "value": max(0, value)
        })

    # Create a description for summarization
    trend_description = (
        f"The keyword '{keyword}' has generated monthly trend values across twelve months. "
        f"The average activity level is around {sum(d['value'] for d in trend_data)//12}. "
        f"This indicates fluctuating interest influenced by various factors. "
        f"The highest value seems to show strong relevance in some months, while others remain lower."
    )
    summary = summarize_text(trend_description)

    # Dynamic sentiment based on trend data
    total_trend = sum(d['value'] for d in trend_data)
    positive = round(random.uniform(0, 1), 2)
    negative = round(random.uniform(0, 1 - positive), 2)
    neutral = round(1 - positive - negative, 2)
    if neutral < 0:
        neutral = 0

    sentiment = {"positive": positive, "negative": negative, "neutral": neutral}

    return {
        "trend_data": trend_data,
        "summary": summary,
        "sentiment": sentiment
    }
