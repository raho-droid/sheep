export interface JumpingSheep {
  id: string;
  number: number;
  accessory: 'nightcap' | 'flower' | 'crown' | 'stars' | 'ribbon';
  xPercent: number;
  yPercent: number;
  rotation: number;
  createdAt: number;
}

export type ActiveTab = 'counter' | 'breathing' | 'sounds' | 'letter';

export type AmbientSoundType = 'none' | 'lullaby' | 'rain' | 'crickets' | 'waves';

export interface BedtimeMilestone {
  count: number;
  message: string;
  subtext: string;
}
