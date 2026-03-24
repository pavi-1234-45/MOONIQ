"""
WhatsApp alert service using Meta Cloud API.
"""

import os
import requests
import logging
from dotenv import load_dotenv

import data_processor

load_dotenv()

logger = logging.getLogger("mooniq.whatsapp")

WHATSAPP_TOKEN = os.getenv("WHATSAPP_TOKEN", "")
PHONE_NUMBER_ID = os.getenv("WHATSAPP_PHONE_NUMBER_ID", "")
WHATSAPP_TO_NUMBER = os.getenv("WHATSAPP_TO_NUMBER", "")

def send_whatsapp_message(text: str, to_number: str = None) -> dict:
    recipient = to_number or WHATSAPP_TO_NUMBER
    if not recipient:
        return {"error": "No destination phone number provided. Set WHATSAPP_TO_NUMBER in .env or pass ?to=number in URL."}
    if not WHATSAPP_TOKEN or not PHONE_NUMBER_ID:
        return {"error": "Missing WhatsApp token or phone number ID in environment."}
        
    url = f"https://graph.facebook.com/v17.0/{PHONE_NUMBER_ID}/messages"
    headers = {
        "Authorization": f"Bearer {WHATSAPP_TOKEN}",
        "Content-Type": "application/json"
    }
    payload = {
        "messaging_product": "whatsapp",
        "to": recipient,
        "type": "text",
        "text": {
            "preview_url": False,
            "body": text
        }
    }
    
    response = requests.post(url, headers=headers, json=payload)
    if response.status_code != 200:
        logger.error(f"WhatsApp API Error: {response.text}")
        return {"error": response.text}
    else:
        logger.info(f"WhatsApp message sent successfully to {recipient}")
        return {
            "status": "success",
            "message": "WhatsApp message sent successfully"
        }


def send_trend_alert(to_number: str = None):
    """
    Crypto Trend Alert: Top 3 trending coins based on highest price increase, volume, momentum.
    """
    prices = data_processor.get_cached_prices()
    trend_data = data_processor.get_cached_trend()
    
    if not prices or not trend_data:
        return {"error": "No data available in cache. Wait for fetch cycle."}

    coins = []
    for t in trend_data:
        asset = t["asset"]
        t_score = t["trend_score"]
        
        p_info = next((p for p in prices if p["asset"] == asset), None)
        if p_info:
            coins.append({
                "asset": asset,
                "change24h": p_info.get("change_24h", 0),
                "volume": p_info.get("volume", 0),
                "trend_score": t_score
            })

    # Sort by trend_score (momentum) primarily
    coins.sort(key=lambda x: x["trend_score"], reverse=True)
    top_3 = coins[:3]
    
    msg = "🚀 *Crypto Trend Alert*\n\nTop Trending Coins Today:\n\n"
    emojis = ["1️⃣", "2️⃣", "3️⃣"]
    for i, c in enumerate(top_3):
        sign = "+" if c['change24h'] >= 0 else ""
        msg += f"{emojis[i]} {c['asset']}\n"
        msg += f"24h Change: {sign}{c['change24h']}%\n"
        if i == 0:
            msg += "Trend: Bullish\n\n"
        else:
            msg += "\n"
            
    msg += "Market Insight:\nThese coins are currently gaining strong momentum in the market."
    
    return send_whatsapp_message(msg, to_number)


def send_morning_report(to_number: str = None):
    """
    Crypto Morning Report: Top gainer, loser, most active, and market outlook.
    """
    prices = data_processor.get_cached_prices()
    trend_data = data_processor.get_cached_trend()
    
    if not prices:
        return {"error": "No price data available in cache."}
        
    gainers = sorted(prices, key=lambda x: x.get("change_24h", 0), reverse=True)
    losers = sorted(prices, key=lambda x: x.get("change_24h", 0))
    active = sorted(prices, key=lambda x: x.get("volume", 0), reverse=True)
    
    top_gainer = gainers[0]
    top_loser = losers[0]
    most_traded = active[0]
    
    avg_trend = sum(t.get("trend_score", 0) for t in trend_data) / len(trend_data) if trend_data else 0.5
    if avg_trend > 0.6:
        sentiment = "bullish"
    elif avg_trend < 0.4:
        sentiment = "bearish"
    else:
        sentiment = "neutral"
        
    g_sign = "+" if top_gainer.get('change_24h', 0) >= 0 else ""
    l_sign = "+" if top_loser.get('change_24h', 0) >= 0 else ""
    
    msg = "📊 *Crypto Morning Report*\n\n"
    msg += f"Top Gainer: {top_gainer['asset']} ({g_sign}{top_gainer.get('change_24h', 0)}%)\n\n"
    msg += f"Top Loser: {top_loser['asset']} ({l_sign}{top_loser.get('change_24h', 0)}%)\n\n"
    msg += f"Most Active: {most_traded['asset']}\n\n"
    msg += f"Market Outlook:\nCrypto market shows *{sentiment}* sentiment today."
    
    return send_whatsapp_message(msg, to_number)
