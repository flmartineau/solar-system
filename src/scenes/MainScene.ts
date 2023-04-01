import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  PointLight,
  TextureLoader,
  Mesh,
  MeshBasicMaterial,
  SphereGeometry,
  Vector2,
  Vector3,
  Raycaster,
  AmbientLight,
  CubeTexture,
  CubeTextureLoader,
  Spherical
} from 'three';
import * as THREE from 'three';
import { Sun } from '../components/celestial/Sun';
import { Mercury } from '../components/celestial/Mercury';
import { Venus } from '../components/celestial/Venus';


import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export class MainScene {
  private scene: Scene;
  private camera: PerspectiveCamera;
  private renderer: WebGLRenderer;


  private sun: Sun;
  private mercury: Mercury;
  private venus: Venus;


  private controls: OrbitControls;
  private raycaster: Raycaster;
  private mouse: Vector2;
  private skybox: CubeTexture;

  private selectedObject: Mesh | null;
  private focusedObject: Mesh | null = null;
private cameraOffset: Vector3 = new Vector3();

  constructor(container: HTMLElement) {
    this.scene = new Scene();
    this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.selectedObject = null;
    container.appendChild(this.renderer.domElement);


    // Add the click event listener
   window.addEventListener('click', (event) => this.onClick(event), false);

    // Load the skybox textures
        const loader = new CubeTextureLoader();
        this.skybox = loader.load([
          '../../assets/textures/stars_2.jpg',
          '../../assets/textures/stars_2.jpg',
          '../../assets/textures/stars_2.jpg',
          '../../assets/textures/stars_2.jpg',
          '../../assets/textures/stars_2.jpg',
          '../../assets/textures/stars_2.jpg'
        ]);
        this.skybox.encoding = THREE.sRGBEncoding;

        // Set the scene background to the skybox
      this.scene.background = this.skybox;


    this.camera.position.z = 5;
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.update();

    this.controls.addEventListener('change', () => this.onControlsChange());


    const light = new PointLight(0xffffff, 1, 0);
    light.position.set(0, 0, 0);
    this.scene.add(light);


    const ambientLight = new AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    this.sun = new Sun(1, '../../assets/textures/sun.jpg', 'Sun', 1.989 * Math.pow(10, 30), 5778, 0.00005);

    this.scene.add(this.sun);

   
   this.mercury = new Mercury();
   this.scene.add(this.mercury);

   this.venus = new Venus();
   this.scene.add(this.venus);

    this.raycaster = new Raycaster();
    this.mouse = new Vector2();

    window.addEventListener('mousemove', (event) => this.onMouseMove(event), false);
    window.addEventListener('resize', () => this.onWindowResize(), false);

    this.animate();
  }

  private onClick(event: MouseEvent): void {
  this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  this.raycaster.setFromCamera(this.mouse, this.camera);

  const celestialObjects = [this.sun, this.mercury, this.venus]; // Add more planets to this array as needed
  const intersects = this.raycaster.intersectObjects(celestialObjects);

  if (intersects.length > 0) {
    const object = intersects[0].object;
    this.selectedObject = object as Mesh;
    this.centerCameraOnObject(this.selectedObject);
  }
}

private onControlsChange(): void {
  if (this.focusedObject) {
    this.cameraOffset.copy(this.camera.position).sub(this.focusedObject.position);
  }
}


private centerCameraOnObject(object: Mesh): void {
  const initialDistance = this.camera.position.distanceTo(object.position);

  this.controls.target.copy(object.position);
  this.controls.update();

  const newDistance = this.camera.position.distanceTo(object.position);
  const scalingFactor = initialDistance / newDistance;
  const newPosition = this.camera.position.clone().sub(object.position).multiplyScalar(scalingFactor).add(object.position);
  this.camera.position.copy(newPosition);
  this.controls.update();

  this.focusedObject = object;
  this.cameraOffset.copy(this.camera.position).sub(object.position);
}






  private animate(): void {
    requestAnimationFrame(() => this.animate());



    this.sun.rotation.y += this.sun.rotationSpeed;
    this.mercury.rotation.y += this.mercury.rotationSpeed;
this.venus.rotation.y += this.venus.rotationSpeed;
    if (this.focusedObject) {
    this.camera.position.copy(this.focusedObject.position).add(this.cameraOffset);
    this.controls.target.copy(this.focusedObject.position);
    this.controls.update();
  }


    this.renderer.render(this.scene, this.camera);
    this.controls.update();

    // Update Mercury's orbit
   const deltaTime = 0.016; // Use a fixed time step or calculate the elapsed time since the last frame
   this.mercury.updateOrbit(deltaTime);
   this.venus.updateOrbit(deltaTime);
  }

  private onMouseMove(event: MouseEvent): void {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    const intersects = this.raycaster.intersectObjects([this.sun, this.mercury, this.venus]);


    if (intersects.length > 0) {
      this.showInfo(intersects[0].object);
    } else {
      this.hideInfo();
    }
  }

  private onWindowResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  // Helper function to display information
  private showInfo(celestialObject: any): void {
    const infoElement = document.getElementById('info');
    if (infoElement) {
      infoElement.innerHTML = `
        <strong>Name:</strong> ${celestialObject.name}<br>
        <strong>Mass:</strong> ${celestialObject.mass} kg<br>
        <strong>Temperature:</strong> ${celestialObject.temperature} K
      `;
      infoElement.style.display = 'block';
    }
  }

  private hideInfo(): void {
    const infoElement = document.getElementById('info');
    if (infoElement) {
      infoElement.style.display = 'none';
    }
  }
}
