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
                    onboarding_data JSONB
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
                
            print("✅ All database tables are ready")
            
        except Exception as e:
            print(f"❌ Error checking tables: {e}")
            print("Please create the tables manually in your Supabase dashboard")

# Global database instance
db_config = DatabaseConfig()
