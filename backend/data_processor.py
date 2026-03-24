"""
Data processing module.
Consumes raw data from api_clients and computes:
  - Mention Spike
  - Engagement Score
  - Hype Score & Phase
  - Trend Score
Results are stored in an in-memory cache for instant frontend reads.
"""

import logging
from datetime import datetime, timezone
from config import TRACKED_ASSETS

logger = logging.getLogger("mooniq.data_processor")

# ── In-memory data cache ─────────────────────────────────────────────────────
_cache: dict[str, dict] = {
    "prices": {},
    "social": {},
    "hype": {},
    "trend": {},
    "news": [],
    "dex_boosts": [],
    "etherscan": {},
    "x_data": {},
    "lc_data": {},
    "last_updated": None,
}

# Rolling mention history per asset (up to 12 ticks = 1 h at 5 min interval)
_mention_history: dict[str, list[float]] = {a: [] for a in TRACKED_ASSETS}

HISTORY_WINDOW = 12


# ═══════════════════════════════════════════════════════════════════════════════
#  Core processing
# ═══════════════════════════════════════════════════════════════════════════════
def process_and_cache(
    cg_data: dict,
    lc_data: dict,
    x_data: dict,
) -> None:
    """
    Merge the three API payloads, compute derived metrics, and populate cache.
    """
    for asset in TRACKED_ASSETS:
        # ── 1) Price data ────────────────────────────────────────────────────
        price_info = cg_data.get(asset, {})
        _cache["prices"][asset] = {
            "asset": asset,
            "price": price_info.get("price", 0),
            "change_24h": price_info.get("change_24h", 0),
            "volume": price_info.get("volume", 0),
        }

        # ── 2) Raw social / tweet data ───────────────────────────────────────
        social = lc_data.get(asset, {})
        tweets = x_data.get(asset, {})

        current_mentions = tweets.get("tweet_count", 0) + social.get("social_mentions", 0)
        likes = tweets.get("likes", 0)
        retweets = tweets.get("retweets", 0)
        sentiment_raw = social.get("sentiment", 0)

        # ── 3) Mention spike (current / rolling avg) ────────────────────────
        _mention_history[asset].append(current_mentions)
        if len(_mention_history[asset]) > HISTORY_WINDOW:
            _mention_history[asset] = _mention_history[asset][-HISTORY_WINDOW:]

        avg_mentions = (
            sum(_mention_history[asset]) / len(_mention_history[asset])
            if _mention_history[asset]
            else 1
        )
        if avg_mentions == 0:
            avg_mentions = 1

        mention_spike = current_mentions / avg_mentions

        # ── 4) Engagement Score ──────────────────────────────────────────────
        engagement_score = likes + retweets

        # ── 5) Hype Score ────────────────────────────────────────────────────
        #   hype = mention_spike*0.4 + engagement_norm*0.3 + sentiment_norm*0.3
        eng_norm = min(engagement_score / 100.0, 100)
        sent_norm = min(max(sentiment_raw, 0) / 10.0, 100)

        hype_score = (
            (mention_spike * 0.4 * 10)
            + (eng_norm * 0.3)
            + (sent_norm * 0.3)
        )
        hype_score = round(min(hype_score, 100), 2)

        # ── 6) Hype Phase ───────────────────────────────────────────────────
        if hype_score < 30:
            hype_phase = "Calm"
        elif hype_score <= 60:
            hype_phase = "Emerging"
        elif hype_score <= 80:
            hype_phase = "Peak"
        else:
            hype_phase = "Cooling"

        # ── 7) Trend Score (probability 0…1) ─────────────────────────────────
        price_momentum = price_info.get("change_24h", 0)
        trend_raw = (sent_norm * 0.4) + (hype_score * 0.4) + (price_momentum * 2.0)
        trend_score = round(min(max(trend_raw / 100.0, 0.0), 1.0), 4)

        # ── Write to cache ───────────────────────────────────────────────────
        _cache["social"][asset] = {
            "asset": asset,
            "tweet_count": tweets.get("tweet_count", 0),
            "engagement": engagement_score,
            "sentiment": sentiment_raw,
            "mentions": current_mentions,
        }

        _cache["hype"][asset] = {
            "asset": asset,
            "hype_score": hype_score,
            "hype_phase": hype_phase,
        }

        _cache["trend"][asset] = {
            "asset": asset,
            "trend_score": trend_score,
        }

    _cache["last_updated"] = datetime.now(timezone.utc).isoformat()
    logger.info("Cache updated at %s", _cache["last_updated"])


# ═══════════════════════════════════════════════════════════════════════════════
#  Public getters — called by the API routes
# ═══════════════════════════════════════════════════════════════════════════════
def get_cached_prices() -> list[dict]:
    return list(_cache["prices"].values())


def get_cached_social() -> list[dict]:
    return list(_cache["social"].values())


def get_cached_hype() -> list[dict]:
    return list(_cache["hype"].values())


def get_cached_trend() -> list[dict]:
    return list(_cache["trend"].values())


def get_cached_news() -> list[dict]:
    return _cache["news"]


def update_news(news: list[dict]) -> None:
    _cache["news"] = news


def get_cached_dex_boosts() -> list[dict]:
    return _cache["dex_boosts"]


def update_dex_boosts(boosts: list[dict]) -> None:
    _cache["dex_boosts"] = boosts


def get_cached_etherscan() -> dict:
    return _cache["etherscan"]


def update_etherscan(data: dict) -> None:
    _cache["etherscan"] = data


def get_last_updated() -> str | None:
    return _cache.get("last_updated")
