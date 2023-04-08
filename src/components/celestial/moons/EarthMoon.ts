import { Body } from 'astronomy-engine';
import { constants } from '../../../utils/constants';
import { MainScene } from '../../../scenes/MainScene';
import { MeshPhongMaterial, Texture } from 'three';
import { Moon } from '../Moon';
import { Planet } from '../Planet';

export class EarthMoon extends Moon {
    
  constructor(mainScene: MainScene, planet: Planet) {

    const NAME: string = 'Moon';
    const TEXTUREPATH: string = './assets/textures/moon.jpg';
    
    const texture: Texture = mainScene.getTextureLoader().load(TEXTUREPATH);
    const material = new MeshPhongMaterial({ map: texture });
    
    super(NAME, constants.Moon, material, mainScene, Body.Moon, planet);

  }
}
