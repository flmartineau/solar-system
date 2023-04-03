import { MeshBasicMaterial, TextureLoader } from 'three';
import { MainScene } from '../../scenes/MainScene';
import { SIZE_FACTOR } from '../../utils/constants';
import { CelestialBody } from './CelestialBody';



export class Star extends CelestialBody {

    public mainScene: MainScene;

    constructor(mainScene: MainScene, name: string, radius: number, texturePath: string, 
        rotationSpeed: number, mass: number, temperature: number) {

            const texture = new TextureLoader().load(texturePath);
            const material = new MeshBasicMaterial({ map: texture });


            super(mainScene, name, radius * SIZE_FACTOR, material, rotationSpeed, mass, temperature);
            this.mainScene = mainScene;

        }

}