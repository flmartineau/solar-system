import { MeshBasicMaterial, TextureLoader } from 'three';
import { MainScene } from '../../scenes/MainScene';
import { PlanetConfig, SIZE_FACTOR } from '../../utils/constants';
import { CelestialBody } from './CelestialBody';



export class Star extends CelestialBody {

    public mainScene: MainScene;

    constructor(mainScene: MainScene, name: string, constants: PlanetConfig, texturePath: string) {

            const texture = new TextureLoader().load(texturePath);
            const material = new MeshBasicMaterial({ map: texture });


            super(mainScene, name, constants.radius * SIZE_FACTOR, material, 
                constants.rotationSpeed, constants.mass, constants.temperature);
            this.mainScene = mainScene;

        }

}