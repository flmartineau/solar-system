import { Body, HelioDistance, HelioVector, KM_PER_AU, PlanetOrbitalPeriod, RotationAxis, Vector } from 'astronomy-engine';
import { CelestialBody } from './CelestialBody';
import { PlanetConfig, SIZE_FACTOR } from '../../utils/constants';
import { MainScene } from '../../scenes/MainScene';
import { ColorRepresentation, Material, PointLight, Texture, Vector3} from 'three';
import { EarthMoon } from './moons/EarthMoon';
import { Moon } from './Moon';
import {Lensflare, LensflareElement} from "three/examples/jsm/objects/Lensflare";
import { OrbitLine } from './OrbitLine';


export class Planet extends CelestialBody {

    private _distanceToSun: number;
    private _orbitalPeriod: number;
    private _orbitLine: OrbitLine;
    private _moons: Array<Moon> = [];
    private _position: Vector3 = new Vector3(0, 0, 0);

    private _lastOrbitLineUpdateTime: number;

    private _pointLight;
    private _lensflare = new Lensflare();
    private _textureFlare: Texture;

    constructor(name: string, constants: PlanetConfig, material: Material, mainScene: MainScene, body: Body, lightColor: ColorRepresentation) {

        super(mainScene,name, constants.radius * SIZE_FACTOR, material, constants.mass, constants.temperature, body);
        this._distanceToSun = 0;
        this._orbitalPeriod = PlanetOrbitalPeriod(body);
        this._textureFlare = this.mainScene.textureLoader.load('./assets/textures/lensflare/lensflare.png');
        
        this._orbitLine = this.createOrbitLine();
        this._lastOrbitLineUpdateTime = 0;
        this._pointLight = new PointLight(lightColor, 0, 0);
    
        this._lensflare.addElement(new LensflareElement(this._textureFlare, 20, 0, this._pointLight.color));
       
        this._pointLight.add(this._lensflare);
        

        this.mainScene.scene.add(this._orbitLine);
    }

    get distanceToSun(): number {
        return this._distanceToSun;
    }

    get moons(): Array<Moon> {
        return this._moons;
    }

    get lastOrbitLineUpdateTime(): number {
        return this._lastOrbitLineUpdateTime;
    }

    set lastOrbitLineUpdateTime(time: number) {
        this._lastOrbitLineUpdateTime = time;
    }

    get orbitLine(): OrbitLine {
        return this._orbitLine;
    }

    get orbitalPeriod(): number {
        return this._orbitalPeriod;
    }

    public updateLighting(): void {
        this.mainScene.scene.remove(this._pointLight);
        this._pointLight.position.set(this.position.x, this.position.y, this.position.z);
        this.mainScene.scene.add(this._pointLight);
      }

    public addMoon(moon: Moon): void {
        this._moons.push(moon);
    }

    public update(): void {
        super.update();
        
        if (this.isSelected)
            this._distanceToSun = Math.round(HelioDistance(this.body, this.mainScene.timeController.currentDate)* KM_PER_AU);
        let v: Vector = HelioVector(this.body, this.mainScene.timeController.currentDate);
        let x: number = v.x * SIZE_FACTOR;
        let y: number = v.y * SIZE_FACTOR;
        let z: number = v.z * SIZE_FACTOR;
        let vector = new Vector3(x, y, z);

        vector.applyAxisAngle(new Vector3(1, 0, 0), -110 * Math.PI / 180);

        this._position = vector;

        this.position.set(this._position.x, this._position.y, this._position.z);

        this._moons.forEach((moon: Moon) => {
            moon.updateOrbit();
            moon.refreshOrbitLine();
        });

        this.updateLighting();

        this.lastOrbitLineUpdateTime = this.lastOrbitLineUpdateTime + this.mainScene.timeController.elapsedTime;
        // Check if it's time to update the orbit line
        if (this.lastOrbitLineUpdateTime >= (this.orbitalPeriod * 24 * 60 * 60 * 1000)) {
            this.refreshOrbitLine();
            this.lastOrbitLineUpdateTime = 0;
        }


    }

    private updateOrbitGeometry(segments: number = 3000): Vector3[] {
        const points: Vector3[] = [];
        const period = this._orbitalPeriod * 24 * 60 * 60 * 1000; //millisecondes
        let date: Date = this.mainScene.timeController.currentDate;

        let v0 = new Vector3(0, 0, 0);

        for (let i = 0; i < segments; i++) {
            let v = HelioVector(this.body, date);
            let v3 = new Vector3(v.x * SIZE_FACTOR, v.y * SIZE_FACTOR, v.z * SIZE_FACTOR);
            v3.applyAxisAngle(new Vector3(1, 0, 0), -110 * Math.PI / 180);
            points.push(v3);
            if (i== 0) v0 = v3;
            date = new Date(date.getTime() + (period / segments));
        }

        points.push(v0);
        return points;
    }

    private createOrbitLine(): OrbitLine {
        const orbitGeometry = this.updateOrbitGeometry();
        this._orbitLine = new OrbitLine(this);
        this._orbitLine.geometry.setFromPoints(orbitGeometry);
        return this._orbitLine;
    }

    public refreshOrbitLine(): void {
        const isVisible: boolean = this._orbitLine.visible;

        if (isVisible) {
            this.mainScene.scene.remove(this._orbitLine);
            this._orbitLine.geometry.dispose();
            this._orbitLine = this.createOrbitLine();
            this.mainScene.scene.add(this._orbitLine);
        }
    }

    public addMoons(): void {
        switch (this.name) {
            case 'Earth':
                let moon = new EarthMoon(this.mainScene, this);
                this._moons.push(moon);
                break;
            default:
                break;
        }
    }
}