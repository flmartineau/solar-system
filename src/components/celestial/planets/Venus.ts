import { Body } from 'astronomy-engine';
import { constants } from '../../../utils/constants';
import { Planet } from '../Planet';
import { MainScene } from '../../../scenes/MainScene';
import { MeshPhongMaterial, TextureLoader } from 'three';

export class Venus extends Planet {

  constructor(mainScene: MainScene) {
    
    const NAME: string = 'Venus';
    const TEXTUREPATH: string = './assets/textures/venus.jpg';

    const texture = new TextureLoader().load(TEXTUREPATH);
    const material = new MeshPhongMaterial({ map: texture });

    super(NAME, constants.Venus, material, mainScene, Body.Venus);
  }
}
