import requests
import base64
from datetime import datetime
from flask import current_app
from app.extensions import db

def get_mpesa_access_token():
    url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
    consumer_key = current_app.config["MPESA_CONSUMER_KEY"]
    consumer_secret = current_app.config["MPESA_CONSUMER_SECRET"]
    response = requests.get(url, auth=(consumer_key, consumer_secret))
    response.raise_for_status()
    return response.json()["access_token"]

def generate_password(shortcode, passkey, timestamp):
    data = f"{shortcode}{passkey}{timestamp}"
    return base64.b64encode(data.encode()).decode()

def get_timestamp():
    return datetime.now().strftime("%Y%m%d%H%M%S")

def stk_push(phone, amount, reference, order=None):
    access_token = get_mpesa_access_token()
    timestamp = get_timestamp()
    shortcode = current_app.config["MPESA_SHORTCODE"]
    passkey = current_app.config["MPESA_PASSKEY"]
    callback_url = current_app.config["MPESA_CALLBACK_URL"]
    password = generate_password(shortcode, passkey, timestamp)
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    payload = {
        "BusinessShortCode": shortcode,
        "Password": password,
        "Timestamp": timestamp,
        "TransactionType": "CustomerPayBillOnline",
        "Amount": amount,
        "PartyA": phone,
        "PartyB": shortcode,
        "PhoneNumber": phone,
        "CallBackURL": callback_url,
        "AccountReference": reference,
        "TransactionDesc": "Payment"
    }
    url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
    response = requests.post(url, json=payload, headers=headers)
    response.raise_for_status()
    result = response.json()
    # Store CheckoutRequestID in order if provided
    if order and "CheckoutRequestID" in result:
        order.mpesa_checkout_request_id = result["CheckoutRequestID"]
        db.session.commit()
    return result