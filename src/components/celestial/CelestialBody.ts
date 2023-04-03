import { Mesh, MeshPhongMaterial, SphereGeometry, TextureLoader, MeshBasicMaterial, MeshLambertMaterial, Vector2, UniformsUtils, ShaderLib, ShaderMaterial, Color, BackSide, AdditiveBlending, Material  } from 'three';
import { Label } from './Label';
import { MainScene } from '../../scenes/MainScene';


export class CelestialBody extends Mesh {
    public mainScene: MainScene;
    public name: string;
    public rotationSpeed: number;
    public mass: number;
    public temperature: number;
    public radius: number;
    private label: Label;

    constructor(mainScene: MainScene, name: string, radius: number, material: Material, 
        rotationSpeed: number, mass: number, temperature: number) {

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

    addGlow() {
        // TODO ajust glow parameters
        if (this.name === 'Earth') {
            let glowMaterial = new ShaderMaterial({
                uniforms: {
                    "c": {  value: 0.15 },
                    "p": {  value: 3 },
                    glowColor: { value: new Color(0x0096ff) },
                    viewVector: { value: this.mainScene.cameraController.getCamera().position }
                },
                vertexShader: `
                    uniform vec3 viewVector;
                    uniform float c;
                    uniform float p;
                    varying float intensity;
                    void main() {
                        vec3 vNormal = normalize( normalMatrix * normal );
                        vec3 vNormel = normalize( normalMatrix * viewVector );
                        intensity = pow( c - dot(vNormal, vNormel), p );
                        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
                    }
                `,
                fragmentShader: `
                    uniform vec3 glowColor;
                    varying float intensity;
                    void main() {
                        vec3 glow = glowColor * intensity * 0.5;
                        gl_FragColor = vec4( glow, 10.0 );
                    }
                `,
                side: BackSide,
                blending: AdditiveBlending,
                transparent: true
            });

            let earthGlow = new Mesh(new SphereGeometry(this.radius, 128, 128), glowMaterial);
            earthGlow.scale.multiplyScalar(1.02);
            this.add(earthGlow);
        }
    }

    getLabel(): Label {
        return this.label;
    }

    setLabelVisibility(visibility: boolean): void {
        this.label.visible
    }

}