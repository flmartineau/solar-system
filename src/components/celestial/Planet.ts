import { AxisInfo, Body, HelioDistance, HelioVector, KM_PER_AU, PlanetOrbitalPeriod, RotationAxis, Vector } from 'astronomy-engine';
import { CelestialBody } from './CelestialBody';
import { PlanetConfig, SIZE_FACTOR } from '../../utils/constants';
import { MainScene } from '../../scenes/MainScene';
import { BufferGeometry, Line, LineBasicMaterial, Material, Vector3} from 'three';

export class Planet extends CelestialBody {

    private distanceToSun: number;
    private orbitalPeriod: number;
    private orbitLine: Line;
    private body: Body;

    private lastOrbitLineUpdateTime: number;
    private orbitLineGeometry: BufferGeometry;
    private orbitLineMaterial: LineBasicMaterial;

    constructor(name: string, constants: PlanetConfig, material: Material, mainScene: MainScene, body: Body) {

        super(mainScene,name, constants.radius * SIZE_FACTOR, material, constants.mass, constants.temperature);
        this.distanceToSun = 0;
        this.orbitalPeriod = PlanetOrbitalPeriod(body);
        this.body = body;
        this.orbitLineGeometry = new BufferGeometry();
        this.orbitLineMaterial = new LineBasicMaterial({ color: 0x333333 });
        this.orbitLine = this.createOrbitLine();
        this.lastOrbitLineUpdateTime = 0;
        

        this.getMainScene().getScene().add(this.orbitLine);
    }

    public getDistanceToSun(): number {
        return this.distanceToSun;
    }

    public getBody(): Body {
        return this.body;
    }

    public getLastOrbitLineUpdateTime(): number {
        return this.lastOrbitLineUpdateTime;
    }

    public setLastOrbitLineUpdateTime(time: number): void {
        this.lastOrbitLineUpdateTime = time;
    }

    public getOrbitLine(): Line {
        return this.orbitLine;
    }

    public getOrbitalPeriod(): number {
        return this.orbitalPeriod;
    }

    public updateOrbit(): void {
        this.distanceToSun = Math.round(HelioDistance(this.body, this.getMainScene().getTimeController().getCurrentDate())* KM_PER_AU);
        let v: Vector = HelioVector(this.body, this.getMainScene().getTimeController().getCurrentDate());
        let x: number = v.x * SIZE_FACTOR;
        let y: number = v.y * SIZE_FACTOR;
        let z: number = v.z * SIZE_FACTOR;
        let vector = new Vector3(x, y, z);

        vector.applyAxisAngle(new Vector3(1, 0, 0), -110 * Math.PI / 180);

        this.position.set(vector.x, vector.y, vector.z);
    }

    public updateRotation(): void {
        let axisInfo: AxisInfo = RotationAxis(this.body, this.getMainScene().getTimeController().getCurrentDate());
        this.rotation.y = (axisInfo.spin % 360) * (Math.PI / 180);
    }

    private updateOrbitGeometry(segments: number = 2000): BufferGeometry {
        const points: Vector3[] = [];
        const period = this.orbitalPeriod * 24 * 60 * 60 * 1000; //millisecondes
        let date: Date = this.getMainScene().getTimeController().getCurrentDate();

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
        return this.orbitLineGeometry.setFromPoints(points);
    }

    private createOrbitLine(): Line {
        const orbitGeometry = this.updateOrbitGeometry();
        return new Line(orbitGeometry, this.orbitLineMaterial);
    }

    public refreshOrbitLine(): void {
        const isVisible: boolean = this.orbitLine.visible;

        if (isVisible) {
            this.getMainScene().getScene().remove(this.orbitLine);
            this.orbitLine.geometry.dispose();
            this.orbitLine = this.createOrbitLine();
            this.getMainScene().getScene().add(this.orbitLine);
        }
    }
}