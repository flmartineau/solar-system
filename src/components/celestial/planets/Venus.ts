import { Body } from 'astronomy-engine';
import { constants } from '../../../utils/constants';
import { Planet } from '../Planet';
import { MainScene } from '../../../scenes/MainScene';
import { ColorRepresentation, MeshPhongMaterial, Texture } from 'three';

export class Venus extends Planet {

  constructor(mainScene: MainScene) {
    
    const NAME: string = 'Venus';
    const TEXTUREPATH: string = './assets/textures/venus.jpg';

    const texture: Texture = mainScene.textureLoader.load(TEXTUREPATH);
    const material = new MeshPhongMaterial({ map: texture });
    const lightColor: ColorRepresentation = 0xd1c0a0;


    super(NAME, constants.Venus, material, mainScene, Body.Venus, lightColor);
  }
}
