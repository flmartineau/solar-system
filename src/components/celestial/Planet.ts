import { AxisInfo, Body, HelioDistance, HelioVector, KM_PER_AU, PlanetOrbitalPeriod, RotationAxis } from 'astronomy-engine';
import { CelestialBody } from './CelestialBody';
import * as THREE from 'three';
import { PlanetConfig, SIZE_FACTOR } from '../../utils/constants';
import { MainScene } from '../../scenes/MainScene';
import { Material, MeshPhongMaterial, TextureLoader } from 'three';
import { Earth } from './planets/Earth';



export class Planet extends CelestialBody {

    public distanceToSun: number;
    private orbitLine: THREE.Line;
    public mainScene: MainScene
    private body: Body;

    constructor(
        name: string,
        constants: PlanetConfig,
        material: Material,
        mainScene: MainScene,
        body: Body) {

        super(mainScene,name, constants.radius * SIZE_FACTOR, material, constants.rotationSpeed, constants.mass, constants.temperature);
        this.distanceToSun = 0;
        this.body = body;
        this.mainScene = mainScene;
        this.orbitLine = this.createOrbitLine();

        this.mainScene.scene.add(this.orbitLine);

    }

    updateOrbit(): void {
        this.distanceToSun = Math.round(HelioDistance(this.body, this.mainScene.timeController.getCurrentDate())* KM_PER_AU);
        let v = HelioVector(this.body, this.mainScene.timeController.getCurrentDate());
        let x = v.x * SIZE_FACTOR;
        let y = v.y * SIZE_FACTOR;
        let z = v.z * SIZE_FACTOR;

        let vector = new THREE.Vector3(x, y, z);

        vector.applyAxisAngle(new THREE.Vector3(1, 0, 0), -110 * Math.PI / 180);

        this.position.set(vector.x, vector.y, vector.z);
    }

    updateRotation(): void {
        let axisInfo: AxisInfo = RotationAxis(this.body, this.mainScene.timeController.getCurrentDate());
        this.rotation.y = (axisInfo.spin % 360) * (Math.PI / 180);
    }


    private createOrbitGeometry(segments: number = 1000): THREE.BufferGeometry {
        const points: THREE.Vector3[] = [];
        let period = PlanetOrbitalPeriod(this.body) * 24 * 60 * 60 * 1000; //millisecondes
        let date = this.mainScene.timeController.getCurrentDate();

        for (let i = 0; i <= segments; i++) {
            let v = HelioVector(this.body, date);
            let v3 = new THREE.Vector3(v.x * SIZE_FACTOR, v.y * SIZE_FACTOR, v.z * SIZE_FACTOR);
            v3.applyAxisAngle(new THREE.Vector3(1, 0, 0), -110 * Math.PI / 180);
            points.push(v3);
            date = new Date(date.getTime() + (period / segments));
        }

        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        return geometry;
    }

    createOrbitLine(): THREE.Line {
        const orbitGeometry = this.createOrbitGeometry();
        const orbitMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
        const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);
        return orbitLine;
    }

    refreshOrbitLine(): THREE.Line {
        this.orbitLine = this.createOrbitLine();
        return this.orbitLine;
    }

    getOrbitLine(): THREE.Line {
        return this.orbitLine;
    }

}