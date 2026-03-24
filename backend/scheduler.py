"""
Background scheduler — refreshes external API data every N minutes.
Runs the first fetch immediately in a background thread so the server
starts up without blocking.
"""

import logging
import threading
from apscheduler.schedulers.background import BackgroundScheduler

import api_clients
import data_processor
import whatsapp_service
from config import REFRESH_INTERVAL_MINUTES

logger = logging.getLogger("mooniq.scheduler")

_scheduler = BackgroundScheduler(daemon=True)


def _fetch_and_update() -> None:
    """Fetch from all APIs, process, and update the in-memory cache."""
    logger.info("⏳ Fetching data from external APIs …")
    try:
        cg_data = api_clients.fetch_coingecko_data()
        lc_data = api_clients.fetch_lunarcrush_data()
        x_data = api_clients.fetch_x_data()
        news_data = api_clients.fetch_crypto_news()
        dex_data = api_clients.fetch_dexscreener_boosts()
        eth_data = api_clients.fetch_etherscan_gas()

        data_processor.process_and_cache(cg_data, lc_data, x_data)
        
        if news_data:
            data_processor.update_news(news_data)
            
        if dex_data:
            data_processor.update_dex_boosts(dex_data)
            
        if eth_data:
            data_processor.update_etherscan(eth_data)
        
        logger.info("✅ Data refresh complete.")
    except Exception as exc:
        logger.exception("❌ Scheduled fetch failed: %s", exc)


def start_scheduler() -> None:
    """Add the recurring job and start the scheduler."""
    _scheduler.add_job(
        _fetch_and_update,
        trigger="interval",
        minutes=REFRESH_INTERVAL_MINUTES,
        id="data_refresh",
        replace_existing=True,
    )
    _scheduler.start()
    logger.info(
        "Scheduler started — refreshing every %d min", REFRESH_INTERVAL_MINUTES
    )
    
    # Optional automation: Morning Report at 6:00 AM every day
    _scheduler.add_job(
        whatsapp_service.send_morning_report,
        trigger="cron",
        hour=6,
        minute=0,
        id="automated_morning_report",
        replace_existing=True,
    )
    logger.info("Scheduler started — automated Morning Report running daily at 6:00 AM")

    # Fire the first fetch immediately without blocking uvicorn startup
    threading.Thread(target=_fetch_and_update, daemon=True).start()


def stop_scheduler() -> None:
    """Graceful shutdown."""
    if _scheduler.running:
        _scheduler.shutdown(wait=False)
        logger.info("Scheduler stopped.")
