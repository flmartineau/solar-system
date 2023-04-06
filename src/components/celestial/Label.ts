import { CanvasTexture, PerspectiveCamera, Sprite, SpriteMaterial } from "three";
import { CelestialBody } from "./CelestialBody";

export class Label extends Sprite {

    private celestialBody: CelestialBody;

    constructor(celestialBody: CelestialBody) {

        const canvas: HTMLCanvasElement = document.createElement('canvas');
        const context: CanvasRenderingContext2D | null = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 72;
        if (context) {
            context.font = 'bold 48px Roboto, sans-serif';
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

    public getCelestialBody(): CelestialBody {
        return this.celestialBody;
    }

    public update(camera: PerspectiveCamera): void {
        if (this.visible) {
            const distanceToCamera: number = camera.position.distanceTo(this.position);

            this.scale.set(0.15 * distanceToCamera, 0.0375 * distanceToCamera, 1);
            this.position.copy(this.celestialBody.position.clone());
            this.position.y = this.celestialBody.position.y + (this.celestialBody.getRadius() * 1.2);
            this.lookAt(camera.position);
        }
    }


}