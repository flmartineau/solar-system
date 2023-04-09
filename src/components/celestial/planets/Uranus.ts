import { Body } from 'astronomy-engine';
import { constants } from '../../../utils/constants';
import { Planet } from '../Planet';
import { MainScene } from '../../../scenes/MainScene';
import { ColorRepresentation, MeshPhongMaterial, Texture } from 'three';

export class Uranus extends Planet {
    
  constructor(mainScene: MainScene) {

    const NAME: string = 'Uranus';
    const TEXTUREPATH: string = './assets/textures/uranus.jpg';

    const texture: Texture = mainScene.textureLoader.load(TEXTUREPATH);
    const material = new MeshPhongMaterial({ map: texture });
    const lightColor: ColorRepresentation = 0x89d0e0;


    super(NAME, constants.Uranus, material, mainScene, Body.Uranus, lightColor);
  }
}
