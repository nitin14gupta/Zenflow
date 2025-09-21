import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

class DatabaseConfig:
    def __init__(self):
        self.supabase_url = os.getenv('SUPABASE_URL')
        self.supabase_key = os.getenv('SUPABASE_KEY')
        self.supabase_service_key = os.getenv('SUPABASE_SERVICE_KEY')
        
        if not all([self.supabase_url, self.supabase_key]):
            raise ValueError("Missing Supabase configuration")
        
        self.supabase: Client = create_client(self.supabase_url, self.supabase_key)
    
    def get_client(self) -> Client:
        return self.supabase
    
    def create_tables(self):
        """Create necessary tables if they don't exist"""
        try:
            # Check if tables exist by trying to query them
            try:
                # Try to query users table
                self.supabase.table('users').select('id').limit(1).execute()
                print("✅ Users table already exists")
            except Exception:
                print("❌ Users table doesn't exist - please create it manually in Supabase dashboard")
                print("""
                Please run this SQL in your Supabase SQL Editor:
                
                CREATE TABLE users (
                    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                    email VARCHAR(255) UNIQUE NOT NULL,
                    password_hash VARCHAR(255) NOT NULL,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                    is_verified BOOLEAN DEFAULT FALSE,
                    onboarding_data JSONB,
                    is_premium BOOLEAN DEFAULT FALSE,
                    subscription_plan VARCHAR(20),
                    subscription_expires_at TIMESTAMP WITH TIME ZONE  
                );
                
                CREATE TABLE password_reset_tokens (
                    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
                    token VARCHAR(255) UNIQUE NOT NULL,
                    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
                    used BOOLEAN DEFAULT FALSE,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
                );
                """)
                return
            # Optional: check subscription columns exist
            try:
                self.supabase.table('users').select('is_premium, subscription_plan, subscription_expires_at').limit(1).execute()
                print("✅ Subscription columns exist on users table")
            except Exception:
                print("ℹ️ Add subscription columns to users table in Supabase SQL Editor:")
                print(
                    """
ALTER TABLE users
ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS subscription_plan VARCHAR(20),
ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMP WITH TIME ZONE;
                    """
                )
            
            try:
                # Try to query password_reset_tokens table
                self.supabase.table('password_reset_tokens').select('id').limit(1).execute()
                print("✅ Password reset tokens table already exists")
            except Exception:
                print("❌ Password reset tokens table doesn't exist - please create it manually in Supabase dashboard")
                print("""
                Please run this SQL in your Supabase SQL Editor:
                
                CREATE TABLE password_reset_tokens (
                    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
                    token VARCHAR(255) UNIQUE NOT NULL,
                    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
                    used BOOLEAN DEFAULT FALSE,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
                );
                """)
                return

            try:
                # Try to query daily_plans table
                self.supabase.table('daily_plans').select('id').limit(1).execute()
                print("✅ Daily plans table already exists")
            except Exception:
                print("❌ Daily plans table doesn't exist - please create it manually in Supabase dashboard")
                print("""
                Please run this SQL in your Supabase SQL Editor:
                
                CREATE TABLE daily_plans (
                    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
                    name VARCHAR(255) NOT NULL,
                    color VARCHAR(7) DEFAULT '#E8E4F3',
                    emoji VARCHAR(10) DEFAULT '🎯',
                    duration_minutes INTEGER DEFAULT 30,
                    start_time TIME,
                    end_time TIME,
                    scheduled_date DATE,
                    is_anytime BOOLEAN DEFAULT FALSE,
                    repeat_type VARCHAR(20) DEFAULT 'once',
                    reminder_at_start BOOLEAN DEFAULT FALSE,
                    reminder_at_end BOOLEAN DEFAULT FALSE,
                    reminder_before_minutes INTEGER DEFAULT 0,
                    checklist JSONB DEFAULT '[]',
                    notes TEXT DEFAULT '',
                    is_completed BOOLEAN DEFAULT FALSE,
                    is_skipped BOOLEAN DEFAULT FALSE,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
                );
                """)
                return
            
            # Push tokens table
            try:
                self.supabase.table('push_tokens').select('id').limit(1).execute()
                print("✅ Push tokens table already exists")
            except Exception:
                print("❌ Push tokens table doesn't exist - please create it manually in Supabase dashboard")
                print(
                    """
CREATE TABLE push_tokens (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    expo_push_token VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
                    """
                )
                return

            # Plan instances table for tracking daily completions
            try:
                self.supabase.table('plan_instances').select('id').limit(1).execute()
                print("✅ Plan instances table already exists")
            except Exception:
                print("❌ Plan instances table doesn't exist - please create it manually in Supabase dashboard")
                print("""
                Please run this SQL in your Supabase SQL Editor:
                
                CREATE TABLE plan_instances (
                    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                    plan_id UUID REFERENCES daily_plans(id) ON DELETE CASCADE,
                    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
                    instance_date DATE NOT NULL,
                    is_completed BOOLEAN DEFAULT FALSE,
                    is_skipped BOOLEAN DEFAULT FALSE,
                    completed_at TIMESTAMP WITH TIME ZONE,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                    UNIQUE(plan_id, instance_date)
                );
                
                CREATE INDEX idx_plan_instances_plan_date ON plan_instances(plan_id, instance_date);
                CREATE INDEX idx_plan_instances_user_date ON plan_instances(user_id, instance_date);
                """)
                return

            # Optional: push event logs table (to help debug and avoid spam)
            try:
                self.supabase.table('push_events').select('id').limit(1).execute()
                print("✅ Push events table already exists")
            except Exception:
                print("ℹ️ (Optional) Create push_events table for logging:")
                print(
                    """
CREATE TABLE push_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    expo_push_token VARCHAR(255),
    title TEXT,
    body TEXT,
    payload JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
                    """
                )
                
            print("✅ All database tables are ready")
            
        except Exception as e:
            print(f"❌ Error checking tables: {e}")
            print("Please create the tables manually in your Supabase dashboard")

# Global database instance
db_config = DatabaseConfig()
