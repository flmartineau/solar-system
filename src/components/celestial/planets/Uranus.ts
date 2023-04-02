import { Body } from 'astronomy-engine';
import { TimeController } from '../../../controllers/TimeController';
import { constants } from '../../../utils/constants';
import { Planet } from '../Planet';

export class Uranus extends Planet {
    
  constructor(timeController: TimeController) {

    const NAME: string = 'Uranus';
    const TEXTUREPATH: string = '../../assets/textures/uranus.jpg';


    super(
      'Uranus',
      constants.Uranus.radius,
      TEXTUREPATH,      
      constants.Uranus.rotationSpeed,
      constants.Uranus.mass,
      constants.Uranus.temperature,
      constants.Uranus.inclination,
      timeController,
      Body.Uranus
    );
  }
}
