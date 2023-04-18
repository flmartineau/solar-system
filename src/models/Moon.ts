import { Color, LineBasicMaterial, MeshPhongMaterial, Texture, Vector3 } from 'three';
import { MainScene } from '../scenes/MainScene';
import { SIZE_FACTOR } from '../utils/constants';
import { CelestialBody } from './CelestialBody';
import { Vector, Body, GeoVector, HelioVector, KM_PER_AU, AxisInfo, RotationAxis, JupiterMoons, JupiterMoonsInfo, StateVector, AstroTime } from 'astronomy-engine';
import { Planet } from './Planet';
import { OrbitLine } from './OrbitLine';
import { IMoon } from '../interfaces/ISolarSystem';

export class Moon extends CelestialBody {

    private _distanceToPlanet: number;
    private _orbitalPeriod: number;
    private _orbitLine: OrbitLine;
    private _planet: Planet;

    constructor(data: IMoon, mainScene: MainScene, planet: Planet) {
        
        const texture: Texture = mainScene.textureLoader.load(data.textures.base);
        const material = new MeshPhongMaterial({ map: texture });
        
        super(mainScene, data, (data.radius / KM_PER_AU) * SIZE_FACTOR, material);
        this._distanceToPlanet = 0;
        this._orbitalPeriod = data.orbit.period;
        
        this._planet = planet;
        this._orbitLine = new OrbitLine(this);
        this._orbitLine = this.createOrbitLine();
        this.mainScene.scene.add(this._orbitLine);
    }

    get planet(): Planet {
        return this._planet;
    }

    get orbitLine(): OrbitLine {
        return this._orbitLine;
    }

    get isSelected(): boolean {
        return super.isSelected;
    }

    get distanceToPlanet(): number {
        return this._distanceToPlanet;
    }

    set isSelected(value: boolean) {
        super.isSelected = value;
        if (value) this.refreshOrbitLine();
        (this.orbitLine.material as LineBasicMaterial).color = new Color(value ? 0x0f2e82 : 0x333333);
    }

    private updateOrbitGeometry(segments: number = 200): Vector3[] {
        const points: Vector3[] = [];
        const period = this._orbitalPeriod * 24 * 60 * 60 * 1000; //milliseconds
        
        let t0 = this.mainScene.timeController.currentDate.getTime() - (period / 2);
        let date = new Date(t0);


        let v0 = new Vector3(0, 0, 0);

        for (let i = 0; i < segments; i++) {
            let planetVector: Vector3 = this.getPlanetVector(date);
            let x: number = planetVector.x * SIZE_FACTOR;
            let y: number = planetVector.y * SIZE_FACTOR;
            let z: number = planetVector.z * SIZE_FACTOR;
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
        let planetVector: Vector3 = this.getPlanetVector(this.mainScene.timeController.currentDate);
        if (this.isSelected) {
            this._distanceToPlanet = Math.round(
                Math.sqrt(Math.pow(planetVector.x, 2) + Math.pow(planetVector.y, 2) + Math.pow(planetVector.z, 2))*KM_PER_AU);
        }

        let x: number = (helioVector.x + planetVector.x) * SIZE_FACTOR;
        let y: number = (helioVector.y + planetVector.y) * SIZE_FACTOR;
        let z: number = (helioVector.z + planetVector.z) * SIZE_FACTOR;

        let vector = new Vector3(x, y, z);

        vector.applyAxisAngle(new Vector3(1, 0, 0), -110 * Math.PI / 180);

        this.position.set(vector.x, vector.y, vector.z);
    }

    private getPlanetVector(date: Date): Vector3 {
        switch (this.planet.name) {
            case 'Earth':
                const geoVector: Vector = GeoVector(Body.Moon, date, true);
                return new Vector3(geoVector.x, geoVector.y, geoVector.z);
            case 'Jupiter':
                const stateVector: StateVector = this.getJupiterMoonByName(JupiterMoons(date), this.name);
                return new Vector3(stateVector.x, stateVector.y, stateVector.z);
            default:
                return new Vector3(0, 0, 0);
        }
    }

    private getJupiterMoonByName(jupiterMoons: JupiterMoonsInfo, name: string): StateVector {
        switch (name.toLowerCase()) {
            case 'io':
                return jupiterMoons.io;
            case 'europa':
                return jupiterMoons.europa;
            case 'ganymede':
                return jupiterMoons.ganymede;
            case 'callisto':
                return jupiterMoons.callisto;
            default:
                return new StateVector(0, 0, 0, 0, 0, 0, new AstroTime(0));
        }
    }


    public update(): void {
        super.update();
        if (this.visible)
            this.updateRotation();
    }

    public updateRotation(): void {
        let axisInfo: AxisInfo = RotationAxis(Body.Moon, this.mainScene.timeController.currentDate);
        this.rotation.y = (axisInfo.spin % 360) * (Math.PI / 180);
    }

    public instanceOf(className: string): boolean {
        return className === 'Moon';
    }

}