import { Mesh, SphereGeometry, Material } from 'three';
import { Label } from './Label';
import { MainScene } from '../../scenes/MainScene';


export class CelestialBody extends Mesh {
    public mainScene: MainScene;
    public name: string;
    public rotationSpeed: number | undefined;
    public mass: number;
    public temperature: number;
    public radius: number;
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

    addToMainScene(): void { 
        this.mainScene.scene.add(this);
        this.mainScene.scene.add(this.label);
    }

    
    getLabel(): Label {
        return this.label;
    }

    setLabelVisibility(visibility: boolean): void {
        this.label.visible
    }

    updateLabel(): void {
        this.label.update(this.mainScene.cameraController.getCamera());
    }

}