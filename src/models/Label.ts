import { CanvasTexture, PerspectiveCamera, Sprite, SpriteMaterial, Vector3 } from "three";
import { CelestialBody } from "./CelestialBody";
import { Moon } from "./Moon";
import { MainScene } from "../scenes/MainScene";

export class Label extends Sprite {

    private _celestialBody: CelestialBody;
    private _mainScene: MainScene;

    private _width: number;
    private _height: number;

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
        material.depthWrite = false;
        super(material);
        this.name = celestialBody.name + ' Label';
        this._mainScene = mainScene;
        this._celestialBody = celestialBody;

        this._width = 0.15;
        this._height = 0.0375;

        this.scale.set(this._width, this._height, 1);
        this.position.copy(celestialBody.position.clone());
    }

    get celestialBody(): CelestialBody {
        return this._celestialBody;
    }

    get mainScene(): MainScene {
        return this._mainScene;
    }

    public update(camera: PerspectiveCamera): void {
        const distanceToCamera: number = camera.position.distanceTo(this.position);

        if (this.celestialBody.instanceOf('Moon')) {
            const moonsVisibility: boolean = this.mainScene.uiController.toolbar.moonsVisibility;
            this.visible = (distanceToCamera < 300) && (this._celestialBody as Moon).planet.label.visible && moonsVisibility;
        }


        if (this.visible || this.celestialBody.instanceOf('Moon')) {
            this.scale.set(this._width * distanceToCamera, this._height * distanceToCamera, 1);
            this.position.copy(this._celestialBody.position.clone());
            this.position.y = this._celestialBody.position.y + (this._celestialBody.radius * 1.2);
            this.lookAt(camera.position);
        }
    }


}