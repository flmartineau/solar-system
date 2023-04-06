import { Star } from './Star';
import { constants } from '../../utils/constants';
import { MainScene } from '../../scenes/MainScene';

export class Sun extends Star {

  constructor(mainScene: MainScene) {

    const NAME: string = 'Sun';
    const TEXTUREPATH: string = './assets/textures/sun.jpg';

    super(mainScene, NAME, constants.Sun, TEXTUREPATH);
  }

}
