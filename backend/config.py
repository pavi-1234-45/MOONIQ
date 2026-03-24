"""
Configuration module — loads all environment variables and defines constants.
All API keys are read from .env file via python-dotenv. Never hardcoded.
"""

import os
from dotenv import load_dotenv

load_dotenv()

# ── X (Twitter) API credentials ──────────────────────────────────────────────
X_BEARER_TOKEN = os.getenv("X_BEARER_TOKEN", "")
X_ACCESS_TOKEN = os.getenv("X_ACCESS_TOKEN", "")
X_ACCESS_TOKEN_SECRET = os.getenv("X_ACCESS_TOKEN_SECRET", "")
X_CONSUMER_KEY = os.getenv("X_CONSUMER_KEY", "")
X_CONSUMER_SECRET = os.getenv("X_CONSUMER_SECRET", "")

# ── CoinGecko ────────────────────────────────────────────────────────────────
COINGECKO_API_KEY = os.getenv("COINGECKO_API_KEY", "")

# ── LunarCrush ───────────────────────────────────────────────────────────────
LUNARCRUSH_API_KEY = os.getenv("LUNARCRUSH_API_KEY", "")

# ── Tracked assets ───────────────────────────────────────────────────────────
TRACKED_ASSETS = ["DOGE", "SHIB", "PEPE", "BONK", "WIF", "BTC", "ETH"]

# Mapping asset symbols → CoinGecko IDs
CG_ID_MAP = {
    "DOGE": "dogecoin",
    "SHIB": "shiba-inu",
    "PEPE": "pepe",
    "BONK": "bonk",
    "WIF": "dogwifcoin",
    "BTC": "bitcoin",
    "ETH": "ethereum",
}

# Mapping asset symbols → human-readable search names for X (Twitter)
X_SEARCH_MAP = {
    "DOGE": "$DOGE OR Dogecoin",
    "SHIB": "$SHIB OR ShibaInu",
    "PEPE": "$PEPE OR PepeCoin",
    "BONK": "$BONK OR BonkCoin",
    "WIF": "$WIF OR dogwifhat",
    "BTC": "$BTC OR Bitcoin",
    "ETH": "$ETH OR Ethereum",
}

# ── Scheduler ────────────────────────────────────────────────────────────────
REFRESH_INTERVAL_MINUTES = 5

# ── Cache TTL (seconds) ─────────────────────────────────────────────────────
CACHE_TTL_SECONDS = 280  # slightly less than 5 min so data is always warm
