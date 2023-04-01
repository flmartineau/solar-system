export interface SunConfig {
    radius: number;
    rotationSpeed: number;
    mass: number;
    temperature: number;
  }
  
  export interface PlanetConfig {
    radius: number;
    distanceToSun: number;
    orbitalSpeed: number;
    rotationSpeed: number;
    inclination: number;
    mass: number;
    temperature: number;
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
  } = {
    Sun: {
      radius: 1,
      rotationSpeed: 0.00005,
      mass: 1.989 * Math.pow(10, 30),
      temperature: 5778,
    },
    Mercury: {
      radius: 0.1,//0.003285, // 0.05
      distanceToSun: 3.7, // 5
      orbitalSpeed: 0.002,
      rotationSpeed: 0.001,
      inclination: (7 * Math.PI) / 180,
      mass: 3.3011 * Math.pow(10, 23),
      temperature: 440,
    },
    Venus: {
      radius: 0.008138, // 0.1
      distanceToSun: 7.2, // 10
      orbitalSpeed: 0.002,
      rotationSpeed: 0.001,
      inclination: (3.39 * Math.PI) / 180,
      mass: 4.8675 * Math.pow(10, 24),
      temperature: 737,
    },
    Earth: {
      radius: 0.008515, // Earth radius = 1
      distanceToSun: 10, // 10
      orbitalSpeed: 0.001, // Orbital speed of Earth
      rotationSpeed: 0.001, // Rotation speed of Earth
      inclination: (0 * Math.PI) / 180, // Inclination of Earth
      mass: 5.97237 * Math.pow(10, 24), // Mass of Earth
      temperature: 288, // Temperature of Earth
    },
    Mars: {
      radius: 0.004537,
      distanceToSun: 15.2,
      orbitalSpeed: 0.0008,
      rotationSpeed: 0.001,
      inclination: (1.85 * Math.PI) / 180,
      mass: 6.4171 * Math.pow(10, 23),
      temperature: 210,
    },
    Jupiter: {
      radius: 0.094254,
      distanceToSun: 52.0,
      orbitalSpeed: 0.00043,
      rotationSpeed: 0.001,
      inclination: (1.3 * Math.PI) / 180,
      mass: 1.8982 * Math.pow(10, 27),
      temperature: 165,
    },
    Saturn: {
      radius: 0.079303,
      distanceToSun: 95.4,
      orbitalSpeed: 0.00032,
      rotationSpeed: 0.001,
      inclination: (2.49 * Math.PI) / 180,
      mass: 5.6834 * Math.pow(10, 26),
      temperature: 134,
    },
        Uranus: {
            radius: 0.034115,
            distanceToSun: 192.4,
            orbitalSpeed: 0.00023,
            rotationSpeed: 0.001,
            inclination: (0.77 * Math.PI) / 180,
            mass: 8.6810 * Math.pow(10, 25),
            temperature: 76,
          },
          Neptune: {
            radius: 0.033149,
            distanceToSun: 301.1,
            orbitalSpeed: 0.00018,
            rotationSpeed: 0.001,
            inclination: (1.77 * Math.PI) / 180,
            mass: 1.02413 * Math.pow(10, 26),
            temperature: 72,
          },
        };
        
  