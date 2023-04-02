import { Body } from 'astronomy-engine';
import { TimeController } from '../../../controllers/TimeController';
import { constants } from '../../../utils/constants';
import { Planet } from '../Planet';

export class Saturn extends Planet {
    
  constructor(timeController: TimeController) {

    const NAME: string = 'Saturn';
    const TEXTUREPATH: string = '../../assets/textures/saturn.jpg';


    super(
      'Saturn',
      constants.Saturn.radius,
      TEXTUREPATH,      
      constants.Saturn.rotationSpeed,
      constants.Saturn.mass,
      constants.Saturn.temperature,
      0,
      constants.Saturn.distanceToSun,
      constants.Saturn.orbitalSpeed,
      constants.Saturn.inclination,
      timeController,
      Body.Saturn
    );
  }
}
