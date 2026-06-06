import assert from 'node:assert/strict';
import { BGM_TRACK_URLS, startBgm, stopAllBgm } from './AudioEngine';

const expectedTrackUrls = {
  track1: 'https://k7imwlr1bqnlc6nu.public.blob.vercel-storage.com/track1.mp3',
  track2: 'https://k7imwlr1bqnlc6nu.public.blob.vercel-storage.com/track2.mp3',
  track3: 'https://k7imwlr1bqnlc6nu.public.blob.vercel-storage.com/track3.mp3',
  track4: 'https://k7imwlr1bqnlc6nu.public.blob.vercel-storage.com/track4.mp3',
  track5: 'https://k7imwlr1bqnlc6nu.public.blob.vercel-storage.com/track5.mp3',
  track6: 'https://k7imwlr1bqnlc6nu.public.blob.vercel-storage.com/track6.mp3',
  track7: 'https://k7imwlr1bqnlc6nu.public.blob.vercel-storage.com/track7.mp3',
} as const;

class FakeAudio {
  currentTime = 8;
  loop = false;
  pauseCalls = 0;
  playCalls = 0;
  volume = 1;

  constructor(public src: string) {
    fakeAudioElements.push(this);
  }

  play() {
    this.playCalls += 1;
    return Promise.resolve();
  }

  pause() {
    this.pauseCalls += 1;
  }
}

const fakeAudioElements: FakeAudio[] = [];
globalThis.Audio = FakeAudio as unknown as typeof Audio;

assert.deepEqual(BGM_TRACK_URLS, expectedTrackUrls);

startBgm('track1');

assert.equal(fakeAudioElements.length, 1);
assert.equal(fakeAudioElements[0].src, expectedTrackUrls.track1);
assert.equal(fakeAudioElements[0].loop, true);
assert.equal(fakeAudioElements[0].volume, 0.5);
assert.equal(fakeAudioElements[0].playCalls, 1);

startBgm('track2');

assert.equal(fakeAudioElements[0].pauseCalls, 1);
assert.equal(fakeAudioElements[0].currentTime, 0);
assert.equal(fakeAudioElements.length, 2);
assert.equal(fakeAudioElements[1].src, expectedTrackUrls.track2);
assert.equal(fakeAudioElements[1].playCalls, 1);

stopAllBgm();

assert.equal(fakeAudioElements[1].pauseCalls, 1);
assert.equal(fakeAudioElements[1].currentTime, 0);

startBgm('none');

assert.equal(fakeAudioElements.length, 2);
