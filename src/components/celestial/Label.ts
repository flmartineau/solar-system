import { CanvasTexture, PerspectiveCamera, Sprite, SpriteMaterial } from "three";
import { CelestialBody } from "./CelestialBody";
import { Moon } from "./Moon";
import { MainScene } from "../../scenes/MainScene";

export class Label extends Sprite {

    private _celestialBody: CelestialBody;
    private _mainScene: MainScene;

    constructor(mainScene: MainScene, celestialBody: CelestialBody) {
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
        this._mainScene = mainScene;
        this._celestialBody = celestialBody;

        this.scale.set(0.15, 0.0375, 1);
        this.position.copy(celestialBody.position.clone());
    }

    public getCelestialBody(): CelestialBody {
        return this._celestialBody;
    }

    public getMainScene(): MainScene {
        return this._mainScene;
    }

    public update(camera: PerspectiveCamera): void {

        const distanceToCamera: number = camera.position.distanceTo(this.position);

        if (this._celestialBody.name == 'Moon') {
            const moonsVisibility: boolean = this.getMainScene().getUIController().getMoonsVisibility();
            this.visible = (distanceToCamera < 300) && (this._celestialBody as Moon).getPlanet().getLabel().visible && moonsVisibility;
        }


        if (this.visible || this._celestialBody.name == 'Moon' ) {
            this.scale.set(0.15 * distanceToCamera, 0.0375 * distanceToCamera, 1);
            this.position.copy(this._celestialBody.position.clone());
            this.position.y = this._celestialBody.position.y + (this._celestialBody.getRadius() * 1.2);
            this.lookAt(camera.position);
        }
    }


}