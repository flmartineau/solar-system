import { Body, HelioDistance, HelioVector, PlanetOrbitalPeriod, Vector } from 'astronomy-engine';
import { CelestialBody } from './CelestialBody';
import * as THREE from 'three';
import { TimeController } from '../../controllers/TimeController';



export class Planet extends CelestialBody {

    public distanceToSun: number;
    public inclination: number;
    private orbitLine: THREE.Line;
    private timeController: TimeController
    private body: Body;


    constructor(
        name: string,
        radius: number,
        texturePath: string,
        rotationSpeed: number,
        mass: number,
        temperature: number,
        elapsedTime: number,
        distanceToSun: number,
        orbitSpeed: number,
        inclination: number,
        timeController: TimeController,
        body: Body) {
        super(name, radius * 20, texturePath, rotationSpeed, mass, temperature, elapsedTime);
        this.distanceToSun = distanceToSun;
        this.inclination = inclination;
        this.body = body;
        this.orbitLine = this.createOrbitLine();
        this.timeController = timeController;

    }

    updateOrbit(deltaTime: number, simulationSpeed: number): void {
        this.elapsedTime += deltaTime * simulationSpeed;
        let v = HelioVector(this.body, this.timeController.getCurrentDate());
        let x = v.x * 10;
        let y = v.y * 10;
        let z = v.z * 10;

        let vector = new THREE.Vector3(x, y, z);

        vector.applyAxisAngle(new THREE.Vector3(1, 0, 0), -110 * Math.PI / 180);


        if (this.name == "Mercury") {
            console.log("x: " + x + " y: " + y + " z: " + z);
        }
        this.position.set(vector.x, vector.y, vector.z);
    }


    private createOrbitGeometry(segments: number = 1000): THREE.BufferGeometry {
        const points: THREE.Vector3[] = [];
        let period = PlanetOrbitalPeriod(this.body) * 24 * 60 * 60 * 1000; //millisecondes
        let date = new Date();

        for (let i = 0; i <= segments; i++) {

            let v = HelioVector(this.body, date);
            let v3 = new THREE.Vector3(v.x * 10, v.y * 10, v.z * 10);
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

    getOrbitLine(): THREE.Line {
        return this.orbitLine;
    }

}