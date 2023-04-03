import { Body } from 'astronomy-engine';
import { constants } from '../../../utils/constants';
import { Planet } from '../Planet';
import { MainScene } from '../../../scenes/MainScene';

export class Venus extends Planet {

  constructor(mainScene: MainScene) {
    
    const TEXTUREPATH: string = '../../assets/textures/venus.jpg';

    super(
      'Venus',
      constants.Venus.radius,
      TEXTUREPATH,      
      constants.Venus.rotationSpeed,
      constants.Venus.mass,
      constants.Venus.temperature,
      constants.Venus.inclination,
      mainScene,
      Body.Venus
    );
  }
}
