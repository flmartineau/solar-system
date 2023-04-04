import { MeshBasicMaterial, TextureLoader } from 'three';
import { MainScene } from '../../scenes/MainScene';
import { SIZE_FACTOR, SunConfig } from '../../utils/constants';
import { CelestialBody } from './CelestialBody';



export class Star extends CelestialBody {

    public mainScene: MainScene;

    constructor(mainScene: MainScene, name: string, constants: SunConfig, texturePath: string) {

            const texture = new TextureLoader().load(texturePath);
            const material = new MeshBasicMaterial({ map: texture });


            super(mainScene, name, constants.radius * SIZE_FACTOR, material, constants.mass, constants.temperature, constants.rotationSpeed);
            this.mainScene = mainScene;

        }

}