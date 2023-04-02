import { constants } from '../../../utils/constants';
import { Planet } from '../Planet';

export class Venus extends Planet {

  constructor() {
    
    const TEXTUREPATH: string = '../../assets/textures/venus.jpg';

    super(
      'Venus',
      constants.Venus.radius,
      TEXTUREPATH,      
      constants.Venus.rotationSpeed,
      constants.Venus.mass,
      constants.Venus.temperature,
      0,
      constants.Venus.distanceToSun,
      constants.Venus.orbitalSpeed,
      constants.Venus.inclination
    );
  }
}
