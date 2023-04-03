import { Body } from 'astronomy-engine';
import { constants } from '../../../utils/constants';
import { Planet } from '../Planet';
import { MainScene } from '../../../scenes/MainScene';
import { MeshPhongMaterial, TextureLoader } from 'three';

export class Uranus extends Planet {
    
  constructor(mainScene: MainScene) {

    const NAME: string = 'Uranus';
    const TEXTUREPATH: string = '../../assets/textures/uranus.jpg';

    const texture = new TextureLoader().load(TEXTUREPATH);
    const material = new MeshPhongMaterial({ map: texture });

    super(NAME, constants.Uranus, material, mainScene, Body.Uranus);
  }
}
