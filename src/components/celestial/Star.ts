import { MeshBasicMaterial, PointLight } from 'three';
import { MainScene } from '../../scenes/MainScene';
import { SIZE_FACTOR, SunConfig } from '../../utils/constants';
import { CelestialBody } from './CelestialBody';
import { Body } from 'astronomy-engine';
import {Lensflare, LensflareElement} from "three/examples/jsm/objects/Lensflare";



export class Star extends CelestialBody {

    private _pointLight = new PointLight(0xffffff, 1, 0);


    constructor(mainScene: MainScene, name: string, constants: SunConfig, texturePath: string) {
            const texture = mainScene.textureLoader.load(texturePath);
            const material = new MeshBasicMaterial({ map: texture });
            super(mainScene, name, constants.radius * SIZE_FACTOR, material, constants.mass, constants.temperature, Body.Sun);
        
            this.setupLighting();
        }


        private setupLighting(): void {
            this._pointLight.position.set(0, 0, 0);
            const textureFlare0 = this.mainScene.textureLoader.load('./assets/textures/lensflare/lensflare.png');
            
            const lensflare = new Lensflare();
            lensflare.renderOrder = 1;
            lensflare.addElement(new LensflareElement(textureFlare0, 200, 0, this._pointLight.color));
            this._pointLight.add(lensflare);
            this.mainScene.scene.add(this._pointLight);
          }


        public hideFlare(): void {
            this._pointLight.visible = false;
        }

}