from django.core.cache import cache
from django.conf import settings

import jingo

from bedrock.firefox.models import FirefoxOSFeedLink


@jingo.register.function
def firefox_os_feed_links(locale, force_cache_refresh=False):
    if locale in settings.FIREFOX_OS_FEED_LOCALES:
        cache_key = 'firefox-os-feed-links-' + locale
        if not force_cache_refresh:
            links = cache.get(cache_key)
            if links:
                return links
        links = list(
            FirefoxOSFeedLink.objects.filter(locale=locale).order_by(
                '-id').values_list('link', 'title')[:10])
        cache.set(cache_key, links)
        return links
    elif '-' in locale:
        return firefox_os_feed_links(locale.split('-')[0])


@jingo.register.function
def get_fxos_press_blog_link(locale):
    if locale in settings.FXOS_PRESS_BLOG_LINKS:
        return settings.FXOS_PRESS_BLOG_LINKS[LANG]
    elif locale.find('es-') and not locale.find('es-ES'):
        return settings.FXOS_PRESS_BLOG_LINKS['es']
    else:
        return settings.FXOS_PRESS_BLOG_LINKS[locale.split('-')[0]]
