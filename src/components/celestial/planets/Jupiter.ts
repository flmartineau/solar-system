import { Body } from 'astronomy-engine';
import { constants } from '../../../utils/constants';
import { Planet } from '../Planet';
import { MainScene } from '../../../scenes/MainScene';
import { ColorRepresentation, MeshPhongMaterial, Texture, TextureLoader } from 'three';

export class Jupiter extends Planet {
    
  constructor(mainScene: MainScene) {

    const NAME: string = 'Jupiter';
    const TEXTUREPATH: string = './assets/textures/jupiter.jpg';

    const texture: Texture = mainScene.textureLoader.load(TEXTUREPATH);
    const material = new MeshPhongMaterial({ map: texture });
    const lightColor: ColorRepresentation = 0xd8a76d;

    super(NAME, constants.Jupiter, material, mainScene, Body.Jupiter, lightColor);
  }
}
