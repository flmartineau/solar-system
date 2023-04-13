export interface ISolarSystem {
    sun: ISun
}

export interface ISun {
    id: number;
    name: string;
    radius: number;
    mass: number;
    color: string;
    textures: ITextures;
    temperature: number;
    rotationPeriod: number;
    planets: Array<IPlanet>;
}

export interface IPlanet {
    id: number;
    name: 'Earth' | 'Mars' | 'Jupiter' | 'Saturn' | 'Uranus' | 'Neptune' | 'Mercury' | 'Venus' | 'Pluto';
    radius: number;
    mass: number;
    color: string;
    textures: ITextures;
    temperature: number;
    rotationPeriod: number;
    hasAtmosphere?: boolean;
    rings: IRings;
    orbit: IOrbit;
    moons: Array<IMoon>;
}

export interface IMoon {
    id: string;
    name: 'Moon';
    radius: number;
    mass: number;
    color: string;
    textures: ITextures;
    temperature: number;
    rotationPeriod: number;
    orbit: IOrbit;
}

export interface IOrbit {
    distance: number;
    period: number;
    inclination: number;
}

export interface IRings {
    innerRadius: number;
    outerRadius: number;
}

export interface ITextures {
    base: string;
    cloud?: string;
    night?: string;
    rings: string;
}