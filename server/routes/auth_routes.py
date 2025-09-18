from flask import Blueprint, request, jsonify
from db.config import db_config
from utils.auth_utils import auth_utils
import bcrypt
from datetime import datetime


auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')


@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json() or {}
        email = (data.get('email') or '').strip().lower()
        password = data.get('password') or ''
        onboarding_data = data.get('onboarding_data')

        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400

        # Check if user exists
        existing = db_config.supabase.table('users').select('id').eq('email', email).limit(1).execute()
        if existing.data:
            return jsonify({'error': 'User already exists'}), 409

        password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        payload = {
            'email': email,
            'password_hash': password_hash,
            'is_verified': False,
            'onboarding_data': onboarding_data,
            'created_at': datetime.utcnow().isoformat(),
            'updated_at': datetime.utcnow().isoformat(),
        }

        created = db_config.supabase.table('users').insert(payload).execute()
        if not created.data:
            return jsonify({'error': 'Failed to create user'}), 500

        user = created.data[0]
        token = auth_utils.generate_jwt_token(user_id=str(user['id']), email=email)

        return jsonify({
            'message': 'Registration successful',
            'token': token,
            'user': {
                'id': str(user['id']),
                'email': user['email'],
                'is_verified': bool(user.get('is_verified', False)),
                'onboarding_data': user.get('onboarding_data')
            }
        }), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json() or {}
        email = (data.get('email') or '').strip().lower()
        password = data.get('password') or ''

        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400

        found = db_config.supabase.table('users').select('*').eq('email', email).limit(1).execute()
        if not found.data:
            return jsonify({'error': 'Invalid credentials'}), 401

        user = found.data[0]
        if not bcrypt.checkpw(password.encode('utf-8'), user['password_hash'].encode('utf-8')):
            return jsonify({'error': 'Invalid credentials'}), 401

        token = auth_utils.generate_jwt_token(user_id=str(user['id']), email=email)
        return jsonify({
            'message': 'Login successful',
            'token': token,
            'user': {
                'id': str(user['id']),
                'email': user['email'],
                'is_verified': bool(user.get('is_verified', False)),
                'onboarding_data': user.get('onboarding_data')
            }
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@auth_bp.route('/verify-token', methods=['POST'])
def verify_token():
    try:
        data = request.get_json() or {}
        token = data.get('token')
        if not token:
            return jsonify({'error': 'Token is required'}), 400

        payload = auth_utils.verify_jwt_token(token)
        if not payload:
            return jsonify({'success': False, 'valid': False}), 200

        user_id = payload.get('user_id')
        user_res = db_config.supabase.table('users').select('*').eq('id', user_id).limit(1).execute()
        if not user_res.data:
            return jsonify({'success': False, 'valid': False}), 200

        user = user_res.data[0]
        return jsonify({
            'success': True,
            'valid': True,
            'user': {
                'id': str(user['id']),
                'email': user['email'],
                'is_verified': bool(user.get('is_verified', False)),
                'onboarding_data': user.get('onboarding_data')
            }
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500