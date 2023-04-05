import {PerspectiveCamera, Vector3, WebGLRenderer, Raycaster, Vector2} from 'three';

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

    this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 1000000);
    this.camera.position.z = 200;

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
    if (object == null || object.name != "") {
    this.focusedObject = object;
    }
  }

  onControlsChange(): void {
    if (this.focusedObject) {
      this.cameraOffset.copy(this.camera.position).sub(this.focusedObject.position);
    }
  }

  centerCameraOnObject(object: CelestialBody): void {

    if(!(object instanceof CelestialBody))
      return;


    const initialDistance = this.camera.position.distanceTo(object.position);

    this.controls.target.copy(object.position);
    this.controls.update();

    const newDistance = this.camera.position.distanceTo(object.position);
    const scalingFactor = initialDistance / newDistance;
    const newPosition = this.camera.position.clone().sub(object.position).multiplyScalar(scalingFactor).add(object.position);
    this.camera.position.copy(newPosition);
    this.controls.update();

    if (object == null || object.name != "") {
      this.setFocusedObject(object);
      this.cameraOffset.copy(this.camera.position).sub(object.position);
    }

    // Set the minDistance property to prevent clipping
    this.controls.minDistance = object.radius * 1.1;
  }

    

  async zoomToObject(object: CelestialBody): Promise<void> {
  const currentDistance = this.camera.position.distanceTo(object.position);
  const steps = 30;

  const targetDistance = object.radius * 3;

  if (currentDistance < targetDistance)
    return;


  const distanceStep = (currentDistance - (targetDistance + object.radius)) / steps;

  for (let i = 0; i < steps; i++) {
    const newPosition = this.camera.position.clone().sub(object.position).normalize().multiplyScalar(-distanceStep).add(this.camera.position);
    this.camera.position.copy(newPosition);
    this.controls.update();

    await new Promise<void>((resolve) => setTimeout(() => resolve(), 16));
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
