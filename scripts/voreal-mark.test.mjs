import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const PNG_SIGNATURE = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
]);
const markUrl = new URL(
  '../public/voreal-next/brand/voreal-mark.png',
  import.meta.url,
);

test('Voreal Next mark is a 32×32 RGBA PNG', async () => {
  const png = await readFile(markUrl);

  assert.deepEqual(png.subarray(0, 8), PNG_SIGNATURE);
  assert.equal(png.subarray(12, 16).toString('ascii'), 'IHDR');
  assert.equal(png.readUInt32BE(16), 32);
  assert.equal(png.readUInt32BE(20), 32);
  assert.equal(png[25], 6, 'PNG color type must be truecolor with alpha');
});
