import { Mesh, SphereGeometry, Material } from 'three';
import { Label } from './Label';
import { MainScene } from '../../scenes/MainScene';
import { AxisInfo, RotationAxis, Body } from 'astronomy-engine';


export class CelestialBody extends Mesh {
    public name: string;

    private _mainScene: MainScene;
    private _mass: number;
    private _temperature: number;
    private _radius: number;
    private _label: Label;
    private _body: Body;


    constructor(mainScene: MainScene, name: string, radius: number, material: Material, 
        mass: number, temperature: number, body: Body) {

        const geometry = new SphereGeometry(radius, 128, 128);
        super(geometry, material);

        this._mainScene = mainScene;
        this._body = body;
        this.name = name;
        this._mass = mass;
        this._temperature = temperature;
        this._radius = radius;
        this._label = new Label(mainScene, this);

        this.addToMainScene();
    }

    get mainScene(): MainScene {
        return this._mainScene;
    }

    get label(): Label {
        return this._label;
    }

    get radius(): number {
        return this._radius;
    }

    get temperature(): number {
        return this._temperature;
    }

    get mass(): number {
        return this._mass;
    }

   get body(): Body {
        return this._body;
    }

    public addToMainScene(): void { 
        this.mainScene.scene.add(this);
        this.mainScene.scene.add(this._label);
    }
    

    public updateLabel(): void {
        this._label.update(this.mainScene.cameraController.camera);
    }


    public updateRotation(): void {
        let axisInfo: AxisInfo = RotationAxis(this._body, this._mainScene.timeController.currentDate);
        this.rotation.y = (axisInfo.spin % 360) * (Math.PI / 180);
    }
}