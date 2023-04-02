import { Body } from 'astronomy-engine';
import { TimeController } from '../../../controllers/TimeController';
import { constants } from '../../../utils/constants';
import { Planet } from '../Planet';

export class Earth extends Planet {
 
  constructor(timeController: TimeController) {

    const NAME: string = 'Earth';
    const TEXTUREPATH: string = '../../assets/textures/earth_daymap.jpg';

    super(
      NAME,
      constants.Earth.radius,
      TEXTUREPATH,      
      constants.Earth.rotationSpeed,
      constants.Earth.mass,
      constants.Earth.temperature,
      constants.Earth.inclination,
      timeController,
      Body.Earth
    );
  }


  getBody(): Body {
    return Body.Earth;
  }
}
