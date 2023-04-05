import { Body } from 'astronomy-engine';
import { constants } from '../../../utils/constants';
import { Planet } from '../Planet';
import { MainScene } from '../../../scenes/MainScene';
import { MeshPhongMaterial, TextureLoader } from 'three';

export class Jupiter extends Planet {
    
  constructor(mainScene: MainScene) {

    const NAME: string = 'Jupiter';
    const TEXTUREPATH: string = './assets/textures/jupiter.jpg';

    const texture = new TextureLoader().load(TEXTUREPATH);
    const material = new MeshPhongMaterial({ map: texture });

    super(NAME, constants.Jupiter, material, mainScene, Body.Jupiter);
  }
}
