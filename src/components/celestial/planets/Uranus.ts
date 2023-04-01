import { constants } from '../../../utils/constants';
import { Planet } from '../Planet';

export class Uranus extends Planet {
    
  constructor() {

    const NAME: string = 'Uranus';
    const TEXTUREPATH: string = '../../assets/textures/uranus.jpg';


    super(
      'Uranus',
      constants.Uranus.radius,
      TEXTUREPATH,      
      constants.Uranus.rotationSpeed,
      constants.Uranus.mass,
      constants.Uranus.temperature,
      0,
      constants.Uranus.distanceToSun,
      constants.Uranus.orbitalSpeed,
      constants.Uranus.inclination
    );
  }
}
