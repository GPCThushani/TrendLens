import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from backend.ai_models import analyze_trend

app = Flask(__name__)
CORS(app)

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.get_json() or {}
    # accept either {"text":"..." } OR {"keywords":["a","b"]}
    if 'keywords' in data and isinstance(data['keywords'], list):
        keywords = data['keywords']
    else:
        text = data.get('text') or data.get('keyword') or ''
        if not text:
            return jsonify({'error':'No keyword provided'}), 400
        keywords = [text]

    results = {}
    for kw in keywords:
        try:
            res = analyze_trend(kw)
            # normalize keys
            results[kw] = {
                'trend_data': res.get('trend_data', []),
                'sentiment': res.get('sentiment', {'positive':0,'neutral':0,'negative':0}),
                'summary': res.get('summary', '')
            }
        except Exception as e:
            results[kw] = {'error': str(e)}

    return jsonify(results)

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))  # Railway sets PORT automatically
    app.run(host="0.0.0.0", port=port)
