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
