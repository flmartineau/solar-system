import { Body } from 'astronomy-engine';
import { constants } from '../../../utils/constants';
import { Planet } from '../Planet';
import { MainScene } from '../../../scenes/MainScene';
import { MeshPhongMaterial, Texture } from 'three';

export class Neptune extends Planet {
    
  constructor(mainScene: MainScene) {

    const NAME: string = 'Neptune';
    const TEXTUREPATH: string = './assets/textures/neptune.jpg';

    const texture: Texture = mainScene.getTextureLoader().load(TEXTUREPATH);
    const material = new MeshPhongMaterial({ map: texture });

    super(NAME, constants.Neptune, material, mainScene, Body.Neptune);
  }
}
