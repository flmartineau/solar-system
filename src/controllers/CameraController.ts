import {
    PerspectiveCamera,
    Vector3,
    Mesh,
    WebGLRenderer
  } from 'three';

  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

  
  export class CameraController {
    private camera: PerspectiveCamera;
    private focusedObject: Mesh | null;
    private cameraOffset: Vector3;
    private controls: OrbitControls;
  
    constructor(camera: PerspectiveCamera, renderer: WebGLRenderer) {
      this.camera = camera;
      this.focusedObject = null;
      this.cameraOffset = new Vector3();
  
      this.controls = new OrbitControls(this.camera, renderer.domElement);
      this.controls.addEventListener('change', () => this.onControlsChange());
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
    }
  
    update(): void {
      if (this.focusedObject) {
        this.camera.position.copy(this.focusedObject.position).add(this.cameraOffset);
        this.controls.target.copy(this.focusedObject.position);
        this.controls.update();
      }
    }
  }
  