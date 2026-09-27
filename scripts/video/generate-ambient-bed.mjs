import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const sampleRate = 48_000;
const channels = 2;
const duration = Number.parseFloat(process.argv[2] ?? '48.07');
const output = path.resolve(process.argv[3] ?? 'media/video-01/audio/video-01-ambient-bed.wav');

if (!Number.isFinite(duration) || duration <= 0 || duration > 600) {
  throw new Error('Duration must be between 0 and 600 seconds.');
}

const chords = [
  [110.0, 164.81, 246.94, 261.63],
  [87.31, 130.81, 164.81, 220.0],
  [130.81, 196.0, 246.94, 293.66],
  [98.0, 146.83, 164.81, 246.94],
];

const totalFrames = Math.ceil(sampleRate * duration);
const pcm = Buffer.alloc(totalFrames * channels * 2);
const chordLength = duration / chords.length;

let randomState = 0x74746c62;
let noiseLeft = 0;
let noiseRight = 0;

function random() {
  randomState ^= randomState << 13;
  randomState ^= randomState >>> 17;
  randomState ^= randomState << 5;
  return ((randomState >>> 0) / 0xffffffff) * 2 - 1;
}

function smoothstep(start, end, value) {
  if (start === end) return value >= end ? 1 : 0;
  const amount = Math.max(0, Math.min(1, (value - start) / (end - start)));
  return amount * amount * (3 - 2 * amount);
}

function chordWeight(index, time) {
  const center = (index + 0.5) * chordLength;
  const distance = Math.abs(time - center);
  const half = chordLength / 2;
  const crossfade = 1.8;

  if (distance <= half - crossfade) return 1;
  if (distance >= half + crossfade) return 0;
  return 1 - smoothstep(half - crossfade, half + crossfade, distance);
}

function arrangementEnvelope(time) {
  const opening = smoothstep(3.2, 5.8, time);
  const closing = 1 - smoothstep(duration - 5.2, duration - 0.35, time);
  const quietMoment = 1 - 0.42 * smoothstep(34.4, 35.2, time) * (1 - smoothstep(38.7, 39.6, time));
  return opening * closing * quietMoment;
}

for (let frame = 0; frame < totalFrames; frame += 1) {
  const time = frame / sampleRate;
  let left = 0;
  let right = 0;
  let totalWeight = 0;

  for (let chordIndex = 0; chordIndex < chords.length; chordIndex += 1) {
    const weight = chordWeight(chordIndex, time);
    if (weight === 0) continue;
    totalWeight += weight;

    const chord = chords[chordIndex];
    for (let noteIndex = 0; noteIndex < chord.length; noteIndex += 1) {
      const frequency = chord[noteIndex];
      const noteGain = 0.18 / (1 + noteIndex * 0.28);
      const phase = chordIndex * 0.61 + noteIndex * 1.17;
      const movement = 1 + 0.0025 * Math.sin(2 * Math.PI * (0.035 + noteIndex * 0.007) * time);
      const leftFrequency = frequency * movement * (1 - noteIndex * 0.00045);
      const rightFrequency = frequency * movement * (1 + noteIndex * 0.00045);

      left +=
        weight *
        noteGain *
        (Math.sin(2 * Math.PI * leftFrequency * time + phase) +
          0.13 * Math.sin(2 * Math.PI * leftFrequency * 2 * time + phase * 0.7));
      right +=
        weight *
        noteGain *
        (Math.sin(2 * Math.PI * rightFrequency * time + phase + 0.19) +
          0.13 * Math.sin(2 * Math.PI * rightFrequency * 2 * time + phase * 0.7 + 0.11));
    }
  }

  if (totalWeight > 0) {
    left /= totalWeight;
    right /= totalWeight;
  }

  noiseLeft = noiseLeft * 0.9985 + random() * 0.0015;
  noiseRight = noiseRight * 0.9985 + random() * 0.0015;

  const slowDrift = 0.88 + 0.12 * Math.sin(2 * Math.PI * 0.021 * time + 0.4);
  const envelope = arrangementEnvelope(time);
  left = Math.tanh((left * slowDrift + noiseLeft * 0.055) * 1.15) * envelope;
  right = Math.tanh((right * slowDrift + noiseRight * 0.055) * 1.15) * envelope;

  pcm.writeInt16LE(Math.round(Math.max(-1, Math.min(1, left)) * 32767), frame * 4);
  pcm.writeInt16LE(Math.round(Math.max(-1, Math.min(1, right)) * 32767), frame * 4 + 2);
}

const header = Buffer.alloc(44);
const byteRate = sampleRate * channels * 2;
header.write('RIFF', 0);
header.writeUInt32LE(36 + pcm.length, 4);
header.write('WAVE', 8);
header.write('fmt ', 12);
header.writeUInt32LE(16, 16);
header.writeUInt16LE(1, 20);
header.writeUInt16LE(channels, 22);
header.writeUInt32LE(sampleRate, 24);
header.writeUInt32LE(byteRate, 28);
header.writeUInt16LE(channels * 2, 32);
header.writeUInt16LE(16, 34);
header.write('data', 36);
header.writeUInt32LE(pcm.length, 40);

await mkdir(path.dirname(output), { recursive: true });
await writeFile(output, Buffer.concat([header, pcm]));
console.log(output);
