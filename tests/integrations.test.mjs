import test from 'node:test';
import assert from 'node:assert/strict';
import { validEmbed, validSignup, validEmail, newsletterConfig } from '../src/lib/integrations.mjs';

test('newsletter stays disabled with incomplete or unapproved configuration', () => {
  const valid = {
    PUBLIC_BEEHIIV_EMBED_URL: 'https://embeds.beehiiv.com/example',
    PUBLIC_BEEHIIV_SIGNUP_URL: 'https://example.beehiiv.com/subscribe',
    PUBLIC_PRIVACY_READY: 'true',
    PUBLIC_NEWSLETTER_ENABLED: 'true',
  };
  assert.equal(newsletterConfig({}).enabled, false);
  assert.equal(newsletterConfig(valid).enabled, true);
  for (const key of Object.keys(valid))
    assert.equal(newsletterConfig({ ...valid, [key]: '' }).enabled, false, key);
});
test('external integration URLs reject script, lookalike, credential and insecure URLs', () => {
  for (const value of [
    'javascript:alert(1)',
    'http://embeds.beehiiv.com/id',
    'https://embeds.beehiiv.com.evil.test/id',
    'https://user:pass@embeds.beehiiv.com/id',
    'https://evil.test',
  ])
    assert.equal(validEmbed(value), '');
  assert.equal(validSignup('https://example.beehiiv.com.evil.test'), '');
  assert.equal(
    validSignup('https://example.beehiiv.com/subscribe'),
    'https://example.beehiiv.com/subscribe',
  );
});
test('contact rejects header injection and malformed addresses', () => {
  for (const value of [
    '',
    'not-an-email',
    'hi@example.com\r\nBcc:bad@example.com',
    'hi@example.com?subject=bad',
  ])
    assert.equal(validEmail(value), '');
  assert.equal(validEmail('editor@example.com'), 'editor@example.com');
});

test('beehiiv v3 permits only a standalone form, not scripts or preview URLs', () => {
  const form = 'https://subscribe-forms.beehiiv.com/v3/forms/7ac19e35-e25b-4244-ad46-52a60f9c6725';
  assert.equal(validEmbed(form), form);
  for (const value of [
    form + '?preview=true',
    form + '#test',
    'https://subscribe-forms.beehiiv.com/v3/loader.js',
    'https://subscribe-forms.beehiiv.com/v3/forms/not-an-id',
    form.replace('beehiiv.com', 'beehiiv.com.evil.test'),
  ]) {
    assert.equal(validEmbed(value), '');
  }
});
