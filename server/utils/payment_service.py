from datetime import datetime, timedelta
import os
from typing import Optional, Tuple

try:
    import razorpay  # type: ignore
except Exception:
    razorpay = None


class PaymentService:
    def __init__(self):
        self.key_id = os.getenv('RAZORPAY_KEY_ID')
        self.key_secret = os.getenv('RAZORPAY_KEY_SECRET')
        self.webhook_secret = os.getenv('RAZORPAY_WEBHOOK_SECRET', '')
        self.enabled = bool(self.key_id and self.key_secret and razorpay is not None)
        self.client = razorpay.Client(auth=(self.key_id, self.key_secret)) if self.enabled else None

    def create_order(self, amount_in_rupees: int, receipt: str, currency: str = 'INR') -> Optional[dict]:
        if not self.enabled:
            return {
                'id': f'test_order_{int(datetime.utcnow().timestamp())}',
                'amount': amount_in_rupees * 100,
                'currency': currency,
                'receipt': receipt,
                'status': 'created',
                'test_mode': True,
            }
        order = self.client.order.create({
            'amount': amount_in_rupees * 100,
            'currency': currency,
            'receipt': receipt,
        })
        return order

    def verify_payment_signature(self, order_id: str, payment_id: str, signature: str) -> bool:
        if not self.enabled:
            # In test mode without SDK, assume valid
            return True
        try:
            params_dict = {
                'razorpay_order_id': order_id,
                'razorpay_payment_id': payment_id,
                'razorpay_signature': signature,
            }
            self.client.utility.verify_payment_signature(params_dict)
            return True
        except Exception:
            return False

    @staticmethod
    def compute_expiry(plan: str) -> Tuple[str, datetime]:
        now = datetime.utcnow()
        if plan == 'weekly':
            expires = now + timedelta(days=7)
            return ('weekly', expires)
        if plan == 'yearly':
            expires = now + timedelta(days=365)
            return ('yearly', expires)
        # default weekly
        return ('weekly', now + timedelta(days=7))


payment_service = PaymentService()


