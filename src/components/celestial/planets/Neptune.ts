import { Body } from 'astronomy-engine';
import { constants } from '../../../utils/constants';
import { Planet } from '../Planet';
import { MainScene } from '../../../scenes/MainScene';
import { ColorRepresentation, MeshPhongMaterial, Texture } from 'three';

export class Neptune extends Planet {
    
  constructor(mainScene: MainScene) {

    const NAME: string = 'Neptune';
    const TEXTUREPATH: string = './assets/textures/neptune.jpg';

    const texture: Texture = mainScene.textureLoader.load(TEXTUREPATH);
    const material = new MeshPhongMaterial({ map: texture });
    const lightColor: ColorRepresentation = 0x2f6cba;

    super(NAME, constants.Neptune, material, mainScene, Body.Neptune, lightColor);
  }
}
