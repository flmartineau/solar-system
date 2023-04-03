import { SIZE_FACTOR } from '../../utils/constants';
import { CelestialBody } from './CelestialBody';



export class Star extends CelestialBody {

    constructor(name: string, radius: number, texturePath: string, 
        rotationSpeed: number, mass: number, temperature: number) {
            super(name, radius * SIZE_FACTOR, texturePath, rotationSpeed, mass, temperature);
        }

}