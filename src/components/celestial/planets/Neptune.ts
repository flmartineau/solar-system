import { constants } from '../../../utils/constants';
import { Planet } from '../Planet';

export class Neptune extends Planet {
    
  constructor() {

    const NAME: string = 'Neptune';
    const TEXTUREPATH: string = '../../assets/textures/neptune.jpg';


    super(
      'Neptune',
      constants.Neptune.radius,
      TEXTUREPATH,      
      constants.Neptune.rotationSpeed,
      constants.Neptune.mass,
      constants.Neptune.temperature,
      0,
      constants.Neptune.distanceToSun,
      constants.Neptune.orbitalSpeed,
      constants.Neptune.inclination
    );
  }
}
