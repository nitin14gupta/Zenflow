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

                CREATE TABLE push_tokens (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    expo_push_token VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE push_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    expo_push_token VARCHAR(255),
    title TEXT,
    body TEXT,
    payload JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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