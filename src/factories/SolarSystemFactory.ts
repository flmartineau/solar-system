import { CelestialBody } from "../components/celestial/CelestialBody";
import { Planet } from "../components/celestial/Planet";
import { Sun } from "../components/celestial/Sun";
import { MainScene } from "../scenes/MainScene";
import { IMoon, IPlanet, ISolarSystem, ISun } from "../components/celestial/interfaces/ISolarSystem";
import { Moon } from "../components/celestial/Moon";

export class SolarSystemFactory {

    private _data: any;
    private _mainScene: MainScene;

    private _sun: Sun;
    private _planets: Array<Planet>;

    constructor(data: ISolarSystem, mainScene: MainScene) {
        this._data = data;
        this._mainScene = mainScene;
        this._sun = this.buildSun(data.sun);
        this._planets = this.buildPlanets(data.sun.planets);
    }

    public buildSun(data: ISun): Sun {
       return new Sun(data, this._mainScene);
    }

    private buildPlanets(data: IPlanet[]): Array<Planet> {
        let planets: Array<Planet> = new Array<Planet>();

        data.forEach((p: IPlanet) => {
            let planet = new Planet(p, this._mainScene);
            planets.push(planet);
            if (p.moons.length > 0) {
                this.buildMoons(planet, p.moons);
            }
        });

        return planets;
    }

    private buildMoons(planet: Planet, data: any): void {
        data.forEach((m: IMoon) => {
            let moon = new Moon(m, this._mainScene, planet);
            planet.addMoon(moon);
        });
    }

    public getPlanet(name: string): Planet | undefined {
        return this._planets.find((p: Planet) => p.name === name);
    }

    public getPlanetByIndex(index: number): Planet {
        return this._planets[index];
    }

    public get sun(): Sun {
        return this._sun;
    }

    public get planets(): Array<Planet> {
        return this._planets;
    }

    public get celestialBodies(): Array<CelestialBody> {
        return [this._sun as CelestialBody]
        .concat(this._planets as CelestialBody[])
        .concat((this._planets.length > 3) ? this.getPlanetByIndex(2).moons[0] : []);
    }


}
