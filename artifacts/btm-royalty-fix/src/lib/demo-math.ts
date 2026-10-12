export const TRACK_THRESHOLD = 1000;

export type DemoTrack = {
  name: string;
  streams: number;
};

export const sampleTracks: DemoTrack[] = [
  { name: 'African Queen Returns', streams: 820 },
  { name: 'Grace in the Morning', streams: 640 },
  { name: 'No Turning Back', streams: 1240 },
  { name: 'Lagos Nights', streams: 430 },
  { name: 'Higher Ground', streams: 960 },
];

export const poolContributors = [
  { name: 'Artist A', streams: 820 },
  { name: 'Artist B', streams: 640 },
  { name: 'Artist C', streams: 430 },
  { name: 'Artist D', streams: 960 },
];

export function calculateDemo(poolAmount: number, allocationPercent: number) {
  const safeAmount = Number.isFinite(poolAmount) ? Math.max(0, poolAmount) : 0;
  const safePercent = Number.isFinite(allocationPercent)
    ? Math.min(100, Math.max(0, allocationPercent))
    : 0;
  const allocation = Math.round(safeAmount * safePercent) / 100;
  return {
    poolAmount: safeAmount,
    allocationPercent: safePercent,
    allocation,
    contributorStreams: poolContributors.reduce((total, person) => total + person.streams, 0),
    totalStreams: sampleTracks.reduce((total, track) => total + track.streams, 0),
    belowThresholdCount: sampleTracks.filter((track) => track.streams < TRACK_THRESHOLD).length,
    qualifyingCount: sampleTracks.filter((track) => track.streams >= TRACK_THRESHOLD).length,
  };
}

export function formatMoney(value: number, digits = 2) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}
