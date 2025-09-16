-- Users table
CREATE TABLE users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_verified BOOLEAN DEFAULT FALSE,
    onboarding_data JSONB
);

-- Password reset tokens table
CREATE TABLE password_reset_tokens (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Daily plans table
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);