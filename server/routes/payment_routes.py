from flask import Blueprint, request, jsonify
from db.config import db_config
from utils.auth_utils import auth_utils
from utils.payment_service import payment_service
from datetime import datetime

payments_bp = Blueprint('payments', __name__, url_prefix='/api/payments')


@payments_bp.route('/create-order', methods=['POST'])
def create_order():
    try:
        data = request.get_json() or {}
        plan = data.get('plan')  # 'weekly' | 'yearly'
        if plan not in ['weekly', 'yearly']:
            return jsonify({'error': 'Invalid plan'}), 400

        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        if not token:
            return jsonify({'error': 'No token provided'}), 401

        user_data = auth_utils.decode_jwt_token(token)
        if not user_data:
            return jsonify({'error': 'Invalid token'}), 401

        amount_rupees = 700 if plan == 'weekly' else 3550
        receipt = f"sub_{plan}_{user_data.get('user_id')}_{int(datetime.utcnow().timestamp())}"
        order = payment_service.create_order(amount_rupees, receipt)

        if not order:
            return jsonify({'error': 'Failed to create order'}), 500

        return jsonify({
            'success': True,
            'order': order,
            'key_id': payment_service.key_id,
            'amount': amount_rupees * 100,
            'currency': 'INR',
            'plan': plan,
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@payments_bp.route('/verify', methods=['POST'])
def verify_and_activate():
    try:
        data = request.get_json() or {}
        plan = data.get('plan')
        order_id = data.get('razorpay_order_id')
        payment_id = data.get('razorpay_payment_id')
        signature = data.get('razorpay_signature')

        if plan not in ['weekly', 'yearly']:
            return jsonify({'error': 'Invalid plan'}), 400

        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        if not token:
            return jsonify({'error': 'No token provided'}), 401

        user_data = auth_utils.decode_jwt_token(token)
        if not user_data:
            return jsonify({'error': 'Invalid token'}), 401

        if not payment_service.verify_payment_signature(order_id, payment_id, signature):
            return jsonify({'error': 'Signature verification failed'}), 400

        plan_name, expires_at = payment_service.compute_expiry(plan)

        supabase = db_config.get_client()
        update_res = supabase.table('users').update({
            'is_premium': True,
            'subscription_plan': plan_name,
            'subscription_expires_at': expires_at.isoformat(),
            'updated_at': datetime.utcnow().isoformat(),
        }).eq('id', user_data.get('user_id')).execute()

        if not update_res.data:
            return jsonify({'error': 'Failed to update subscription'}), 500

        return jsonify({'success': True, 'expires_at': expires_at.isoformat(), 'plan': plan_name}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@payments_bp.route('/activate-test', methods=['POST'])
def activate_test():
    # Helper endpoint for test/dev where client cannot open native checkout
    try:
        data = request.get_json() or {}
        plan = data.get('plan')
        if plan not in ['weekly', 'yearly']:
            return jsonify({'error': 'Invalid plan'}), 400

        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        if not token:
            return jsonify({'error': 'No token provided'}), 401

        user_data = auth_utils.decode_jwt_token(token)
        if not user_data:
            return jsonify({'error': 'Invalid token'}), 401

        plan_name, expires_at = payment_service.compute_expiry(plan)

        supabase = db_config.get_client()
        update_res = supabase.table('users').update({
            'is_premium': True,
            'subscription_plan': plan_name,
            'subscription_expires_at': expires_at.isoformat(),
            'updated_at': datetime.utcnow().isoformat(),
        }).eq('id', user_data.get('user_id')).execute()

        if not update_res.data:
            return jsonify({'error': 'Failed to update subscription'}), 500

        return jsonify({'success': True, 'expires_at': expires_at.isoformat(), 'plan': plan_name, 'test_mode': True}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


