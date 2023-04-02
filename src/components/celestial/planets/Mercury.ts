import { Body } from 'astronomy-engine';
import { TimeController } from '../../../controllers/TimeController';
import { constants } from '../../../utils/constants';
import { Planet } from '../Planet';

export class Mercury extends Planet {
    
  constructor(timeController: TimeController) {

    const NAME: string = 'Mercury';
    const TEXTUREPATH: string = '../../assets/textures/mercury.jpg';


    super(
      'Mercury',
      constants.Mercury.radius,
      TEXTUREPATH,      
      constants.Mercury.rotationSpeed,
      constants.Mercury.mass,
      constants.Mercury.temperature,
      0,
      constants.Mercury.distanceToSun,
      constants.Mercury.orbitalSpeed,
      constants.Mercury.inclination,
      timeController,
      Body.Mercury
    );
  }
}
