import { Body } from 'astronomy-engine';
import { constants } from '../../../utils/constants';
import { Planet } from '../Planet';
import { MainScene } from '../../../scenes/MainScene';

export class Mercury extends Planet {
    
  constructor(mainScene: MainScene) {

    const NAME: string = 'Mercury';
    const TEXTUREPATH: string = '../../assets/textures/mercury.jpg';


    super(
      'Mercury',
      constants.Mercury.radius,
      TEXTUREPATH,      
      constants.Mercury.rotationSpeed,
      constants.Mercury.mass,
      constants.Mercury.temperature,
      constants.Mercury.inclination,
      mainScene,
      Body.Mercury
    );
  }
}
