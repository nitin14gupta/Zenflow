import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional

class EmailService:
    def __init__(self):
        self.smtp_username = os.getenv('SMTP_USERNAME')
        self.smtp_password = os.getenv('SMTP_PASSWORD')
        self.smtp_server = 'smtp.gmail.com'
        self.smtp_port = 587
        
        if not self.smtp_username or not self.smtp_password:
            raise ValueError("SMTP credentials not configured")
    
    def send_password_reset_email(self, email: str, reset_token: str) -> bool:
        """Send password reset email"""
        try:
            # Create message
            msg = MIMEMultipart('alternative')
            msg['Subject'] = 'ZenFlow - Password Reset'
            msg['From'] = self.smtp_username
            msg['To'] = email
            
            # Create HTML content
            reset_url = f"https://yourapp.com/reset-password?token={reset_token}"
            html_content = f"""
            <html>
            <body style="font-family: 'Poppins', Arial, sans-serif; background-color: #FFF9F0; padding: 20px;">
                <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 12px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #6B46C1; font-size: 28px; margin: 0;">ZenFlow</h1>
                        <p style="color: #666; margin: 10px 0 0 0;">Your Personal Growth Companion</p>
                    </div>
                    
                    <h2 style="color: #111827; font-size: 24px; margin-bottom: 20px;">Reset Your Password</h2>
                    
                    <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                        Hi there! We received a request to reset your password for your ZenFlow account.
                    </p>
                    
                    <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                        Click the button below to reset your password. This link will expire in 1 hour.
                    </p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="{reset_url}" style="background-color: #6B46C1; color: white; padding: 14px 28px; text-decoration: none; border-radius: 12px; font-weight: 600; display: inline-block; font-size: 16px;">
                            Reset Password
                        </a>
                    </div>
                    
                    <p style="color: #6B7280; font-size: 14px; line-height: 1.5; margin-top: 30px;">
                        If you didn't request this password reset, please ignore this email. Your password will remain unchanged.
                    </p>
                    
                    <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 30px 0;">
                    
                    <p style="color: #9CA3AF; font-size: 12px; text-align: center; margin: 0;">
                        This email was sent from ZenFlow. If you have any questions, please contact our support team.
                    </p>
                </div>
            </body>
            </html>
            """
            
            # Attach HTML content
            html_part = MIMEText(html_content, 'html')
            msg.attach(html_part)
            
            # Send email
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                server.login(self.smtp_username, self.smtp_password)
                server.send_message(msg)
            
            return True
            
        except Exception as e:
            print(f"Error sending email: {e}")
            return False
    
    def send_welcome_email(self, email: str, name: str = None) -> bool:
        """Send welcome email after registration"""
        try:
            msg = MIMEMultipart('alternative')
            msg['Subject'] = 'Welcome to ZenFlow! 🌟'
            msg['From'] = self.smtp_username
            msg['To'] = email
            
            display_name = name or email.split('@')[0]
            
            html_content = f"""
            <html>
            <body style="font-family: 'Poppins', Arial, sans-serif; background-color: #FFF9F0; padding: 20px;">
                <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 12px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #6B46C1; font-size: 28px; margin: 0;">Welcome to ZenFlow! 🌟</h1>
                        <p style="color: #666; margin: 10px 0 0 0;">Your Personal Growth Journey Starts Here</p>
                    </div>
                    
                    <h2 style="color: #111827; font-size: 24px; margin-bottom: 20px;">Hi {display_name}!</h2>
                    
                    <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                        Welcome to ZenFlow! We're thrilled to have you join our community of people committed to personal growth and building better habits.
                    </p>
                    
                    <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                        Your account has been successfully created and you're ready to start your journey towards a more organized, mindful, and productive life.
                    </p>
                    
                    <div style="background-color: #E8E4F3; padding: 20px; border-radius: 12px; margin: 20px 0;">
                        <h3 style="color: #6B46C1; margin-top: 0;">What's Next?</h3>
                        <ul style="color: #374151; line-height: 1.6;">
                            <li>Complete your personalized onboarding</li>
                            <li>Set up your daily habits and goals</li>
                            <li>Track your progress and celebrate wins</li>
                            <li>Join our community for support and motivation</li>
                        </ul>
                    </div>
                    
                    <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-top: 30px;">
                        Ready to get started? Open the ZenFlow app and begin your journey!
                    </p>
                    
                    <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 30px 0;">
                    
                    <p style="color: #9CA3AF; font-size: 12px; text-align: center; margin: 0;">
                        Thank you for choosing ZenFlow. We're here to support you every step of the way.
                    </p>
                </div>
            </body>
            </html>
            """
            
            html_part = MIMEText(html_content, 'html')
            msg.attach(html_part)
            
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                server.login(self.smtp_username, self.smtp_password)
                server.send_message(msg)
            
            return True
            
        except Exception as e:
            print(f"Error sending welcome email: {e}")
            return False

# Global email service instance
email_service = EmailService()
