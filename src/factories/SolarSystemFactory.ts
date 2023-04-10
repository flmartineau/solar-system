import { CelestialBody } from "../components/celestial/CelestialBody";
import { Planet } from "../components/celestial/Planet";
import { Star } from "../components/celestial/Star";
import { Sun } from "../components/celestial/Sun";
import { MainScene } from "../scenes/MainScene";
import { EarthMoon } from "../components/celestial/moons/EarthMoon";
import { IPlanet, ISolarSystem, ISun } from "../components/celestial/interfaces/ISolarSystem";

export class SolarSystemFactory {

    private _data: any;
    private _mainScene: MainScene;

    private _sun: Star;
    private _planets: Array<Planet>;

    constructor(data: ISolarSystem, mainScene: MainScene) {
        this._data = data;
        this._mainScene = mainScene;
        console.log(data.sun.planets);
        this._sun = this.buildSun(data.sun);
        this._planets = this.buildPlanets(data.sun.planets);
    }

    public buildSun(data: ISun): Sun {
       return new Sun(this._mainScene);
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

        if (planet.name !== 'Earth')
            return;

        let moon = new EarthMoon(this._mainScene, planet);
        planet.addMoon(moon);
    }


    public getPlanet(name: string): Planet | undefined {
        return this._planets.find((p: Planet) => p.name === name);
    }

    public getPlanetByIndex(index: number): Planet {
        return this._planets[index];
    }

    public get sun(): Star {
        return this._sun;
    }

    public get planets(): Array<Planet> {
        return this._planets;
    }

    public get celestialBodies(): Array<CelestialBody> {
        return [this._sun as CelestialBody].concat(this._planets as CelestialBody[]).concat(this.getPlanetByIndex(2).moons[0]);
    }


}
