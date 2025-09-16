from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
from db.config import db_config
from utils.auth_utils import auth_utils
from utils.email_service import email_service
import uuid

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        onboarding_data = data.get('onboarding_data', {})
        
        # Validation
        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400
        
        if not auth_utils.is_valid_email(email):
            return jsonify({'error': 'Invalid email format'}), 400
        
        if len(password) < 6:
            return jsonify({'error': 'Password must be at least 6 characters'}), 400
        
        # Check if user already exists
        supabase = db_config.get_client()
        existing_user = supabase.table('users').select('id').eq('email', email).execute()
        
        if existing_user.data:
            return jsonify({'error': 'User with this email already exists'}), 409
        
        # Hash password
        password_hash = auth_utils.hash_password(password)
        
        # Create user
        user_data = {
            'email': email,
            'password_hash': password_hash,
            'onboarding_data': onboarding_data,
            'is_verified': True,  # Auto-verify for now
            'created_at': datetime.utcnow().isoformat(),
            'updated_at': datetime.utcnow().isoformat()
        }
        
        result = supabase.table('users').insert(user_data).execute()
        
        if not result.data:
            return jsonify({'error': 'Failed to create user'}), 500
        
        user = result.data[0]
        
        # Generate JWT token
        token = auth_utils.generate_jwt_token(str(user['id']), email)
        
        # Send welcome email
        try:
            email_service.send_welcome_email(email)
        except Exception as e:
            print(f"Failed to send welcome email: {e}")
        
        return jsonify({
            'message': 'User created successfully',
            'token': token,
            'user': {
                'id': str(user['id']),
                'email': user['email'],
                'is_verified': user['is_verified']
            }
        }), 201
        
    except Exception as e:
        print(f"Registration error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        
        # Validation
        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400
        
        # Find user
        supabase = db_config.get_client()
        result = supabase.table('users').select('*').eq('email', email).execute()
        
        if not result.data:
            return jsonify({'error': 'Invalid credentials'}), 401
        
        user = result.data[0]
        
        # Verify password
        if not auth_utils.verify_password(password, user['password_hash']):
            return jsonify({'error': 'Invalid credentials'}), 401
        
        # Generate JWT token
        token = auth_utils.generate_jwt_token(str(user['id']), email)
        
        return jsonify({
            'message': 'Login successful',
            'token': token,
            'user': {
                'id': str(user['id']),
                'email': user['email'],
                'is_verified': user['is_verified'],
                'onboarding_data': user.get('onboarding_data', {})
            }
        }), 200
        
    except Exception as e:
        print(f"Login error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    try:
        data = request.get_json()
        email = data.get('email', '').strip().lower()
        
        if not email or not auth_utils.is_valid_email(email):
            return jsonify({'error': 'Valid email is required'}), 400
        
        # Check if user exists
        supabase = db_config.get_client()
        result = supabase.table('users').select('id').eq('email', email).execute()
        
        if not result.data:
            # Don't reveal if user exists or not for security
            return jsonify({'message': 'If an account with this email exists, a reset link has been sent'}), 200
        
        user_id = result.data[0]['id']
        
        # Generate reset token
        reset_token = auth_utils.generate_reset_token()
        expires_at = datetime.utcnow() + timedelta(hours=1)
        
        # Store reset token
        token_data = {
            'user_id': user_id,
            'token': reset_token,
            'expires_at': expires_at.isoformat(),
            'used': False,
            'created_at': datetime.utcnow().isoformat()
        }
        
        supabase.table('password_reset_tokens').insert(token_data).execute()
        
        # Send reset email
        if email_service.send_password_reset_email(email, reset_token):
            return jsonify({'message': 'Password reset link sent to your email'}), 200
        else:
            return jsonify({'error': 'Failed to send reset email'}), 500
        
    except Exception as e:
        print(f"Forgot password error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    try:
        data = request.get_json()
        token = data.get('token', '').strip()
        new_password = data.get('password', '')
        
        if not token or not new_password:
            return jsonify({'error': 'Token and new password are required'}), 400
        
        if len(new_password) < 6:
            return jsonify({'error': 'Password must be at least 6 characters'}), 400
        
        # Find valid token
        supabase = db_config.get_client()
        result = supabase.table('password_reset_tokens').select('*').eq('token', token).eq('used', False).execute()
        
        if not result.data:
            return jsonify({'error': 'Invalid or expired reset token'}), 400
        
        token_record = result.data[0]
        
        # Check if token is expired
        expires_at = datetime.fromisoformat(token_record['expires_at'].replace('Z', '+00:00'))
        if datetime.utcnow() > expires_at:
            return jsonify({'error': 'Reset token has expired'}), 400
        
        # Update password
        password_hash = auth_utils.hash_password(new_password)
        user_id = token_record['user_id']
        
        supabase.table('users').update({
            'password_hash': password_hash,
            'updated_at': datetime.utcnow().isoformat()
        }).eq('id', user_id).execute()
        
        # Mark token as used
        supabase.table('password_reset_tokens').update({'used': True}).eq('id', token_record['id']).execute()
        
        return jsonify({'message': 'Password reset successfully'}), 200
        
    except Exception as e:
        print(f"Reset password error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@auth_bp.route('/verify-token', methods=['POST'])
def verify_token():
    try:
        data = request.get_json()
        token = data.get('token', '')
        
        if not token:
            return jsonify({'error': 'Token is required'}), 400
        
        payload = auth_utils.verify_jwt_token(token)
        if not payload:
            return jsonify({'error': 'Invalid or expired token'}), 401
        
        # Get user data
        supabase = db_config.get_client()
        result = supabase.table('users').select('*').eq('id', payload['user_id']).execute()
        
        if not result.data:
            return jsonify({'error': 'User not found'}), 404
        
        user = result.data[0]
        
        return jsonify({
            'valid': True,
            'user': {
                'id': str(user['id']),
                'email': user['email'],
                'is_verified': user['is_verified'],
                'onboarding_data': user.get('onboarding_data', {})
            }
        }), 200
        
    except Exception as e:
        print(f"Token verification error: {e}")
        return jsonify({'error': 'Internal server error'}), 500
