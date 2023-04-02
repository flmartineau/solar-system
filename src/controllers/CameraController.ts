import {
  PerspectiveCamera,
  Vector3,
  Mesh,
  WebGLRenderer,
  Raycaster,
  Vector2,
  Sprite
} from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { MainScene } from '../scenes/MainScene';


export class CameraController {
  private camera: PerspectiveCamera;
  private focusedObject: Mesh | null;
  private cameraOffset: Vector3;
  private controls: OrbitControls;
  private mainScene: MainScene;
  private renderer: WebGLRenderer;

  constructor(renderer: WebGLRenderer, mainScene: MainScene) {

    this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 5;

    this.focusedObject = null;
    this.cameraOffset = new Vector3();

    this.controls = new OrbitControls(this.camera, renderer.domElement);
    this.controls.addEventListener('change', () => this.onControlsChange());
    this.mainScene = mainScene;
    this.renderer = renderer;
  }


  getCamera(): PerspectiveCamera {
    return this.camera;
  }


  setFocusedObject(object: Mesh | null): void {
    this.focusedObject = object;
  }

  onControlsChange(): void {
    if (this.focusedObject) {
      this.cameraOffset.copy(this.camera.position).sub(this.focusedObject.position);
    }
  }

  centerCameraOnObject(object: Mesh): void {
    const initialDistance = this.camera.position.distanceTo(object.position);

    this.controls.target.copy(object.position);
    this.controls.update();

    const newDistance = this.camera.position.distanceTo(object.position);
    const scalingFactor = initialDistance / newDistance;
    const newPosition = this.camera.position.clone().sub(object.position).multiplyScalar(scalingFactor).add(object.position);
    this.camera.position.copy(newPosition);
    this.controls.update();

    this.setFocusedObject(object);
    this.cameraOffset.copy(this.camera.position).sub(object.position);

    // Masquer le nom de l'objet si la caméra est trop proche
    if (object.children.length > 0) {
      const label = object.children.find(child => child instanceof Sprite);
      if (label) {
        label.visible = newDistance > 0.5;
      }
    }
  }

  update(): void {
    if (this.focusedObject) {
      this.camera.position.copy(this.focusedObject.position).add(this.cameraOffset);
      this.controls.target.copy(this.focusedObject.position);
      this.controls.update();

    }

      this.renderer.render(this.mainScene.scene, this.camera);
    
  }


  updateOnResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }

  setFromCamera(event: MouseEvent, raycaster: Raycaster): void {
    const mouse = new Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, this.camera);
  }


}
