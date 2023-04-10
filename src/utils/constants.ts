import { KM_PER_AU } from "astronomy-engine";

export interface SunConfig {
  radius: number;
  mass: number;
  temperature: number;
}

export const SIZE_FACTOR = 10000;

export interface MoonConfig {
  radius: number;
  mass: number;
  temperature: number;
}

export interface Constants {
  Sun: SunConfig;
  Moon: MoonConfig;
}

export const constants: {
  Sun: SunConfig;
  Moon: MoonConfig;

} = {
  Sun: {
    radius: 695508 / KM_PER_AU,
    mass: 1.989 * Math.pow(10, 30),
    temperature: 5778,
  },
  Moon: {
    radius: 1737.4 / KM_PER_AU,
    mass: 7.34767309 * Math.pow(10, 22),
    temperature: 127,
  },
};

