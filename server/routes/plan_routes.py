from flask import Blueprint, request, jsonify
from db.config import db_config
from utils.auth_utils import auth_utils
import uuid
from datetime import datetime, timedelta

plan_bp = Blueprint('plans', __name__, url_prefix='/api/plans')

@plan_bp.route('/create', methods=['POST'])
def create_plan():
    try:
        data = request.get_json()
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        
        if not token:
            return jsonify({'error': 'No token provided'}), 401
        
        # Decode token to get user_id
        user_data = auth_utils.decode_jwt_token(token)
        if not user_data:
            return jsonify({'error': 'Invalid token'}), 401
        
        user_id = user_data.get('user_id')
        
        # Extract plan data
        plan_data = {
            'id': str(uuid.uuid4()),
            'user_id': user_id,
            'name': data.get('name'),
            'color': data.get('color', '#E8E4F3'),
            'emoji': data.get('emoji', '🎯'),
            'duration_minutes': data.get('duration_minutes', 30),
            'start_time': data.get('start_time'),
            'end_time': data.get('end_time'),
            'scheduled_date': data.get('scheduled_date'),
            'is_anytime': bool(data.get('is_anytime', False)),
            'repeat_type': data.get('repeat_type', 'once'),  # once, daily, weekly, monthly, custom
            'reminder_at_start': data.get('reminder_at_start', False),
            'reminder_at_end': data.get('reminder_at_end', False),
            'reminder_before_minutes': data.get('reminder_before_minutes', 0),
            'checklist': data.get('checklist', []),
            'notes': data.get('notes', ''),
            'is_completed': False,
            'created_at': datetime.utcnow().isoformat(),
            'updated_at': datetime.utcnow().isoformat()
        }
        
        # Insert into database
        result = db_config.supabase.table('daily_plans').insert(plan_data).execute()
        
        if result.data:
            return jsonify({
                'success': True,
                'message': 'Plan created successfully',
                'plan': result.data[0]
            }), 201
        else:
            return jsonify({'error': 'Failed to create plan'}), 500
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@plan_bp.route('/user/<user_id>', methods=['GET'])
def get_user_plans(user_id):
    try:
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        
        if not token:
            return jsonify({'error': 'No token provided'}), 401
        
        # Verify token
        user_data = auth_utils.decode_jwt_token(token)
        if not user_data or user_data.get('user_id') != user_id:
            return jsonify({'error': 'Unauthorized'}), 401
        
        # Get plans for user
        result = db_config.supabase.table('daily_plans').select('*').eq('user_id', user_id).order('scheduled_date', desc=False).execute()
        
        return jsonify({
            'success': True,
            'plans': result.data
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@plan_bp.route('/<plan_id>', methods=['GET'])
def get_plan(plan_id):
    try:
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        
        if not token:
            return jsonify({'error': 'No token provided'}), 401
        
        # Verify token
        user_data = auth_utils.decode_jwt_token(token)
        if not user_data:
            return jsonify({'error': 'Invalid token'}), 401
        
        # Get plan
        result = db_config.supabase.table('daily_plans').select('*').eq('id', plan_id).eq('user_id', user_data.get('user_id')).execute()
        
        if result.data:
            return jsonify({
                'success': True,
                'plan': result.data[0]
            }), 200
        else:
            return jsonify({'error': 'Plan not found'}), 404
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@plan_bp.route('/<plan_id>', methods=['PUT'])
def update_plan(plan_id):
    try:
        data = request.get_json()
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        
        if not token:
            return jsonify({'error': 'No token provided'}), 401
        
        # Verify token
        user_data = auth_utils.decode_jwt_token(token)
        if not user_data:
            return jsonify({'error': 'Invalid token'}), 401
        
        # Update plan
        update_data = {**data, 'updated_at': datetime.utcnow().isoformat()}
        result = db_config.supabase.table('daily_plans').update(update_data).eq('id', plan_id).eq('user_id', user_data.get('user_id')).execute()
        
        if result.data:
            return jsonify({
                'success': True,
                'message': 'Plan updated successfully',
                'plan': result.data[0]
            }), 200
        else:
            return jsonify({'error': 'Plan not found or update failed'}), 404
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@plan_bp.route('/<plan_id>', methods=['DELETE'])
def delete_plan(plan_id):
    try:
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        
        if not token:
            return jsonify({'error': 'No token provided'}), 401
        
        # Verify token
        user_data = auth_utils.decode_jwt_token(token)
        if not user_data:
            return jsonify({'error': 'Invalid token'}), 401
        
        # Delete plan
        result = db_config.supabase.table('daily_plans').delete().eq('id', plan_id).eq('user_id', user_data.get('user_id')).execute()
        
        if result.data:
            return jsonify({
                'success': True,
                'message': 'Plan deleted successfully'
            }), 200
        else:
            return jsonify({'error': 'Plan not found'}), 404
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@plan_bp.route('/<plan_id>/complete', methods=['PUT'])
def toggle_plan_completion(plan_id):
    try:
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        
        if not token:
            return jsonify({'error': 'No token provided'}), 401
        
        # Verify token
        user_data = auth_utils.decode_jwt_token(token)
        if not user_data:
            return jsonify({'error': 'Invalid token'}), 401
        
        # Get current plan
        result = db_config.supabase.table('daily_plans').select('is_completed').eq('id', plan_id).eq('user_id', user_data.get('user_id')).execute()
        
        if not result.data:
            return jsonify({'error': 'Plan not found'}), 404
        
        # Toggle completion status
        new_status = not result.data[0]['is_completed']
        update_result = db_config.supabase.table('daily_plans').update({
            'is_completed': new_status,
            'updated_at': datetime.utcnow().isoformat()
        }).eq('id', plan_id).eq('user_id', user_data.get('user_id')).execute()
        
        if update_result.data:
            return jsonify({
                'success': True,
                'message': f'Plan marked as {"completed" if new_status else "incomplete"}',
                'is_completed': new_status
            }), 200
        else:
            return jsonify({'error': 'Failed to update plan'}), 500
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@plan_bp.route('/delete-all', methods=['DELETE'])
def delete_all_plans():
    try:
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        
        if not token:
            return jsonify({'error': 'No token provided'}), 401
        
        # Verify token
        user_data = auth_utils.decode_jwt_token(token)
        if not user_data:
            return jsonify({'error': 'Invalid token'}), 401
        
        user_id = user_data.get('user_id')
        
        # Delete all plans for user
        result = db_config.supabase.table('daily_plans').delete().eq('user_id', user_id).execute()
        
        return jsonify({
            'success': True,
            'message': 'All habits and tasks deleted successfully',
            'deleted_count': len(result.data) if result.data else 0
        }), 200
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500