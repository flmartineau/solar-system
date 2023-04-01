import { CelestialBody } from './CelestialBody';
import * as THREE from 'three';



export class Planet extends CelestialBody {

    public distanceToSun: number;
    public orbitSpeed: number;
    public inclination: number;


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
        inclination: number) {
        super(name, radius * 50, texturePath, rotationSpeed, mass, temperature, elapsedTime);
        this.distanceToSun = distanceToSun;
        this.orbitSpeed = orbitSpeed;
        this.inclination = inclination;
    }

    updateOrbit(deltaTime: number): void {
        this.elapsedTime += deltaTime;
        const angle = this.elapsedTime * this.orbitSpeed;

        // Calculate the elliptical orbit
        const a = this.distanceToSun;
        const b = this.distanceToSun * 0.9; // Example eccentricity factor
        const x = a * Math.cos(angle);
        const z = b * Math.sin(angle);
        const y = z * Math.tan(this.inclination);

        this.position.set(x, y, z);
    }

    private createOrbitGeometry(segments: number = 100): THREE.BufferGeometry {
        const points: THREE.Vector3[] = [];
        for (let i = 0; i <= segments; i++) {
            const theta = (i / segments) * Math.PI * 2;
            const x = this.distanceToSun * Math.cos(theta);
            const y = this.distanceToSun * Math.sin(theta) * Math.sin(this.inclination);
            const z = this.distanceToSun * Math.sin(theta) * Math.cos(this.inclination);
            points.push(new THREE.Vector3(x, y, z));
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

}