export type SoundId = 'rain' | 'waves' | 'wind' | 'forest';

export interface NatureSound {
  id: SoundId;
  label: string;
  description: string;
  /** Sons ambiants publics (Google Actions Sound Library). */
  src: string;
}

export const NATURE_SOUNDS: NatureSound[] = [
  {
    id: 'rain',
    label: 'Pluie',
    description: 'Gouttes douces sur le toit',
    src: 'https://actions.google.com/sounds/v1/weather/light_rain.ogg',
  },
  {
    id: 'waves',
    label: 'Vagues',
    description: 'Océan apaisant',
    src: 'https://actions.google.com/sounds/v1/water/waves_crashing_on_rock_beach.ogg',
  },
  {
    id: 'wind',
    label: 'Vent léger',
    description: 'Brise dans les arbres',
    src: 'https://actions.google.com/sounds/v1/weather/leaves_russle_on_tree.ogg',
  },
  {
    id: 'forest',
    label: 'Forêt',
    description: "Chants d'oiseaux & feuilles",
    src: 'https://actions.google.com/sounds/v1/ambiences/spring_day_forest.ogg',
  },
];
