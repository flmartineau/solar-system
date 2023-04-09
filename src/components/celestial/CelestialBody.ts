import { Mesh, SphereGeometry, Material } from 'three';
import { Label } from './Label';
import { MainScene } from '../../scenes/MainScene';
import { AxisInfo, RotationAxis, Body } from 'astronomy-engine';


export class CelestialBody extends Mesh {
    public name: string;

    private _mainScene: MainScene;
    private mass: number;
    private temperature: number;
    private radius: number;
    private label: Label;
    private _body: Body;


    constructor(mainScene: MainScene, name: string, radius: number, material: Material, 
        mass: number, temperature: number, body: Body) {

        const geometry = new SphereGeometry(radius, 128, 128);
        super(geometry, material);

        this._mainScene = mainScene;
        this._body = body;
        this.name = name;
        this.mass = mass;
        this.temperature = temperature;
        this.radius = radius;
        this.label = new Label(mainScene, this);

        this.addToMainScene();
    }

    get mainScene(): MainScene {
        return this._mainScene;
    }

    public addToMainScene(): void { 
        this.mainScene.getScene().add(this);
        this.mainScene.getScene().add(this.label);
    }
    
    public getLabel(): Label {
        return this.label;
    }

    public updateLabel(): void {
        this.label.update(this.mainScene.getCameraController().getCamera());
    }

    public getRadius(): number {
        return this.radius;
    }

    public getTemperature(): number {
        return this.temperature;
    }

    public getMass(): number {
        return this.mass;
    }

    public getBody(): Body {
        return this._body;
    }

    public updateRotation(): void {
        let axisInfo: AxisInfo = RotationAxis(this._body, this._mainScene.getTimeController().getCurrentDate());
        this.rotation.y = (axisInfo.spin % 360) * (Math.PI / 180);
    }
}