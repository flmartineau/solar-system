import { Body } from 'astronomy-engine';
import { constants } from '../../../utils/constants';
import { Planet } from '../Planet';
import { MainScene } from '../../../scenes/MainScene';

export class Neptune extends Planet {
    
  constructor(mainScene: MainScene) {

    const NAME: string = 'Neptune';
    const TEXTUREPATH: string = '../../assets/textures/neptune.jpg';


    super(
      'Neptune',
      constants.Neptune.radius,
      TEXTUREPATH,      
      constants.Neptune.rotationSpeed,
      constants.Neptune.mass,
      constants.Neptune.temperature,
      constants.Neptune.inclination,
      mainScene,
      Body.Neptune
    );
  }
}
