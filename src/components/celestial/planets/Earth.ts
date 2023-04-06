import { AdditiveBlending, BackSide, Color, FrontSide, Mesh, MeshPhongMaterial, ShaderMaterial, SphereGeometry, TextureLoader } from 'three';

import { Body } from 'astronomy-engine';
import { constants } from '../../../utils/constants';
import { Planet } from '../Planet';
import { MainScene } from '../../../scenes/MainScene';

export class Earth extends Planet {

  constructor(mainScene: MainScene) {

    const NAME: string = 'Earth';
    const TEXTUREPATH: string = './assets/textures/earth_daymap.jpg';
    const NIGHT_TEXTUREPATH: string = './assets/textures/earth_nightmap.jpg';
    const CLOUD_TEXTUREPATH: string = './assets/textures/earth_clouds.jpg';

    const texture = new TextureLoader().load(TEXTUREPATH);
    const material = new MeshPhongMaterial({ map: texture });

    super(NAME, constants.Earth, material, mainScene, Body.Earth);

    this.addClouds();
    this.addGlow();
  }

  private addClouds(): void {
    const geometry = new SphereGeometry(this.getRadius() * 1.001, 128, 128);
    const cloudTexture = new TextureLoader().load('assets/textures/earth_clouds.jpg');
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
        viewVector: { value: this.getMainScene().getCameraController().getCamera().position }
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

    let earthGlow = new Mesh(new SphereGeometry(this.getRadius(), 128, 128), glowMaterial);
    earthGlow.scale.multiplyScalar(1.02);
    this.add(earthGlow);
  }
}
