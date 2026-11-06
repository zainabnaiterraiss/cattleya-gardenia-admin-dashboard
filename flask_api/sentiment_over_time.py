from flask import Flask, jsonify
from flask_cors import CORS
import mysql.connector
import socket
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/api/healthcheck', methods=['GET'])
def healthcheck():
    """Enhanced health check endpoint"""
    try:
        # Get server IP information
        hostname = socket.gethostname()
        ip_address = socket.gethostbyname(hostname)
        
        return jsonify({
            "status": "healthy",
            "service": "sentiment_analysis",
            "server": {
                "hostname": hostname,
                "ip_address": ip_address,
                "port": 5000
            },
            "timestamp": datetime.now().isoformat(),
            "endpoints": {
                "sentiment_data": "/api/sentiment_over_time",
                "healthcheck": "/api/healthcheck"
            }
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

if __name__ == '__main__':
    print("\n=== Starting Flask Server ===")
    print("Available Endpoints:")
    print(" - http://localhost:5000/api/healthcheck")
    print(" - http://localhost:5000/api/sentiment_over_time")
    print("\nAccessible Network URLs:")
    print(f" - http://{socket.gethostbyname(socket.gethostname())}:5000/api/healthcheck")
    print("\nStarting server...\n")
    
    app.run(host='0.0.0.0', port=5000, debug=True)