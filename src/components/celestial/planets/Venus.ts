import { Body } from 'astronomy-engine';
import { constants } from '../../../utils/constants';
import { Planet } from '../Planet';
import { MainScene } from '../../../scenes/MainScene';
import { AdditiveBlending, BackSide, Color, ColorRepresentation, FrontSide, Mesh, MeshPhongMaterial, ShaderMaterial, SphereGeometry, Texture } from 'three';
import glowFragmentShader from '../../../assets/shaders/glow/glowFragment.glsl';
import glowVertexShader from '../../../assets/shaders/glow/glowVertex.glsl';


export class Venus extends Planet {

  private _lightColor: ColorRepresentation;;

  constructor(mainScene: MainScene) {
    
    const NAME: string = 'Venus';
    const TEXTUREPATH: string = './assets/textures/venus.jpg';

    const texture: Texture = mainScene.textureLoader.load(TEXTUREPATH);
    const material = new MeshPhongMaterial({ map: texture });
    const lightColor: ColorRepresentation = 0xd1c0a0;


    super(NAME, constants.Venus, material, mainScene, Body.Venus, lightColor);

    this._lightColor = lightColor;
    this.addClouds();
    this.addGlow();
  }


  private addClouds(): void {
    const geometry = new SphereGeometry(this.radius * 1.001, 128, 128);
    const cloudTexture = this.mainScene.textureLoader.load('assets/textures/venus_atmosphere.jpg');
    const atmosphere = new MeshPhongMaterial({
      side: FrontSide, map: cloudTexture, transparent: true, alphaMap: cloudTexture });
    this.add(new Mesh(geometry, atmosphere));
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

    let earthGlow = new Mesh(new SphereGeometry(this.radius, 128, 128), glowMaterial);
    earthGlow.scale.multiplyScalar(1.02);
    this.add(earthGlow);
  }


}
