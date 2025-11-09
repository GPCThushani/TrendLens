from flask import Flask, request, jsonify
from ai_models import analyze_trend

app = Flask(__name__)

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.get_json()
    keyword = data.get('keyword', '')
    result = analyze_trend(keyword)
    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True)
