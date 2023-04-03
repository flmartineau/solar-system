import { Star } from './Star';
import { constants } from '../../utils/constants';
import { MainScene } from '../../scenes/MainScene';

export class Sun extends Star {

  constructor(mainScene: MainScene) {

    super(mainScene, 'Sun', constants.Sun.radius, '../../assets/textures/sun.jpg', 
    constants.Sun.rotationSpeed, constants.Sun.mass, constants.Sun.temperature);
  }



}
