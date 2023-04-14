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
    private _moons: Array<Moon>;

    /**
     * Factory for creating a solar system.
     * @param data JSON data for the solar system.
     * @param mainScene The main scene to which the solar system is attached.
     */
    constructor(data: ISolarSystem, mainScene: MainScene) {
        this._data = data;
        this._mainScene = mainScene;
        this._moons = new Array<Moon>();
        this._sun = this.buildSun(data.sun);
        this._planets = this.buildPlanets(data.sun.planets);
    }

    /**
     * Build a Sun object from the given data.
     * @param data JSON data for the Sun.
     * @returns Sun object.
     */
    public buildSun(data: ISun): Sun {
        let sun = new Sun(data, this._mainScene);
        this._mainScene.selectObject(sun);
        return sun;
    }

    /**
     * Build all planets and moons objects from the given data.
     * @param data JSON data for the planets and moons.
     * @returns Array of Planet objects.
     */
    private buildPlanets(data: IPlanet[]): Array<Planet> {
        let planets: Array<Planet> = new Array<Planet>();

        data.forEach((p: IPlanet) => {
            if (p.name === 'Pluto') p.radius *= 50; //Temporary fix to avoid Pluto orbit lines jiggle
            let planet = new Planet(p, this._mainScene);
            planets.push(planet);
            if (p.moons.length > 0) {
                this.buildMoons(planet, p.moons);
            }
        });

        return planets;
    }

    /**
     * Build all moons objects of a given planet from the given data.
     * @param planet planet to which the moons belong.
     * @param data JSON data for the moons.
     */
    private buildMoons(planet: Planet, data: any): void {
        data.forEach((m: IMoon) => {
            let moon = new Moon(m, this._mainScene, planet);
            this._moons.push(moon);
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
            .concat(this._moons as CelestialBody[]);
    }


}
