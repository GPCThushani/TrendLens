from flask import Flask, request, jsonify
from flask_cors import CORS
from ai_models import analyze_trend

app = Flask(__name__)
CORS(app)

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.get_json()
    keyword = data.get('text')  # make sure this matches frontend
    if not keyword:
        return jsonify({'error': 'No keyword provided'}), 400

    result = analyze_trend(keyword)

    # Ensure result has correct keys
    response = {
        'trend_data': result.get('trend_data', []),
        'sentiment': result.get('sentiment', {'positive': 0, 'neutral': 0, 'negative': 0}),
        'summary': result.get('summary', 'No summary available')
    }

    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)


