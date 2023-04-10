import { Material, Vector3 } from 'three';
import { MainScene } from '../../scenes/MainScene';
import { MoonConfig, SIZE_FACTOR } from '../../utils/constants';
import { CelestialBody } from './CelestialBody';
import { Vector, Body, GeoVector, HelioVector, KM_PER_AU, NextLunarEclipse } from 'astronomy-engine';
import { Planet } from './Planet';
import { OrbitLine } from './OrbitLine';

export class Moon extends CelestialBody {

    private _distanceToPlanet: number;
    private _orbitalPeriod: number;
    private _orbitLine: OrbitLine;
    private _planet: Planet;

    constructor(name: string, constants: MoonConfig, material: Material, mainScene: MainScene, body: Body, planet: Planet) {
        super(mainScene, name, constants.radius * SIZE_FACTOR, material, constants.mass, constants.temperature, body);
        this._distanceToPlanet = 0;
        this._orbitalPeriod = 27,322 * 24 * 60 * 60 * 1000; //millisecondes;
        
        this._planet = planet;
        this._orbitLine = this.createOrbitLine();
        this.mainScene.scene.add(this._orbitLine);
    }

    get planet(): Planet {
        return this._planet;
    }

    get orbitLine(): OrbitLine {
        return this._orbitLine;
    }

    get distanceToPlanet(): number {
        return this._distanceToPlanet;
    }

    private updateOrbitGeometry(segments: number = 200): Vector3[] {
        const points: Vector3[] = [];
        const period = this._orbitalPeriod * 24 * 60 * 60 * 1000; //millisecondes
        let date: Date = this.mainScene.timeController.currentDate;
        let v0 = new Vector3(0, 0, 0);

        for (let i = 0; i < segments; i++) {
            let geoVector: Vector = GeoVector(this.body, date, true);
            let x: number = geoVector.x * SIZE_FACTOR;
            let y: number = geoVector.y * SIZE_FACTOR;
            let z: number = geoVector.z * SIZE_FACTOR;
            let v3 =  new Vector3(x, y, z);
            v3.applyAxisAngle(new Vector3(1, 0, 0), -110 * Math.PI / 180);
            points.push(v3);
            if (i== 0) v0 = v3;
            date = new Date(date.getTime() + (period / segments));
        }
        points.push(v0);
        return points;
    }

    private createOrbitLine(): OrbitLine {
        let helio: Vector = HelioVector(this._planet.body, this.mainScene.timeController.currentDate);
        let translate = new Vector3(helio.x * SIZE_FACTOR, helio.y * SIZE_FACTOR, helio.z * SIZE_FACTOR)
        .applyAxisAngle(new Vector3(1, 0, 0), -110 * Math.PI / 180);

        const orbitGeometry = this.updateOrbitGeometry();
        this._orbitLine = new OrbitLine(this);
        this._orbitLine.geometry.setFromPoints(orbitGeometry);
        this._orbitLine.geometry.translate(translate.x, translate.y, translate.z);
        return this._orbitLine;
    }
    

    public refreshOrbitLine(): void {
        const isVisible: boolean = this._orbitLine.visible;

        if (this.mainScene.cameraController.distanceToObject(this) > 2000 || !isVisible) {
            this.mainScene.scene.remove(this._orbitLine);
            return;
        }

        if (isVisible) {
            this.mainScene.scene.remove(this._orbitLine);
            this._orbitLine.geometry.dispose();
            this._orbitLine = this.createOrbitLine();
            this.mainScene.scene.add(this._orbitLine);
        }
    }


    public updateOrbit(): void {

        let helioVector: Vector = HelioVector(this._planet.body, this.mainScene.timeController.currentDate);
        let geoVector: Vector = GeoVector(this.body, this.mainScene.timeController.currentDate, true);

        if (this.isSelected) {
            this._distanceToPlanet = Math.round(
                Math.sqrt(Math.pow(geoVector.x, 2) + Math.pow(geoVector.y, 2) + Math.pow(geoVector.z, 2))*KM_PER_AU);
        }

        let x: number = (helioVector.x + geoVector.x) * SIZE_FACTOR;
        let y: number = (helioVector.y + geoVector.y) * SIZE_FACTOR;
        let z: number = (helioVector.z + geoVector.z) * SIZE_FACTOR;

        let vector = new Vector3(x, y, z);

        vector.applyAxisAngle(new Vector3(1, 0, 0), -110 * Math.PI / 180);

        this.position.set(vector.x, vector.y, vector.z);
    }

}