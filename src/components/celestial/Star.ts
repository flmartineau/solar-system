import { Mesh, MeshPhongMaterial, SphereGeometry, TextureLoader } from 'three';
import { CelestialBody } from './CelestialBody';



export class Star extends CelestialBody {

    constructor(name: string, radius: number, texturePath: string, 
        rotationSpeed: number, mass: number, temperature: number, elapsedTime: number) {
            super(name, radius, texturePath, rotationSpeed, mass, temperature, elapsedTime);
        
        
        }

}