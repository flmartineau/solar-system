import { BufferGeometry, Line, LineBasicMaterial, Material, Vector3 } from 'three';
import { MainScene } from '../../scenes/MainScene';
import { MoonConfig, SIZE_FACTOR } from '../../utils/constants';
import { CelestialBody } from './CelestialBody';
import { Vector, Body, GeoVector, HelioVector } from 'astronomy-engine';
import { Planet } from './Planet';

export class Moon extends CelestialBody {

    private _orbitalPeriod: number;
    private _orbitLine: Line;
    private _planet: Planet;

    private _orbitLineGeometry: BufferGeometry;
    private _orbitLineMaterial: LineBasicMaterial;

    constructor(name: string, constants: MoonConfig, material: Material, mainScene: MainScene, body: Body, planet: Planet) {
        super(mainScene, name, constants.radius * SIZE_FACTOR, material, constants.mass, constants.temperature, body);
        this._orbitalPeriod = 27,322 * 24 * 60 * 60 * 1000; //millisecondes;
        this._orbitLineGeometry = new BufferGeometry();
        this._orbitLineMaterial = new LineBasicMaterial({ color: 0x333333 });

        this._planet = planet;
        this._orbitLine = this.createOrbitLine();
        this.mainScene.getScene().add(this._orbitLine);
    }


    private updateOrbitGeometry(segments: number = 200): BufferGeometry {
        const points: Vector3[] = [];
        const period = this._orbitalPeriod * 24 * 60 * 60 * 1000; //millisecondes
        let date: Date = this.mainScene.getTimeController().getCurrentDate();
        let v0 = new Vector3(0, 0, 0);

        for (let i = 0; i < segments; i++) {
            let geoVector: Vector = GeoVector(this.getBody(), date, true);
            let x: number = geoVector.x * SIZE_FACTOR;
            let y: number = geoVector.y * SIZE_FACTOR;
            let z: number = geoVector.z * SIZE_FACTOR;
            let v3 =  new Vector3(x, y, z);
            v3.applyAxisAngle(new Vector3(1, 0, 0), -110 * Math.PI / 180);
            points.push(v3);
            if (i== 0) v0 = v3;
            date = new Date(date.getTime() + (period / segments));
        }

        let helio: Vector = HelioVector(this._planet.getBody(), this.mainScene.getTimeController().getCurrentDate());
        let translate = new Vector3(helio.x * SIZE_FACTOR, helio.y * SIZE_FACTOR, helio.z * SIZE_FACTOR)
        .applyAxisAngle(new Vector3(1, 0, 0), -110 * Math.PI / 180);

        points.push(v0);
        return this._orbitLineGeometry.setFromPoints(points).translate(translate.x, translate.y, translate.z);
    }

    private createOrbitLine(): Line {
        const orbitGeometry = this.updateOrbitGeometry();
        this._orbitLine = new Line(orbitGeometry, this._orbitLineMaterial);
        return this._orbitLine;
    }
    

    public refreshOrbitLine(): void {
        const isVisible: boolean = this._orbitLine.visible;

        if (this.mainScene.getCameraController().distanceToObject(this) > 2000 || !isVisible) {
            this.mainScene.getScene().remove(this._orbitLine);
            return;
        }

        if (isVisible) {
            this.mainScene.getScene().remove(this._orbitLine);
            this._orbitLine.geometry.dispose();
            this._orbitLine = this.createOrbitLine();
            this.mainScene.getScene().add(this._orbitLine);
        }
    }

    public getPlanet(): Planet {
        return this._planet;
    }

    public getOrbitLine(): Line {
        return this._orbitLine;
    }

    public updateOrbit(): void {
        let helioVector: Vector = HelioVector(this._planet.getBody(), this.mainScene.getTimeController().getCurrentDate());
        let geoVector: Vector = GeoVector(this.getBody(), this.mainScene.getTimeController().getCurrentDate(), true);
                
        let x: number = (helioVector.x + geoVector.x) * SIZE_FACTOR;
        let y: number = (helioVector.y + geoVector.y) * SIZE_FACTOR;
        let z: number = (helioVector.z + geoVector.z) * SIZE_FACTOR;

        let vector = new Vector3(x, y, z);

        vector.applyAxisAngle(new Vector3(1, 0, 0), -110 * Math.PI / 180);

        this.position.set(vector.x, vector.y, vector.z);
    }

}