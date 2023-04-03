import { Body } from 'astronomy-engine';
import { constants } from '../../../utils/constants';
import { Planet } from '../Planet';
import { MainScene } from '../../../scenes/MainScene';

export class Earth extends Planet {
 
  constructor(mainScene: MainScene) {

    const NAME: string = 'Earth';
    const TEXTUREPATH: string = '../../assets/textures/earth_daymap.jpg';

    super(
      NAME,
      constants.Earth.radius,
      TEXTUREPATH,      
      constants.Earth.rotationSpeed,
      constants.Earth.mass,
      constants.Earth.temperature,
      constants.Earth.inclination,
      mainScene,
      Body.Earth
    );
  }


  getBody(): Body {
    return Body.Earth;
  }
}
