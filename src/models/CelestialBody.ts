import { Mesh, SphereGeometry, Material } from 'three';
import { Label } from './Label';
import { MainScene } from '../scenes/MainScene';
import { IMoon, IPlanet, ISun } from '../interfaces/ISolarSystem';

export class CelestialBody extends Mesh {
    public name: string;

    private _mainScene: MainScene;
    private _mass: number;
    private _temperature: number;
    private _radius: number;
    private _rotationPeriod: number;
    private _label: Label;

    private _isSelected: boolean = false;


    constructor(mainScene: MainScene, data: IPlanet | ISun | IMoon, radius: number, material: Material) {

        const geometry = new SphereGeometry(radius, 128, 128);
        super(geometry, material);

        this._mainScene = mainScene;
        this.name = data.name;
        this._mass = data.mass;
        this._temperature = data.temperature;
        this._radius = radius;
        this._rotationPeriod = data.rotationPeriod;
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

    set radius(value: number) {
        this._radius = value;
    }

    get temperature(): number {
        return this._temperature;
    }

    get mass(): number {
        return this._mass;
    }

    get rotationPeriod(): number {
        return this._rotationPeriod;
    }

    get isSelected(): boolean {
        return this._isSelected;
    }

    set isSelected(value: boolean) {
        this._isSelected = value;
    }

    get bigSizeFactor(): number {
        return this.instanceOf('Planet') ? 1000 : 20;
    }

    public setBigSize(value: boolean): void {
        const scalingFactor: number = value ? this.bigSizeFactor : 1 / this.bigSizeFactor;
        this.radius = this.radius * scalingFactor;
        this.geometry.scale(scalingFactor, scalingFactor, scalingFactor);
    }

    public addToMainScene(): void {
        this.mainScene.scene.add(this);
        this.mainScene.scene.add(this._label);
    }

    public update(): void { }

    public updateLabel(): void {
        this._label.update(this.mainScene.cameraController.camera);
    }

    public instanceOf(className: string): boolean {
        return className === 'CelestialBody';
    }
}