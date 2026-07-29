export type SoundId = 'rain' | 'waves' | 'wind' | 'forest';

export interface NatureSound {
  id: SoundId;
  label: string;
  description: string;
}

export const NATURE_SOUNDS: NatureSound[] = [
  {
    id: 'rain',
    label: 'Pluie',
    description: 'Gouttes douces',
  },
  {
    id: 'waves',
    label: 'Vagues',
    description: 'Océan',
  },
  {
    id: 'wind',
    label: 'Vent',
    description: 'Brise légère',
  },
  {
    id: 'forest',
    label: 'Forêt',
    description: 'Oiseaux',
  },
];
