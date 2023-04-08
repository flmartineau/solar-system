import { MeshBasicMaterial } from 'three';
import { MainScene } from '../../scenes/MainScene';
import { SIZE_FACTOR, SunConfig } from '../../utils/constants';
import { CelestialBody } from './CelestialBody';
import { Body } from 'astronomy-engine';


export class Star extends CelestialBody {

    constructor(mainScene: MainScene, name: string, constants: SunConfig, texturePath: string) {
            const texture = mainScene.getTextureLoader().load(texturePath);
            const material = new MeshBasicMaterial({ map: texture });
            super(mainScene, name, constants.radius * SIZE_FACTOR, material, constants.mass, constants.temperature, Body.Sun);
        }

}