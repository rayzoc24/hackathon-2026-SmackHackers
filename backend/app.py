from flask import Flask, redirect, url_for, session, request, jsonify
from flask_cors import CORS
from authlib.integrations.flask_client import OAuth # type: ignore
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv('SECRET_KEY', 'your-secret-key-here')
CORS(app, supports_credentials=True, origins=['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5500', 'http://127.0.0.1:5500'])

oauth = OAuth(app)

google = oauth.register(
    name='google',
    client_id=os.getenv('GOOGLE_CLIENT_ID'),
    client_secret=os.getenv('GOOGLE_CLIENT_SECRET'),
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={'scope': 'openid email profile'}
)

@app.route('/auth/google')
def auth_google():
    redirect_uri = url_for('auth_google_callback', _external=True)
    return google.authorize_redirect(redirect_uri)

@app.route('/auth/google/callback')
def auth_google_callback():
    try:
        token = google.authorize_access_token()
        user = token.get('userinfo')
        if user:
            session['user'] = user
            # Pass user info in URL parameters
            from urllib.parse import quote
            email = quote(user.get('email', ''))
            name = quote(user.get('name', 'Student'))
            picture = quote(user.get('picture', ''))
            return redirect(f'http://localhost:5500/hackathontrial/index.html?login=success&email={email}&name={name}&picture={picture}')
        else:
            return redirect('http://localhost:5500/hackathontrial/login.html?error=no_user_info')
    except Exception as e:
        print(f"Error during Google callback: {e}")
        return redirect('http://localhost:3000/hackathontrial/login.html?error=auth_failed')

@app.route('/api/user', methods=['GET'])
def get_user():
    user = session.get('user')
    return {'user': user} if user else {'error': 'Not authenticated'}, 401

@app.route('/logout')
def logout():
    session.pop('user', None)
    return redirect('http://localhost:5500/hackathontrial/index.html')

if __name__ == '__main__':
    app.run(debug=True)
