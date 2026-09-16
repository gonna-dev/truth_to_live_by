export function validEmbed(value) {
  if (!value) return '';
  try {
    const url = new URL(value);
    return url.protocol === 'https:' &&
      (url.hostname === 'embeds.beehiiv.com' ||
        (url.hostname === 'subscribe-forms.beehiiv.com' &&
          /^\/v3\/forms\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(
            url.pathname,
          ) &&
          !url.search &&
          !url.hash)) &&
      !url.username &&
      !url.password
      ? url.href
      : '';
  } catch {
    return '';
  }
}

// Derive a fixed-origin player URL from the existing editorial YouTube URL.
export function youtubeEmbed(value) {
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || url.username || url.password || url.port) return '';
    let id = '';
    if (url.hostname === 'youtu.be') id = url.pathname.slice(1);
    else if (['youtube.com', 'www.youtube.com'].includes(url.hostname)) {
      if (url.pathname === '/watch') id = url.searchParams.get('v') || '';
      else if (url.pathname.startsWith('/shorts/')) id = url.pathname.slice(8);
    }
    return /^[A-Za-z0-9_-]{11}$/.test(id)
      ? `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&playsinline=1&rel=0`
      : '';
  } catch {
    return '';
  }
}

export function validSignup(value) {
  if (!value) return '';
  try {
    const url = new URL(value);
    return url.protocol === 'https:' &&
      (url.hostname === 'beehiiv.com' || url.hostname.endsWith('.beehiiv.com')) &&
      !url.username &&
      !url.password
      ? url.href
      : '';
  } catch {
    return '';
  }
}

export function validEmail(value) {
  return typeof value === 'string' &&
    /^[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9](?:[A-Z0-9-]*[A-Z0-9])?(?:\.[A-Z0-9](?:[A-Z0-9-]*[A-Z0-9])?)+$/i.test(
      value,
    )
    ? value
    : '';
}

export function newsletterConfig(env) {
  const embed = validEmbed(env.PUBLIC_BEEHIIV_EMBED_URL);
  const signup = validSignup(env.PUBLIC_BEEHIIV_SIGNUP_URL);
  return {
    embed,
    signup,
    enabled:
      env.PUBLIC_PRIVACY_READY === 'true' &&
      env.PUBLIC_NEWSLETTER_ENABLED === 'true' &&
      Boolean(embed && signup),
  };
}
