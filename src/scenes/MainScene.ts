import { Scene, WebGLRenderer, PointLight, CubeTexture, CubeTextureLoader, sRGBEncoding, TextureLoader } from 'three';
import Stats from 'stats.js';

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
import { TemplateHelper } from '../helper/TemplateHelper';
import { CelestialBody } from '../components/celestial/CelestialBody';
import { Label } from '../components/celestial/Label';
import { UIController } from '../controllers/UIController';
import { AudioController } from '../controllers/AudioController';

export class MainScene {
  private scene: Scene;
  private renderer: WebGLRenderer;
  private textureLoader: TextureLoader;
  private timeController: TimeController;
  private cameraController: CameraController;
  private uiController: UIController;
  private audioController: AudioController;
  private mouseEvents: MouseEvents;
  private stats: Stats;

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


  private skybox: CubeTexture;

  private selectedObject: CelestialBody | null;

  constructor(container: HTMLElement) {
    this.scene = new Scene();
    this.renderer = new WebGLRenderer();
    this.textureLoader = new TextureLoader();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.sortObjects = true;
    this.renderer.autoClear = true;

    this.cameraController = new CameraController(this);
    this.uiController = new UIController(this);
    this.audioController = new AudioController();

    this.selectedObject = null;
    container.appendChild(this.renderer.domElement);

    // Load the skybox textures
    const loader = new CubeTextureLoader();
    this.skybox = loader.load([
      './assets/textures/stars_2.jpg', './assets/textures/stars_2.jpg',
      './assets/textures/stars_2.jpg', './assets/textures/stars_2.jpg',
      './assets/textures/stars_2.jpg', './assets/textures/stars_2.jpg'
    ]);
    this.skybox.encoding = sRGBEncoding;
    this.scene.background = this.skybox;

    const light = new PointLight(0xffffff, 1, 0);
    light.position.set(0, 0, 0);
    this.scene.add(light);

    this.timeController = new TimeController(this);

    this.sun = new Sun(this);
    this.mercury = new Mercury(this);
    this.venus = new Venus(this);
    this.earth = new Earth(this);
    this.mars = new Mars(this);
    this.jupiter = new Jupiter(this)
    this.saturn = new Saturn(this)
    this.uranus = new Uranus(this)
    this.neptune = new Neptune(this)

    this.stats = new Stats();
    this.stats.showPanel(0);
    this.stats.dom.style.right = '0px';
    this.stats.dom.style.left = 'auto';
    document.body.appendChild(this.stats.dom);

    this.uiController.createCelestialObjectList();

    this.animate();

    this.mouseEvents = new MouseEvents(this);

    TemplateHelper.initTemplates(this.mouseEvents);
  }

  public getScene(): Scene {
    return this.scene;
  }

  public getRenderer(): WebGLRenderer {
    return this.renderer;
  }

  public getTextureLoader(): TextureLoader {
    return this.textureLoader;
  }

  public getTimeController(): TimeController {
    return this.timeController;
  }

  public getUIController(): UIController {
    return this.uiController;
  }

  public getCameraController(): CameraController {
    return this.cameraController;
  }

  public getAudioController(): AudioController {
    return this.audioController;
  }

  public getSelectedObject(): CelestialBody | null {
    return this.selectedObject;
  }

  async fetchAndInsertContent(containerId: string, contentUrl: string, callback?: () => void): Promise<void> {
    const response: Response = await fetch(contentUrl);
    const content: string = await response.text();
    const container: HTMLElement | null = document.getElementById(containerId);
    container!.innerHTML = content;
    if (callback) {
      callback();
    }
  }

  getCelestialObjects(): CelestialBody[] {
    return [this.sun, this.mercury, this.venus, this.earth, this.mars, 
      this.jupiter, this.saturn, this.uranus, this.neptune];
  }

  getPlanets(): Planet[] {
    return this.getCelestialObjects().filter((object: CelestialBody) => object instanceof Planet) as Planet[];
  }

  getLabels(): Array<Label> {
    return this.getCelestialObjects().map((object: CelestialBody) => object.getLabel());
  }

  selectObject(object: CelestialBody): void {

    if (this.selectedObject === object) {
      this.cameraController.zoomToObject(this.selectedObject);
      return;
    }
    this.selectedObject = object;
    this.cameraController.centerCameraOnObject(this.selectedObject);
    this.getAudioController().playClick(1);
  }

  private animate(): void {

    this.renderer.setAnimationLoop(() => {
      this.stats.begin();
      this.timeController.update();
      if (this.selectedObject)
        this.uiController.showInfo(this.selectedObject);
      this.cameraController.update();
      this.stats.end();
      this.renderer.render(this.scene, this.cameraController.getCamera());
    });
  }
}
