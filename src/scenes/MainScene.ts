import {
  Scene,
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
  public scene: Scene;
  public renderer: WebGLRenderer;
  public timeController: TimeController;
  public cameraController: CameraController;
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
    this.renderer = new WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.cameraController = new CameraController(this.renderer, this);

    this.selectedObject = null;
    container.appendChild(this.renderer.domElement);

    // Load the skybox textures
    const loader = new CubeTextureLoader();
    this.skybox = loader.load([
      '../../assets/textures/stars_2.jpg','../../assets/textures/stars_2.jpg',
      '../../assets/textures/stars_2.jpg','../../assets/textures/stars_2.jpg',
      '../../assets/textures/stars_2.jpg','../../assets/textures/stars_2.jpg'
    ]);
    this.skybox.encoding = THREE.sRGBEncoding;

    // Set the scene background to the skybox
    this.scene.background = this.skybox;

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
    

    this.animate();

    this.mouseEvents = new MouseEvents(this);


    this.fetchAndInsertContent('info-container', 'info.html');
    this.fetchAndInsertContent('current-date-container', 'current-date.html');
    this.fetchAndInsertContent('control-panel-container', 'control-panel.html', () => this.mouseEvents.addControlEventListeners());
  }

  async fetchAndInsertContent(containerId: string, contentUrl: string, callback?: () => void) {
    const response = await fetch(contentUrl);
    const content = await response.text();

    const container = document.getElementById(containerId);
    container!.innerHTML = content;
    if (callback) {
      callback();
    }
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
    this.timeController.update();
    this.cameraController.update();
  }
}
