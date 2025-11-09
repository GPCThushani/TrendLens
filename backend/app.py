from flask import Flask, request, jsonify
from flask_cors import CORS
from ai_models import analyze_trend

app = Flask(__name__)
CORS(app)

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.get_json()
    text = data.get('text', '')  # matches frontend key
    result = analyze_trend(text)
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
