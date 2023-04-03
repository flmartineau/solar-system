import { Body } from 'astronomy-engine';
import { constants } from '../../../utils/constants';
import { Planet } from '../Planet';
import { MainScene } from '../../../scenes/MainScene';
import { MeshPhongMaterial, TextureLoader } from 'three';

export class Saturn extends Planet {
    
  constructor(mainScene: MainScene) {

    const NAME: string = 'Saturn';
    const TEXTUREPATH: string = '../../assets/textures/saturn.jpg';

    const texture = new TextureLoader().load(TEXTUREPATH);
    const material = new MeshPhongMaterial({ map: texture });

    super(NAME, constants.Saturn, material, mainScene, Body.Saturn);
  }
}
