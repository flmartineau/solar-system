import { Star } from './Star';
import { constants } from '../../utils/constants';

export class Sun extends Star {

  constructor() {

    super('Sun', constants.Sun.radius, '../../assets/textures/sun.jpg', 
    constants.Sun.rotationSpeed, constants.Sun.mass, constants.Sun.temperature);
  }



}
