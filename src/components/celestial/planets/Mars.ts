import { Body } from 'astronomy-engine';
import { constants } from '../../../utils/constants';
import { Planet } from '../Planet';
import { MainScene } from '../../../scenes/MainScene';
import { MeshPhongMaterial, Texture } from 'three';

export class Mars extends Planet {
    
  constructor(mainScene: MainScene) {

    const NAME: string = 'Mars';
    const TEXTUREPATH: string = './assets/textures/mars.jpg';
    
    const texture: Texture = mainScene.getTextureLoader().load(TEXTUREPATH);
    const material = new MeshPhongMaterial({ map: texture });
    
    super(NAME, constants.Mars, material, mainScene, Body.Mars);
  }
}
