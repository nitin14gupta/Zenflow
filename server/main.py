from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
import asyncio
from db.config import db_config
from routes.auth_routes import auth_bp
from routes.google_auth_routes import auth_google_bp
from routes.apple_auth_routes import auth_apple_bp
from routes.plan_routes import plan_bp
from routes.push_routes import push_bp
from routes.iap_routes import iap_bp
from utils.push_service import push_service
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime, timedelta
import random
from db.config import db_config

# Load environment variables
load_dotenv()

def create_app():
    app = Flask(__name__)
    
    # Enable CORS for all routes
    CORS(app, origins=['http://localhost:3000', 'http://localhost:8081', 'http://localhost:19006', 'http://192.168.0.105:19006', 'exp://192.168.*.*:8081'])
    
    # Register blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(auth_google_bp)
    app.register_blueprint(auth_apple_bp)
    app.register_blueprint(plan_bp)
    app.register_blueprint(push_bp)
    app.register_blueprint(iap_bp)
    
    # Health check endpoint
    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({
            'status': 'healthy',
            'message': 'ZenFlow API is running',
            'version': '1.0.0'
        })
    
    # Root endpoint
    @app.route('/', methods=['GET'])
    def root():
        return jsonify({
            'message': 'Welcome to ZenFlow API',
            'version': '1.0.0',
            'endpoints': {
                'auth': '/api/auth',
                'health': '/api/health'
            }
        })
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Endpoint not found'}), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({'error': 'Internal server error'}), 500
    
    return app

def setup_database():
    """Initialize database tables"""
    try:
        db_config.create_tables()
    except Exception as e:
        print(f"Database setup warning: {e}")

if __name__ == '__main__':
    # Setup database
    setup_database()
    
    # Create and run app
    app = create_app()

    # Scheduler for periodic notifications
    scheduler = BackgroundScheduler()

    def send_daily_nudges():
        try:
            supabase = db_config.get_client()
            res = supabase.table('push_tokens').select('expo_push_token').execute()
            tokens = [row['expo_push_token'] for row in (res.data or [])]
            if not tokens:
                return
            # Pick up to 5 random tokens to avoid spamming
            sample_size = min(5, len(tokens))
            target_tokens = random.sample(tokens, sample_size)

            titles = [
                'Keep your streak alive 🔥',
                'Quick win time ✨',
                '2 minutes for future you ⏳',
                'ZenFlow check-in 🧘',
                'Tiny step, big impact 🚀',
            ]
            bodies = [
                'Open ZenFlow and plan your next move.',
                'A 2-minute action beats perfect plans.',
                'What’s one small task you can do now?',
                'Momentum loves consistency.',
                'Show up for yourself today.',
            ]

            messages = []
            for t in target_tokens:
                messages.append(
                    push_service.build_message(
                        t,
                        random.choice(titles),
                        random.choice(bodies),
                        {'type': 'nudge'}
                    )
                )

            push_service.send_messages(messages)
        except Exception as e:
            print(f"Nudge scheduler error: {e}")

    # Run 4-5 nudges throughout the day (e.g., every ~3 hours during 9-21)
    scheduler.add_job(send_daily_nudges, 'cron', hour='9,12,15,18,21', minute=0)

    # Plan-based reminders
    def send_plan_reminders():
        try:
            supabase = db_config.get_client()
            now = datetime.utcnow()
            today_str = now.date().isoformat()

            # Fetch plans scheduled for today and not completed
            res = supabase.table('daily_plans').select('*').eq('scheduled_date', today_str).eq('is_completed', False).execute()
            plans = res.data or []

            # Map user -> tokens
            tokens_res = supabase.table('push_tokens').select('user_id, expo_push_token').execute()
            user_to_tokens = {}
            for row in (tokens_res.data or []):
                user_to_tokens.setdefault(row.get('user_id'), []).append(row['expo_push_token'])

            messages = []
            for plan in plans:
                user_id = plan.get('user_id')
                tokens = user_to_tokens.get(user_id, [])
                if not tokens:
                    continue

                # Parse stored time strings like "6:00 PM"
                def parse_time(tstr):
                    if not tstr:
                        return None
                    try:
                        return datetime.strptime(f"{today_str} {tstr}", "%Y-%m-%d %I:%M %p")
                    except Exception:
                        return None

                start_dt = parse_time(plan.get('start_time'))
                end_dt = parse_time(plan.get('end_time'))

                def near(target_dt, delta_minutes):
                    if not target_dt:
                        return False
                    return abs((target_dt - now).total_seconds()) <= delta_minutes * 60

                # Build messages based on reminder flags
                if plan.get('reminder_at_start') and start_dt and near(start_dt, 1):
                    for t in tokens:
                        messages.append(push_service.build_message(
                            t,
                            f"It’s time: {plan.get('name')}",
                            "Tap to start your session.",
                            {'type': 'plan_start', 'plan_id': plan.get('id')}
                        ))
                if plan.get('reminder_at_end') and end_dt and near(end_dt, 1):
                    for t in tokens:
                        messages.append(push_service.build_message(
                            t,
                            f"Wrap up: {plan.get('name')}",
                            "How did it go? Mark complete.",
                            {'type': 'plan_end', 'plan_id': plan.get('id')}
                        ))
                before_mins = plan.get('reminder_before_minutes') or 0
                if before_mins > 0 and start_dt:
                    before_dt = start_dt - timedelta(minutes=before_mins)
                    if near(before_dt, 1):
                        for t in tokens:
                            messages.append(push_service.build_message(
                                t,
                                f"Starting soon: {plan.get('name')}",
                                f"Begins in {before_mins} minutes.",
                                {'type': 'plan_before', 'plan_id': plan.get('id')}
                            ))

            if messages:
                push_service.send_messages(messages)
        except Exception as e:
            print(f"Plan reminder scheduler error: {e}")

    # Run every minute to catch start/end/5-min reminders
    scheduler.add_job(send_plan_reminders, 'interval', minutes=1)

    scheduler.start()
    
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('FLASK_DEBUG', 'True').lower() == 'true'
    
    print(f"🚀 Starting ZenFlow API server on port {port}")
    print(f"📊 Database: Supabase")
    print(f"🔐 Auth: JWT + bcrypt")
    print(f"📧 Email: SMTP")
    
    app.run(host='0.0.0.0', port=port, debug=debug)