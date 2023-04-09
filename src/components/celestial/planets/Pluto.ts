import { Body } from 'astronomy-engine';
import { constants } from '../../../utils/constants';
import { Planet } from '../Planet';
import { MainScene } from '../../../scenes/MainScene';
import { MeshPhongMaterial, Texture } from 'three';

export class Pluto extends Planet {
    
  constructor(mainScene: MainScene) {

    const NAME: string = 'Pluto';
    const TEXTUREPATH: string = './assets/textures/pluto.jpg';

    const texture: Texture = mainScene.textureLoader.load(TEXTUREPATH);
    const material = new MeshPhongMaterial({ map: texture });

    super(NAME, constants.Pluto, material, mainScene, Body.Pluto);
  }
}
