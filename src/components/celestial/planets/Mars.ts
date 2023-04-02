import { Body } from 'astronomy-engine';
import { TimeController } from '../../../controllers/TimeController';
import { constants } from '../../../utils/constants';
import { Planet } from '../Planet';

export class Mars extends Planet {
    
  constructor(timeController: TimeController) {

    const NAME: string = 'Mars';
    const TEXTUREPATH: string = '../../assets/textures/mars.jpg';

    super(
      NAME,
      constants.Mars.radius,
      TEXTUREPATH,      
      constants.Mars.rotationSpeed,
      constants.Mars.mass,
      constants.Mars.temperature,
      constants.Mars.inclination,
      timeController,
      Body.Mars
    );
  }
}
