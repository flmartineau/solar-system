import { CanvasTexture, PerspectiveCamera, Sprite, SpriteMaterial } from "three";
import { CelestialBody } from "./CelestialBody";
import { SIZE_FACTOR } from "../../utils/constants";

export class Label extends Sprite {

    private celestialBody: CelestialBody;

    constructor(celestialBody: CelestialBody) {

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 72;
        if (context) {
          context.font = '48px Arial';
          context.textAlign = 'center';
          context.fillStyle = 'white';
          context.fillText(celestialBody.name.toUpperCase(), canvas.width / 2, canvas.height / 2);
        }
      
        const texture = new CanvasTexture(canvas);
        const material = new SpriteMaterial({ map: texture, transparent: true });
        super(material);
 
        this.celestialBody = celestialBody;

        this.scale.set(0.15, 0.0375, 1);
        this.position.copy(celestialBody.position.clone());
    }

    getCelestialBody(): CelestialBody {
        return this.celestialBody;
    }


    update(camera: PerspectiveCamera): void {
        const distanceToCamera: number = camera.position.distanceTo(this.position);
        this.visible = distanceToCamera > (this.celestialBody.radius * 2);

        if (this.visible) {
            this.scale.set(0.15 * distanceToCamera, 0.0375 * distanceToCamera, 1);
            this.position.copy(this.celestialBody.position.clone());
            this.position.y = this.celestialBody.position.y + (this.celestialBody.radius * 1.2);
            this.lookAt(camera.position);
        }
    }

    
}