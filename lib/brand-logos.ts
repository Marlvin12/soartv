// ─────────────────────────────────────────────────────────────────────────────
// Brand → logo URL resolver
//
// Powers the Brand Resonance / Brand Alignment tiles on the Insights page.
// `brandLogoSources(name)` returns an ordered list of URLs to try; the tile
// component walks the list until one loads, then falls back to the first
// letter of the brand name. Sources, in order:
//
//   1. Google's S2 favicon CDN (`www.google.com/s2/favicons?...&sz=256`) —
//      live, returns a PNG, redirects through a Google CDN.
//   2. Clearbit's free Logo API (legacy — kept in case it ever returns).
//
// Hostnames must be whitelisted in `next.config.ts` `images.remotePatterns`
// if used through next/image, but the tiles use plain <img> so that we can
// catch errors and fall through.
// ─────────────────────────────────────────────────────────────────────────────

const BRAND_DOMAINS: Record<string, string> = {
  // FILM_PROFILES.brands (resonance-content.ts)
  'A24':              'a24films.com',
  'Calm':             'calm.com',
  'Aesop':            'aesop.com',
  'Spotify':          'spotify.com',
  'Vogue':            'vogue.com',
  'TED':              'ted.com',
  'Apple':            'apple.com',
  'Tesla':            'tesla.com',
  'Meta':             'meta.com',
  'Patagonia':        'patagonia.com',
  'TOMS':             'toms.com',
  'charity: water':   'charitywater.org',
  'Rolex':            'rolex.com',
  'Land Rover':       'landrover.com',
  'Glossier':         'glossier.com',
  'Nike':             'nike.com',
  'Under Armour':     'underarmour.com',
  'Red Bull':         'redbull.com',
  'Pixar':            'pixar.com',
  'LEGO':             'lego.com',
  'Moleskine':        'moleskine.com',

  // archetypes.ts brandAlignment (extras not above)
  'Notion':           'notion.so',
  'Headspace':        'headspace.com',
  'Airbnb':           'airbnb.com',
  'Penguin Books':    'penguinrandomhouse.com',
  'Whole Foods':      'wholefoodsmarket.com',
  'Garmin':           'garmin.com',
  'Zara':             'zara.com',
  'Instagram':        'instagram.com',
  'Whoop':            'whoop.com',
  'Etsy':             'etsy.com',

  // Common brands referenced in the source brief (REI in Mulan example, etc.)
  'REI':              'rei.com',
}

export function brandDomain(name: string): string | null {
  return BRAND_DOMAINS[name] ?? null
}

/**
 * Ordered list of logo URLs to attempt for a brand. The tile component
 * walks this list and falls through to a typographic render if all fail.
 */
export function brandLogoSources(name: string, size = 256): string[] {
  const domain = brandDomain(name)
  if (!domain) return []
  return [
    `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`,
    `https://logo.clearbit.com/${domain}`,
  ]
}

/** Back-compat single-URL helper (returns the first source, or null). */
export function brandLogoUrl(name: string): string | null {
  const sources = brandLogoSources(name)
  return sources[0] ?? null
}
