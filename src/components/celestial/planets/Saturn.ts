import { Body, KM_PER_AU } from 'astronomy-engine';
import { SIZE_FACTOR, constants } from '../../../utils/constants';
import { Planet } from '../Planet';
import { MainScene } from '../../../scenes/MainScene';
import { DoubleSide, Mesh, MeshLambertMaterial, MeshPhongMaterial, RingGeometry, Texture } from 'three';

export class Saturn extends Planet {
    
  constructor(mainScene: MainScene) {

    const NAME: string = 'Saturn';
    const TEXTUREPATH: string = './assets/textures/saturn.jpg';

    const texture: Texture = mainScene.getTextureLoader().load(TEXTUREPATH);
    const material = new MeshPhongMaterial({ map: texture });

    super(NAME, constants.Saturn, material, mainScene, Body.Saturn);

    //this.addRings();
  }


  /* private addRings(): void {
    const innerRadius = (67300 / KM_PER_AU) * SIZE_FACTOR;
    const outerRadius = (140300 / KM_PER_AU) * SIZE_FACTOR;

    const ringTexture = this.getMainScene().getTextureLoader().load('assets/textures/saturn_ring_alpha.png');
    const ringMaterial = new MeshLambertMaterial({ 
      map: ringTexture,
      alphaMap: ringTexture,
      side: DoubleSide, 
      transparent: true });

    const geometry = new RingGeometry(innerRadius, outerRadius, 180);
    

    const ring = new Mesh(geometry, ringMaterial);
    ring.position.set(0, 0, 0);
    this.add(ring);
  
  } */


  
  
}
