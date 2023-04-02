import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  PointLight,
  Mesh,
  CubeTexture,
  CubeTextureLoader,
} from 'three';
import * as THREE from 'three';
import { Sun } from '../components/celestial/Sun';
import { Mercury } from '../components/celestial/planets/Mercury';
import { Venus } from '../components/celestial/planets/Venus';
import { Jupiter } from '../components/celestial/planets/Jupiter';
import { Planet } from '../components/celestial/Planet';
import { Earth } from '../components/celestial/planets/Earth';
import { Mars } from '../components/celestial/planets/Mars';
import { Saturn } from '../components/celestial/planets/Saturn';
import { Uranus } from '../components/celestial/planets/Uranus';
import { Neptune } from '../components/celestial/planets/Neptune';
import { CameraController } from '../controllers/CameraController';
import { MouseEvents } from '../controllers/MouseEvents';
import { TimeController } from '../controllers/TimeController';

export class MainScene {
  private scene: Scene;
  public camera: PerspectiveCamera;
  public renderer: WebGLRenderer;
  public timeController: TimeController;
  private cameraController: CameraController;
  private mouseEvents: MouseEvents;
  

  private sun: Sun;

  //Planets
  private mercury: Mercury;
  private venus: Venus;
  private earth: Earth;
  private mars: Mars;
  private jupiter: Jupiter;
  private saturn: Saturn;
  private uranus: Uranus;
  private neptune: Neptune;

  private planets: Array<Planet>;
  private skybox: CubeTexture;

  private selectedObject: Mesh | null;

  constructor(container: HTMLElement) {
    this.scene = new Scene();
    this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.cameraController = new CameraController(this.camera, this.renderer);

    this.selectedObject = null;
    container.appendChild(this.renderer.domElement);

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


    const light = new PointLight(0xffffff, 1, 0);
    light.position.set(0, 0, 0);
    this.scene.add(light);

    this.sun = new Sun();
    this.mercury = new Mercury();
    this.venus = new Venus();
    this.earth = new Earth();
    this.mars = new Mars();
    this.jupiter = new Jupiter()
    this.saturn = new Saturn()
    this.uranus = new Uranus()
    this.neptune = new Neptune()


    this.scene.add(this.sun);

    this.planets = [this.mercury, this.venus, this.earth, this.mars, this.jupiter, this.saturn, this.uranus, this.neptune];

    this.planets.forEach((planet: Planet) => {
      this.scene.add(planet);
      this.scene.add(planet.createOrbitLine());
    }); 

    this.timeController = new TimeController(this.sun, this.planets);
    this.mouseEvents = new MouseEvents(this);

    this.animate();
  }

  getCelestialObjects(): Mesh[] {
    return [this.sun, this.mercury, this.venus, this.earth, this.mars, this.jupiter, this.saturn, this.uranus, this.neptune];
  }

  selectObject(object: Mesh): void {
    this.selectedObject = object;
    this.centerCameraOnObject(this.selectedObject);
  }

  private centerCameraOnObject(object: Mesh): void {
    this.cameraController.centerCameraOnObject(object);
  }

  private animate(): void {
    requestAnimationFrame(() => this.animate());
    const deltaTime = 0.016; // Use a fixed time step or calculate the elapsed time since the last frame
    this.timeController.update(deltaTime);
    this.cameraController.update();

    this.renderer.render(this.scene, this.camera);
  }

  
}
