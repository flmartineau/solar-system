import { Body } from 'astronomy-engine';
import { constants } from '../../../utils/constants';
import { Planet } from '../Planet';
import { MainScene } from '../../../scenes/MainScene';

export class Saturn extends Planet {
    
  constructor(mainScene: MainScene) {

    const NAME: string = 'Saturn';
    const TEXTUREPATH: string = '../../assets/textures/saturn.jpg';


    super(
      'Saturn',
      constants.Saturn.radius,
      TEXTUREPATH,      
      constants.Saturn.rotationSpeed,
      constants.Saturn.mass,
      constants.Saturn.temperature,
      constants.Saturn.inclination,
      mainScene,
      Body.Saturn
    );
  }
}
