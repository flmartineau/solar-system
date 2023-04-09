import { Body, HelioDistance, HelioVector, KM_PER_AU, PlanetOrbitalPeriod, RotationAxis, Vector } from 'astronomy-engine';
import { CelestialBody } from './CelestialBody';
import { PlanetConfig, SIZE_FACTOR } from '../../utils/constants';
import { MainScene } from '../../scenes/MainScene';
import { BufferGeometry, Line, LineBasicMaterial, Material, Vector3} from 'three';
import { EarthMoon } from './moons/EarthMoon';
import { Moon } from './Moon';

export class Planet extends CelestialBody {

    private _distanceToSun: number;
    private _orbitalPeriod: number;
    private _orbitLine: Line;
    private _moons: Array<Moon> = [];
    private _position: Vector3 = new Vector3(0, 0, 0);

    private _lastOrbitLineUpdateTime: number;
    private _orbitLineGeometry: BufferGeometry;
    private _orbitLineMaterial: LineBasicMaterial;

    constructor(name: string, constants: PlanetConfig, material: Material, mainScene: MainScene, body: Body) {

        super(mainScene,name, constants.radius * SIZE_FACTOR, material, constants.mass, constants.temperature, body);
        this._distanceToSun = 0;
        this._orbitalPeriod = PlanetOrbitalPeriod(body);
        this._orbitLineGeometry = new BufferGeometry();
        this._orbitLineMaterial = new LineBasicMaterial({ color: 0x333333 });
        this._orbitLineMaterial.depthWrite = false;
        this._orbitLine = this.createOrbitLine();
        this._lastOrbitLineUpdateTime = 0;
        

        this.mainScene.getScene().add(this._orbitLine);
    }

    public getName() {
        return this.name;
    }

    public getDistanceToSun(): number {
        return this._distanceToSun;
    }

    public getMoons(): Array<Moon> {
        return this._moons;
    }

    public addMoon(moon: Moon): void {
        this._moons.push(moon);
    }

    public getLastOrbitLineUpdateTime(): number {
        return this._lastOrbitLineUpdateTime;
    }

    public setLastOrbitLineUpdateTime(time: number): void {
        this._lastOrbitLineUpdateTime = time;
    }

    public getOrbitLine(): Line {
        return this._orbitLine;
    }

    public getOrbitalPeriod(): number {
        return this._orbitalPeriod;
    }

    public updateOrbit(): void {
        this._distanceToSun = Math.round(HelioDistance(this.getBody(), this.mainScene.getTimeController().getCurrentDate())* KM_PER_AU);
        let v: Vector = HelioVector(this.getBody(), this.mainScene.getTimeController().getCurrentDate());
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

    }

    private updateOrbitGeometry(segments: number = 3000): BufferGeometry {
        const points: Vector3[] = [];
        const period = this._orbitalPeriod * 24 * 60 * 60 * 1000; //millisecondes
        let date: Date = this.mainScene.getTimeController().getCurrentDate();

        let v0 = new Vector3(0, 0, 0);

        for (let i = 0; i < segments; i++) {
            let v = HelioVector(this.getBody(), date);
            let v3 = new Vector3(v.x * SIZE_FACTOR, v.y * SIZE_FACTOR, v.z * SIZE_FACTOR);
            v3.applyAxisAngle(new Vector3(1, 0, 0), -110 * Math.PI / 180);
            points.push(v3);
            if (i== 0) v0 = v3;
            date = new Date(date.getTime() + (period / segments));
        }

        points.push(v0);
        return this._orbitLineGeometry.setFromPoints(points);
    }

    private createOrbitLine(): Line {
        const orbitGeometry = this.updateOrbitGeometry();
        this._orbitLine = new Line(orbitGeometry, this._orbitLineMaterial);
        return this._orbitLine;
    }

    public refreshOrbitLine(): void {
        const isVisible: boolean = this._orbitLine.visible;

        if (isVisible) {
            this.mainScene.getScene().remove(this._orbitLine);
            this._orbitLine.geometry.dispose();
            this._orbitLine = this.createOrbitLine();
            this.mainScene.getScene().add(this._orbitLine);
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