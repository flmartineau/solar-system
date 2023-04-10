import { Body } from 'astronomy-engine';
import { constants } from '../../../utils/constants';
import { Planet } from '../Planet';
import { MainScene } from '../../../scenes/MainScene';
import { AdditiveBlending, BackSide, Color, ColorRepresentation, Mesh, MeshPhongMaterial, ShaderMaterial, SphereGeometry, Texture } from 'three';
import glowFragmentShader from '../../../assets/shaders/glow/glowFragment.glsl';
import glowVertexShader from '../../../assets/shaders/glow/glowVertex.glsl';


export class Mars extends Planet {

  private _lightColor: ColorRepresentation;;
    
  constructor(mainScene: MainScene) {

    const NAME: string = 'Mars';
    const TEXTUREPATH: string = './assets/textures/mars.jpg';
    
    const texture: Texture = mainScene.textureLoader.load(TEXTUREPATH);
    const material = new MeshPhongMaterial({ map: texture });
    const lightColor: ColorRepresentation = 0xb0563c;
    
    super(NAME, constants.Mars, material, mainScene, Body.Mars, lightColor);

    this._lightColor = lightColor;

    this.addGlow();
  }

  private addGlow(): void {
    let glowMaterial = new ShaderMaterial({
      uniforms: {
        "c": { value: 0.4 },
        "p": { value: 4.5 },
        glowColor: { value: new Color(this._lightColor) },
        viewVector: { value: this.mainScene.cameraController.camera.position }
      },
      vertexShader: glowVertexShader,
      fragmentShader: glowFragmentShader,
      side: BackSide,
      blending: AdditiveBlending,
      transparent: true
    });

    let marsGlow = new Mesh(new SphereGeometry(this.radius, 128, 128), glowMaterial);
    marsGlow.scale.multiplyScalar(1.02);
    this.add(marsGlow);
  }
}
