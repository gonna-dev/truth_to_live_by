import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#F6F3EB"/><rect x="55" y="54" width="1090" height="522" rx="1" fill="none" stroke="#D5CFC0"/><text x="92" y="125" font-family="Georgia" font-size="35" fill="#272923">Truth to Live By.</text><path d="M92 159h1016" stroke="#D5CFC0"/><text x="92" y="277" font-family="Georgia" font-size="65" fill="#272923">Ideas worth understanding.</text><text x="92" y="367" font-family="Georgia" font-style="italic" font-size="65" fill="#4B583F">Truths worth living.</text><text x="94" y="481" font-family="Arial" font-size="19" letter-spacing="2" fill="#4B583F">SELF / RELATIONSHIPS / LIVING WELL</text><text x="94" y="535" font-family="Arial" font-size="17" fill="#5E6257">truthtoliveby.fyi</text></svg>`;
mkdirSync('public/social', { recursive: true });
await sharp(Buffer.from(svg)).png().toFile('public/social/brand.png');
console.log('Generated brand social card at public/social/brand.png');
