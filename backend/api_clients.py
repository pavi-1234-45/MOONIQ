"""
API client modules for CoinGecko, LunarCrush, and X (Twitter).
Each function returns a dict keyed by asset symbol.
All functions gracefully degrade to fallback data if an API call fails.
"""

import requests
import time
import logging
from datetime import datetime, timezone
from config import (
    TRACKED_ASSETS,
    CG_ID_MAP,
    X_SEARCH_MAP,
    COINGECKO_API_KEY,
    LUNARCRUSH_API_KEY,
    X_BEARER_TOKEN,
)

logger = logging.getLogger("mooniq.api_clients")


# ═══════════════════════════════════════════════════════════════════════════════
#  1. CoinGecko — Market Data
# ═══════════════════════════════════════════════════════════════════════════════
def fetch_coingecko_data() -> dict:
    """
    Returns {ASSET: {price, change_24h, volume}} for every tracked asset.
    Uses a single batched request to /simple/price.
    """
    cg_ids = [CG_ID_MAP[a] for a in TRACKED_ASSETS]
    url = "https://api.coingecko.com/api/v3/simple/price"
    params = {
        "ids": ",".join(cg_ids),
        "vs_currencies": "usd",
        "include_24hr_vol": "true",
        "include_24hr_change": "true",
        "x_cg_demo_api_key": COINGECKO_API_KEY,
    }

    try:
        resp = requests.get(url, params=params, timeout=15)
        resp.raise_for_status()
        data = resp.json()

        results = {}
        for asset in TRACKED_ASSETS:
            cg_id = CG_ID_MAP[asset]
            coin = data.get(cg_id, {})
            results[asset] = {
                "price": coin.get("usd", 0),
                "change_24h": round(coin.get("usd_24h_change", 0), 4),
                "volume": round(coin.get("usd_24h_vol", 0), 2),
            }
        return results

    except Exception as exc:
        logger.error("CoinGecko fetch failed: %s", exc)
        return {
            a: {"price": 0, "change_24h": 0, "volume": 0}
            for a in TRACKED_ASSETS
        }


# ═══════════════════════════════════════════════════════════════════════════════
#  2. LunarCrush — Social Metrics
# ═══════════════════════════════════════════════════════════════════════════════
def fetch_lunarcrush_data() -> dict:
    """
    Returns {ASSET: {social_mentions, engagement, social_volume, sentiment}}.
    Falls back to a synthetic baseline if the API is unavailable.
    """
    url = "https://lunarcrush.com/api4/public/coins/list/v2"
    headers = {"Authorization": f"Bearer {LUNARCRUSH_API_KEY}"}

    try:
        resp = requests.get(url, headers=headers, timeout=15)
        if resp.status_code == 200:
            raw_list = resp.json().get("data", [])
            lookup = {item.get("symbol"): item for item in raw_list}

            results = {}
            for asset in TRACKED_ASSETS:
                item = lookup.get(asset, {})
                contributors = item.get("social_contributors", 0)
                engagement_raw = item.get("social_engagement", 0)
                results[asset] = {
                    "social_mentions": item.get("social_mentions", 0),
                    "engagement": contributors + engagement_raw,
                    "social_volume": item.get("social_volume", 0),
                    "sentiment": max(
                        item.get("sentiment_bullish", 0)
                        - item.get("sentiment_bearish", 0),
                        0,
                    ),
                }
            return results
        else:
            logger.warning("LunarCrush returned %s — using fallback", resp.status_code)

    except Exception as exc:
        logger.error("LunarCrush fetch failed: %s", exc)

    # ── Fallback synthetic baselines ─────────────────────────────────────────
    return _lunarcrush_fallback()


def _lunarcrush_fallback() -> dict:
    return {
        a: {
            "social_mentions": 120,
            "engagement": 4500,
            "social_volume": 950,
            "sentiment": 12,
        }
        for a in TRACKED_ASSETS
    }


# ═══════════════════════════════════════════════════════════════════════════════
#  3. X (Twitter) — Tweet Metrics
# ═══════════════════════════════════════════════════════════════════════════════
def fetch_x_data() -> dict:
    """
    Searches recent tweets for each tracked asset and returns
    {ASSET: {tweet_count, likes, retweets, timestamp}}.
    """
    url = "https://api.twitter.com/2/tweets/search/recent"
    headers = {"Authorization": f"Bearer {X_BEARER_TOKEN}"}
    results = {}

    for asset in TRACKED_ASSETS:
        query = X_SEARCH_MAP.get(asset, f"${asset}")
        params = {
            "query": f"{query} -is:retweet lang:en",
            "max_results": 10,
            "tweet.fields": "public_metrics,created_at",
        }
        try:
            resp = requests.get(url, headers=headers, params=params, timeout=15)
            if resp.status_code == 200:
                tweets = resp.json().get("data", [])
                total_likes = sum(
                    t.get("public_metrics", {}).get("like_count", 0) for t in tweets
                )
                total_rts = sum(
                    t.get("public_metrics", {}).get("retweet_count", 0)
                    for t in tweets
                )
                results[asset] = {
                    "tweet_count": len(tweets) * 10,  # extrapolated estimate
                    "likes": total_likes,
                    "retweets": total_rts,
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                    "tweets": [
                        {
                            "id": t.get("id"),
                            "text": t.get("text"),
                            "timestamp": t.get("created_at", datetime.now(timezone.utc).isoformat())
                        }
                        for t in tweets[:3]
                    ],
                }
            elif resp.status_code == 429:
                logger.warning("X rate-limited for %s — using fallback", asset)
                results[asset] = _x_fallback(asset)
            else:
                logger.warning(
                    "X API %s for %s: %s", resp.status_code, asset, resp.text[:200]
                )
                results[asset] = _x_fallback(asset)
        except Exception as exc:
            logger.error("X fetch failed for %s: %s", asset, exc)
            results[asset] = _x_fallback(asset)

        time.sleep(0.6)  # respect rate limits

    return results


def _x_fallback(asset: str) -> dict:
    return {
        "tweet_count": 80,
        "likes": 1100,
        "retweets": 280,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "tweets": [
            {
                "id": str(int(time.time()*1000)),
                "text": f"Massive volume coming in for ${asset}! #crypto #bullish",
                "timestamp": datetime.now(timezone.utc).isoformat()
            }
        ]
    }


# ═══════════════════════════════════════════════════════════════════════════════
#  4. News API — Live Crypto Headlines
# ═══════════════════════════════════════════════════════════════════════════════
def fetch_crypto_news() -> list[dict]:
    import os
    from dotenv import load_dotenv
    load_dotenv()
    NEWS_API_KEY = os.getenv("NEWS_API_KEY", "")
    
    url = "https://newsapi.org/v2/everything"
    params = {
        "q": "cryptocurrency OR bitcoin OR ethereum OR dogecoin OR solana",
        "sortBy": "publishedAt",
        "language": "en",
        "pageSize": 20,
        "apiKey": NEWS_API_KEY
    }
    
    if not NEWS_API_KEY:
        logger.warning("No NEWS_API_KEY present, skipping news fetch.")
        return []
        
    try:
        resp = requests.get(url, params=params, timeout=10)
        resp.raise_for_status()
        articles = resp.json().get("articles", [])
        
        parsed_news = []
        for i, art in enumerate(articles):
            title = art.get("title", "")
            title_lower = title.lower()
            
            # Simple keyword asset matching
            asset = "CRYPTO"
            if "bitcoin" in title_lower or "btc" in title_lower: asset = "BTC"
            elif "eth" in title_lower: asset = "ETH"
            elif "doge" in title_lower: asset = "DOGE"
            elif "solana" in title_lower or "sol" in title_lower.split(): asset = "SOL"
            elif "pepe" in title_lower: asset = "PEPE"
            
            # Simple keyword sentiment 
            sentiment = "neutral"
            bull_words = ["surge", "jump", "high", "gain", "bull", "record", "up"]
            bear_words = ["crash", "drop", "low", "bear", "down", "hack", "scam", "sec"]
            
            if any(w in title_lower for w in bull_words):
                sentiment = "bullish"
            elif any(w in title_lower for w in bear_words):
                sentiment = "bearish"
                
            parsed_news.append({
                "id": str(i),
                "headline": title[:80] + "..." if len(title) > 80 else title,
                "full_title": title,
                "description": art.get("description", "No description available."),
                "content": art.get("content", ""),
                "url": art.get("url", "#"),
                "asset": asset,
                "sentiment": sentiment,
                "source": art.get("source", {}).get("name", "Unknown"),
                "timestamp": art.get("publishedAt", "")
            })
        return parsed_news
        
    except Exception as exc:
        logger.error("News fetch failed: %s", exc)
        return []

# ═══════════════════════════════════════════════════════════════════════════════
#  5. DEX Screener — Live Token Boosts
# ═══════════════════════════════════════════════════════════════════════════════
def fetch_dexscreener_boosts() -> list[dict]:
    url = "https://api.dexscreener.com/token-boosts/top/v1"
    try:
        resp = requests.get(url, timeout=10)
        resp.raise_for_status()
        boosts = resp.json()
        if isinstance(boosts, list):
            return boosts[:15]  # Top 15 current actively boosted tokens
        return []
    except Exception as exc:
        logger.error("DEX Screener fetch failed: %s", exc)
        return []


# ═══════════════════════════════════════════════════════════════════════════════
#  6. Etherscan — Gas Tracker
# ═══════════════════════════════════════════════════════════════════════════════
def fetch_etherscan_gas() -> dict:
    import os
    from dotenv import load_dotenv
    load_dotenv()
    ETHERSCAN_API_KEY = os.getenv("ETHERSCAN_API_KEY", "")
    
    url = "https://api.etherscan.io/api"
    params = {
        "module": "gastracker",
        "action": "gasoracle",
        "apikey": ETHERSCAN_API_KEY
    }
    
    if not ETHERSCAN_API_KEY:
        logger.warning("No ETHERSCAN_API_KEY present, skipping Etherscan fetch.")
        return {}
        
    try:
        resp = requests.get(url, params=params, timeout=10)
        resp.raise_for_status()
        data = resp.json()
        if data.get("status") == "1":
            return data.get("result", {})
        return {}
    except Exception as exc:
        logger.error("Etherscan fetch failed: %s", exc)
        return {}

