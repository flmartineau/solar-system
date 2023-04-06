import { Mesh, SphereGeometry, Material } from 'three';
import { Label } from './Label';
import { MainScene } from '../../scenes/MainScene';


export class CelestialBody extends Mesh {
    public name: string;

    private mainScene: MainScene;
    private rotationSpeed: number | undefined;
    private mass: number;
    private temperature: number;
    private radius: number;
    private label: Label;

    constructor(mainScene: MainScene, name: string, radius: number, material: Material, 
        mass: number, temperature: number, rotationSpeed?: number) {

        const geometry = new SphereGeometry(radius, 128, 128);
        super(geometry, material);

        this.mainScene = mainScene;
        this.name = name;
        this.rotationSpeed = rotationSpeed;
        this.mass = mass;
        this.temperature = temperature;
        this.radius = radius;
        this.label = new Label(this);

        this.addToMainScene();
    }

    public getMainScene(): MainScene {
        return this.mainScene;
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

    public getRotationSpeed(): number {
        return this.rotationSpeed ? this.rotationSpeed : 0;
    }
}