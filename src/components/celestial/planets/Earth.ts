import { AdditiveBlending, BackSide, Color, ColorRepresentation, FrontSide, Mesh, MeshPhongMaterial, ShaderMaterial, SphereGeometry, TextureLoader } from 'three';

import { Body } from 'astronomy-engine';
import { constants } from '../../../utils/constants';
import { Planet } from '../Planet';
import { MainScene } from '../../../scenes/MainScene';
import { EarthMoon } from '../moons/EarthMoon';

import glowFragmentShader from '../../../assets/shaders/earth/glowFragment.glsl';
import glowVertexShader from '../../../assets/shaders/earth/glowVertex.glsl';

export class Earth extends Planet {

  constructor(mainScene: MainScene) {

    const NAME: string = 'Earth';
    const TEXTUREPATH: string = './assets/textures/earth_daymap.jpg';
    const NIGHT_TEXTUREPATH: string = './assets/textures/earth_nightmap.jpg';
    const CLOUD_TEXTUREPATH: string = './assets/textures/earth_clouds.jpg';

    const texture = mainScene.textureLoader.load(TEXTUREPATH);

    const material = new MeshPhongMaterial({ map: texture });

    const lightColor: ColorRepresentation = 0x2d5b7c;

    super(NAME, constants.Earth, material, mainScene, Body.Earth, lightColor);

    this.addClouds();
    this.addGlow();
    this.addEarthMoon();
  }

  private addClouds(): void {
    const geometry = new SphereGeometry(this.radius * 1.001, 128, 128);
    const cloudTexture = this.mainScene.textureLoader.load('assets/textures/earth_clouds.jpg');
    const atmosphere = new MeshPhongMaterial({
      side: FrontSide, map: cloudTexture, transparent: true, alphaMap: cloudTexture });
    this.add(new Mesh(geometry, atmosphere));
  }

  private addGlow(): void {
    let glowMaterial = new ShaderMaterial({
      uniforms: {
        "c": { value: 0.4 },
        "p": { value: 4.5 },
        glowColor: { value: new Color(0x0096ff) },
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

  public addEarthMoon(): void {
    let moon = new EarthMoon(this.mainScene, this);
    this.addMoon(moon);
  }


  public getMoon(): EarthMoon {
    return this.moons[0];
  }
}
