import { Body } from 'astronomy-engine';
import { TimeController } from '../../../controllers/TimeController';
import { constants } from '../../../utils/constants';
import { Planet } from '../Planet';

export class Jupiter extends Planet {
    
  constructor(timeController: TimeController) {

    const NAME: string = 'Jupiter';
    const TEXTUREPATH: string = '../../assets/textures/jupiter.jpg';

    super(
      NAME,
      constants.Jupiter.radius,
      TEXTUREPATH,      
      constants.Jupiter.rotationSpeed,
      constants.Jupiter.mass,
      constants.Jupiter.temperature,
      0,
      constants.Jupiter.distanceToSun,
      constants.Jupiter.orbitalSpeed,
      constants.Jupiter.inclination,
      timeController,
      Body.Jupiter
    );
  }
}
