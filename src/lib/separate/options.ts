export interface Option {
  label: string;
  value: string;
}

export const SEPARATION_MODE = [
  {
    label: "Vocals and Instrumentals",
    value: "2_stems",
  },
  {
    label: "Drums, Bass, Vocals, and Other",
    value: "4_stems",
  },
  {
    label: "Drums, Bass, Guitar, Piano, Vocals, and Other",
    value: "6_stems",
  },
] as const satisfies Option[];

export const SEPARATION_SPEED = [
  {
    label: "Fast Processing",
    value: "fast",
  },
  {
    label: "Better Quality",
    value: "high_quality",
  },
] as const satisfies Option[];
