import { MeshBasicMaterial, PointLight } from 'three';
import { MainScene } from '../scenes/MainScene';
import { SIZE_FACTOR } from '../utils/constants';
import { CelestialBody } from './CelestialBody';
import { AxisInfo, Body, KM_PER_AU, RotationAxis } from 'astronomy-engine';
import { Lensflare, LensflareElement} from "three/examples/jsm/objects/Lensflare";
import { ISun } from '../interfaces/ISolarSystem';



export class Sun extends CelestialBody {

    private _pointLight = new PointLight(0xffffff, 1, 0);


    constructor(data: ISun, mainScene: MainScene) {
            const texture = mainScene.textureLoader.load(data.textures.base);
            const material = new MeshBasicMaterial({ map: texture });
            super(mainScene, data, (data.radius / KM_PER_AU) * SIZE_FACTOR, material);
        
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

        public update(): void {
            super.update();
            if (this.visible)
                this.updateRotation();
        }
    
        public updateRotation(): void {
            let axisInfo: AxisInfo = RotationAxis(Body.Sun, this.mainScene.timeController.currentDate);
            this.rotation.y = (axisInfo.spin % 360) * (Math.PI / 180);
        }

}