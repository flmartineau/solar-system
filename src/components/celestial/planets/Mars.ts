import { Body } from 'astronomy-engine';
import { constants } from '../../../utils/constants';
import { Planet } from '../Planet';
import { MainScene } from '../../../scenes/MainScene';

export class Mars extends Planet {
    
  constructor(mainScene: MainScene) {

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
      mainScene,
      Body.Mars
    );
  }
}
