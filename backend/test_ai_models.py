from ai_models import analyze_trend

def test_analyze_shape():
    res = analyze_trend("test keyword")
    assert 'trend_data' in res
    assert 'sentiment' in res
    assert 'summary' in res
