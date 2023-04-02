import { CanvasTexture, PerspectiveCamera, Sprite, SpriteMaterial } from "three";
import { CelestialBody } from "./CelestialBody";

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
          context.fillText(celestialBody.name, canvas.width / 2, canvas.height / 2);
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
        
         // Mettre à jour la position et la taille du label en fonction de la position de la caméra
        const cameraPosition = camera.position;

        const scale = cameraPosition.distanceTo(this.celestialBody.position) * 1;
        this.scale.set(0.15 * scale, 0.0375 * scale, 1);

        this.position.y = this.celestialBody.position.y;

        this.position.copy(this.celestialBody.position.clone());
        this.position.y = this.celestialBody.position.y + this.celestialBody.radius + 0.1;
        this.lookAt(cameraPosition);
        
    }

    
}