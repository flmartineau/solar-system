import { KM_PER_AU } from "astronomy-engine";

export interface SunConfig {
  radius: number;
  mass: number;
  temperature: number;
}

export const SIZE_FACTOR = 10000;

export interface PlanetConfig {
  radius: number;
  mass: number;
  temperature: number;
}

export interface MoonConfig {
  radius: number;
  mass: number;
  temperature: number;
}

export interface Constants {
  Sun: SunConfig;
  Mercury: PlanetConfig;
  Venus: PlanetConfig;
  Earth: PlanetConfig;
  Mars: PlanetConfig;
  Jupiter: PlanetConfig;
  Saturn: PlanetConfig;
  Uranus: PlanetConfig;
  Neptune: PlanetConfig;
  Pluto: PlanetConfig;
  Moon: MoonConfig;
}

export const constants: {
  Sun: SunConfig;
  Mercury: PlanetConfig;
  Venus: PlanetConfig;
  Earth: PlanetConfig; 
  Mars: PlanetConfig;
  Jupiter: PlanetConfig;
  Saturn: PlanetConfig;
  Uranus: PlanetConfig;
  Neptune: PlanetConfig;
  Pluto: PlanetConfig;
  Moon: MoonConfig;

} = {
  Sun: {
    radius: 695508 / KM_PER_AU,
    mass: 1.989 * Math.pow(10, 30),
    temperature: 5778,
  },
  Mercury: {
    radius: 2439 / KM_PER_AU,
    mass: 3.3011 * Math.pow(10, 23),
    temperature: 440,
  },
  Venus: {
    radius: 6052 / KM_PER_AU,
    mass: 4.8675 * Math.pow(10, 24),
    temperature: 737,
  },
  Earth: {
    radius: 6371 / KM_PER_AU,
    mass: 5.97237 * Math.pow(10, 24),
    temperature: 288,
  },
  Mars: {
    radius: 3389 / KM_PER_AU,
    mass: 6.4171 * Math.pow(10, 23),
    temperature: 210,
  },
  Jupiter: {
    radius: 69911 / KM_PER_AU,
    mass: 1.8982 * Math.pow(10, 27),
    temperature: 165,
  },
  Saturn: {
    radius: 58232 / KM_PER_AU,
    mass: 5.6834 * Math.pow(10, 26),
    temperature: 134,
  },
  Uranus: {
    radius: 25362 / KM_PER_AU,
    mass: 8.6810 * Math.pow(10, 25),
    temperature: 76,
  },
  Neptune: {
    radius: 24622 / KM_PER_AU,
    mass: 1.02413 * Math.pow(10, 26),
    temperature: 72,
  },
  Pluto: {
    radius: 1188 / KM_PER_AU,
    mass: 1.303 * Math.pow(10, 22),
    temperature: 44,
  },

  Moon: {
    radius: 1737.4 / KM_PER_AU,
    mass: 7.34767309 * Math.pow(10, 22),
    temperature: 127,
  },
};

