from flask import Flask, request, jsonify
from flask_cors import CORS
from ai_models import analyze_trend

app = Flask(__name__)
CORS(app)

# app.py (update analyze route)
@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.get_json()
    keywords = data.get('keywords')  # Expecting a list now
    if not keywords or not isinstance(keywords, list):
        return jsonify({'error': 'No keywords provided or not a list'}), 400

    results = {}
    for keyword in keywords:
        results[keyword] = analyze_trend(keyword)

    return jsonify(results)


if __name__ == '__main__':
    app.run(debug=True)


