import { CelestialBody } from './CelestialBody';



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
            super(name, radius, texturePath, rotationSpeed, mass, temperature, elapsedTime);
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

}