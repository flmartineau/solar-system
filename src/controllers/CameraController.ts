import {
  PerspectiveCamera,
  Vector3,
  WebGLRenderer,
  Raycaster,
  Vector2,
} from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { MainScene } from '../scenes/MainScene';
import { CelestialBody } from '../components/celestial/CelestialBody';


export class CameraController {
  private camera: PerspectiveCamera;
  private focusedObject: CelestialBody | null;
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


  setFocusedObject(object: CelestialBody | null): void {
    this.focusedObject = object;
  }

  onControlsChange(): void {
    if (this.focusedObject) {
      this.cameraOffset.copy(this.camera.position).sub(this.focusedObject.position);
    }
  }

  centerCameraOnObject(object: CelestialBody): void {
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
  }

  async zoomToObject(object: CelestialBody, targetDistance: number): Promise<void> {
  const currentDistance = this.camera.position.distanceTo(object.position);
  const steps = 30;
  const distanceStep = (currentDistance - (targetDistance + object.radius)) / steps;

  for (let i = 0; i < steps; i++) {
    const newPosition = this.camera.position.clone().sub(object.position).normalize().multiplyScalar(-distanceStep).add(this.camera.position);
    this.camera.position.copy(newPosition);
    this.controls.update();

    // Attendre un peu avant de passer à l'étape suivante
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 16));
  }
}


  update(): void {
    if (this.focusedObject) {
      this.camera.position.copy(this.focusedObject.position).add(this.cameraOffset);
      this.controls.target.copy(this.focusedObject.position);
      this.controls.update();

      // Masquer le nom de l'objet si la caméra est trop proche
      if (this.focusedObject.getLabel()) {
        this.focusedObject.setLabelVisibility(this.camera.position.distanceTo(this.focusedObject.position) > (this.focusedObject.radius * 6));
      }


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
