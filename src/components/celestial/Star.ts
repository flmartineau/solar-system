import { MeshBasicMaterial, PointLight } from 'three';
import { MainScene } from '../../scenes/MainScene';
import { SIZE_FACTOR, SunConfig } from '../../utils/constants';
import { CelestialBody } from './CelestialBody';
import { Body } from 'astronomy-engine';
import {Lensflare, LensflareElement} from "three/examples/jsm/objects/Lensflare";



export class Star extends CelestialBody {

    public pointLight = new PointLight(0xffffff, 1, 1000);


    constructor(mainScene: MainScene, name: string, constants: SunConfig, texturePath: string) {
            const texture = mainScene.getTextureLoader().load(texturePath);
            const material = new MeshBasicMaterial({ map: texture });
            super(mainScene, name, constants.radius * SIZE_FACTOR, material, constants.mass, constants.temperature, Body.Sun);
        
            this.setupLighting();
        }


        private setupLighting(): void {
            this.pointLight = new PointLight(0xffffff, 1, 0);
            this.pointLight.position.set(0, 0, 0);
            const textureFlare0 = this.mainScene.getTextureLoader().load('./assets/textures/lensflare/lensflare.png');
            
            const lensflare = new Lensflare();
            lensflare.renderOrder = 1;
            lensflare.addElement(new LensflareElement(textureFlare0, 200, 0, this.pointLight.color));
            this.pointLight.add(lensflare);
            this.mainScene.getScene().add(this.pointLight);
          }


        public hideFlare(): void {
            this.pointLight.visible = false;
        }

}