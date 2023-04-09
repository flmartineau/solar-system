import { Body } from 'astronomy-engine';
import { constants } from '../../../utils/constants';
import { Planet } from '../Planet';
import { MainScene } from '../../../scenes/MainScene';
import { ColorRepresentation, MeshPhongMaterial, Texture } from 'three';

export class Mercury extends Planet {
    
  constructor(mainScene: MainScene) {

    const NAME: string = 'Mercury';
    const TEXTUREPATH: string = './assets/textures/mercury.jpg';

    const texture: Texture = mainScene.textureLoader.load(TEXTUREPATH);
    const material = new MeshPhongMaterial({ map: texture });
    const lightColor: ColorRepresentation = 0xa29d98;

    super(NAME, constants.Mercury, material, mainScene, Body.Mercury, lightColor);
  }
}
