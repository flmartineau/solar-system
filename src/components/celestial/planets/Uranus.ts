import { Body } from 'astronomy-engine';
import { constants } from '../../../utils/constants';
import { Planet } from '../Planet';
import { MainScene } from '../../../scenes/MainScene';

export class Uranus extends Planet {
    
  constructor(mainScene: MainScene) {

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
      mainScene,
      Body.Uranus
    );
  }
}
