import { Body } from 'astronomy-engine';
import { constants } from '../../../utils/constants';
import { Planet } from '../Planet';
import { MainScene } from '../../../scenes/MainScene';

export class Jupiter extends Planet {
    
  constructor(mainScene: MainScene) {

    const NAME: string = 'Jupiter';
    const TEXTUREPATH: string = '../../assets/textures/jupiter.jpg';

    super(
      NAME,
      constants.Jupiter.radius,
      TEXTUREPATH,      
      constants.Jupiter.rotationSpeed,
      constants.Jupiter.mass,
      constants.Jupiter.temperature,
      constants.Jupiter.inclination,
      mainScene,
      Body.Jupiter
    );
  }
}
