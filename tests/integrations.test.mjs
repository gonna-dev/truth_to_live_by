import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validEmbed,
  validSignup,
  validEmail,
  newsletterConfig,
  youtubeEmbed,
} from '../src/lib/integrations.mjs';

test('YouTube embeds keep a fixed privacy-enhanced origin and extract only a valid ID', () => {
  for (const input of [
    'https://www.youtube.com/shorts/7Gx-8crjg58',
    'https://youtube.com/watch?v=7Gx-8crjg58&list=untrusted',
    'https://youtu.be/7Gx-8crjg58',
  ]) {
    assert.equal(
      youtubeEmbed(input),
      'https://www.youtube-nocookie.com/embed/7Gx-8crjg58?autoplay=1&playsinline=1&rel=0',
    );
  }
  for (const input of [
    'javascript:alert(1)',
    'http://youtube.com/watch?v=7Gx-8crjg58',
    'https://youtube.com.evil.test/watch?v=7Gx-8crjg58',
    'https://evil.test/shorts/7Gx-8crjg58',
    'https://user:pass@youtube.com/watch?v=7Gx-8crjg58',
    'https://youtube.com:999/watch?v=7Gx-8crjg58',
    'https://youtube.com/watch?v=bad',
    'https://youtu.be/7Gx-8crjg58/extra',
  ]) {
    assert.equal(youtubeEmbed(input), '');
  }
});

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
  assert.equal(validEmail('truthtoliveby.fyi@gmail.com'), 'truthtoliveby.fyi@gmail.com');
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
