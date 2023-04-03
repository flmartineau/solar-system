import { Body } from 'astronomy-engine';
import { constants } from '../../../utils/constants';
import { Planet } from '../Planet';
import { MainScene } from '../../../scenes/MainScene';
import { MeshPhongMaterial, TextureLoader } from 'three';

export class Mercury extends Planet {
    
  constructor(mainScene: MainScene) {

    const NAME: string = 'Mercury';
    const TEXTUREPATH: string = '../../assets/textures/mercury.jpg';

    const texture = new TextureLoader().load(TEXTUREPATH);
    const material = new MeshPhongMaterial({ map: texture });

    super(NAME, constants.Mercury, material, mainScene, Body.Mercury);
  }
}
