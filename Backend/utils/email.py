import yagmail
import logging
from config import settings

async def send_verification_email(email: str, token: str):
    """
    Send a verification email to the user
    """
    try:
        verification_link = f"{settings.FRONTEND_URL}/verify-email?token={token}"
        
        yag = yagmail.SMTP(
            settings.SMTP_USER, 
            settings.SMTP_PASSWORD,
            host=settings.SMTP_HOST, 
            port=settings.SMTP_PORT
        )
        
        contents = [
            f"<h2>Email Verification</h2>",
            f"<p>Please click the following link to verify your email address:</p>",
            f"<p><a href='{verification_link}'>Verify Email Address</a></p>",
            f"<p>Or copy and paste this link in your browser:</p>",
            f"<p>{verification_link}</p>",
            f"<p><small>If you did not request this verification, please ignore this email.</small></p>"
        ]
        
        yag.send(
            to=email, 
            subject="Verify Your Email Address", 
            contents=contents
        )
        
        logging.info(f"Verification email sent to {email}")
        return True
    except Exception as e:
        logging.error(f"Failed to send verification email: {str(e)}")
        return False