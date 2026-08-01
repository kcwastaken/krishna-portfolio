import os
import json
from supabase import create_client, Client
from http.server import BaseHTTPRequestHandler

# Grab keys from the .env file
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

class handler(BaseHTTPRequestHandler):
    
    # 1. FETCH TOP SCORES (GET Request)
    def do_GET(self):
        try:
            # Fetch top 10 scores from the 'leaderboard' table, highest first
            response = supabase.table('leaderboard').select('*').order('score', desc=True).limit(10).execute()
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(response.data).encode('utf-8'))
            
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))

    # 2. SAVE A NEW SCORE (POST Request)
    def do_POST(self):
        try:
            # Read the data sent from your frontend JavaScript
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data)
            
            player_name = data.get('name', 'Anonymous')
            player_score = data.get('score', 0)
            
            # Insert the new score into the 'leaderboard' table
            response = supabase.table('leaderboard').insert({'name': player_name, 'score': player_score}).execute()
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(response.data).encode('utf-8'))
            
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))