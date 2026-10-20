// Inspect actual video blocks, not just TrackEntry dimensions. Some mobile recorders
// emit a nominal 640x480 video track plus audio packets, with zero video packets.
export function validateWebmFrames(data: Uint8Array, expectedDuration: number): void {
  let videoTrack = -1, scale = 1000000, clusterTime = 0;
  let frames = 0, first = Infinity, last = -Infinity;
  const vint = (offset: number, keepMarker = false) => {
    const initial = data[offset];
    if (!initial) throw new Error('Invalid recording container.');
    let length = 1, marker = 128;
    while (!(initial & marker) && length <= 8) { length++; marker >>= 1; }
    if (length > 8 || offset + length > data.length) throw new Error('Truncated recording container.');
    let value = keepMarker ? initial : initial & (marker - 1);
    let unknown = !keepMarker && value === marker - 1;
    for (let n = 1; n < length; n++) { value = value * 256 + data[offset + n]; unknown = unknown && data[offset + n] === 255; }
    return { length, value, unknown };
  };
  const uint = (start: number, end: number) => {
    let value = 0;
    for (let n = start; n < end; n++) value = value * 256 + data[n];
    return value;
  };
  const walk = (start: number, end: number, depth = 0, inCluster = false): number => {
    if (depth > 8) throw new Error('Invalid recording structure.');
    let trackNumber = -1, trackType = -1;
    for (let offset = start; offset < end;) {
      const elementStart = offset;
      const id = vint(offset, true); offset += id.length;
      // MediaRecorder emits consecutive unknown-size Clusters. The next Cluster
      // ends the previous one; it must not be treated as its nested child.
      if (inCluster && id.value === 0x1f43b675) return elementStart;
      const size = vint(offset); offset += size.length;
      let next = size.unknown ? end : offset + size.value;
      if (next > end || next < offset) throw new Error('Incomplete recording.');
      if (id.value === 0xd7) trackNumber = uint(offset, next);
      if (id.value === 0x83) trackType = uint(offset, next);
      if (id.value === 0x2ad7b1) scale = uint(offset, next);
      if (id.value === 0xe7) clusterTime = uint(offset, next);
      if (id.value === 0xa3 || id.value === 0xa1) {
        const track = vint(offset);
        const p = offset + track.length;
        if (track.value === videoTrack && p + 3 < next) {
          const raw = data[p] * 256 + data[p + 1];
          const time = clusterTime + (raw > 32767 ? raw - 65536 : raw);
          frames++; first = Math.min(first, time); last = Math.max(last, time);
        }
      }
      if ([0x18538067, 0x1549a966, 0x1654ae6b, 0xae, 0x1f43b675, 0xa0].includes(id.value)) {
        const consumed = walk(offset, next, depth + 1, id.value === 0x1f43b675);
        if (size.unknown) next = consumed;
      }
      offset = next;
    }
    if (trackType === 1) videoTrack = trackNumber;
    return end;
  };
  walk(0, data.length);
  if (!frames) throw new Error('This browser saved audio without video frames. Enable Software compatibility mode and retry.');
  const coverage = (last - first) * scale / 1e9;
  if (expectedDuration > 1 && coverage < expectedDuration - Math.max(0.75, expectedDuration * 0.1)) {
    throw new Error('The recording is missing part of the video. Enable Software compatibility mode and retry.');
  }
}
