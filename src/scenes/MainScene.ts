import { Scene, WebGLRenderer, PointLight, CubeTexture, CubeTextureLoader, sRGBEncoding, TextureLoader, Line } from 'three';

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
import { DevConsoleController } from '../controllers/DevConsoleController';
import { Pluto } from '../components/celestial/planets/Pluto';
import { EarthMoon } from '../components/celestial/moons/EarthMoon';
import { Moon } from '../components/celestial/Moon';


export class MainScene {
  private _scene: Scene;
  private _renderer: WebGLRenderer;
  private _textureLoader: TextureLoader;
  private _timeController: TimeController;
  private _cameraController: CameraController;
  private _uiController: UIController;
  private _audioController: AudioController;
  private _devConsoleController: DevConsoleController;
  private _mouseEvents: MouseEvents;

  private _sun: Sun;

  //Planets
  private _mercury: Mercury;
  private _venus: Venus;
  private _earth: Earth;
  private _mars: Mars;
  private _jupiter: Jupiter;
  private _saturn: Saturn;
  private _uranus: Uranus;
  private _neptune: Neptune;
  private _pluto: Pluto;

  //Moons
  private _moon: EarthMoon;

  private _skybox: CubeTexture;

  private _selectedObject: CelestialBody | null;

  constructor(container: HTMLElement) {
    this._scene = new Scene();
    this._renderer = new WebGLRenderer({
      antialias: true,
      logarithmicDepthBuffer: true
    });
    this._textureLoader = new TextureLoader();
    this._renderer.setSize(window.innerWidth, window.innerHeight);
    this._renderer.sortObjects = true;
    this._renderer.autoClear = true;

    this._devConsoleController = new DevConsoleController();
    this._cameraController = new CameraController(this);
    this._uiController = new UIController(this);
    this._audioController = new AudioController();

    this._selectedObject = null;
    container.appendChild(this._renderer.domElement);

    // Load the _skybox textures
    const loader = new CubeTextureLoader();
    this._skybox = loader.load([
      './assets/textures/stars_2.jpg', './assets/textures/stars_2.jpg',
      './assets/textures/stars_2.jpg', './assets/textures/stars_2.jpg',
      './assets/textures/stars_2.jpg', './assets/textures/stars_2.jpg'
    ]);
    this._skybox.encoding = sRGBEncoding;
    this._scene.background = this._skybox;
    
    this._timeController = new TimeController(this);


    this._sun = new Sun(this);
    this._mercury = new Mercury(this);
    this._venus = new Venus(this);
    this._earth = new Earth(this);
    this._mars = new Mars(this);
    this._jupiter = new Jupiter(this);
    this._saturn = new Saturn(this);
    this._uranus = new Uranus(this);
    this._neptune = new Neptune(this);
    this._pluto = new Pluto(this);

    this._moon = this._earth.getMoon();

    this._uiController.createCelestialObjectList();

    this.animate();

    this._mouseEvents = new MouseEvents(this);

    TemplateHelper.initTemplates(this._mouseEvents);
  }

  get scene(): Scene {
    return this._scene;
  }

  get renderer(): WebGLRenderer {
    return this._renderer;
  }

  get textureLoader(): TextureLoader {
    return this._textureLoader;
  }

  get timeController(): TimeController {
    return this._timeController;
  }

  get uiController(): UIController {
    return this._uiController;
  }

  get cameraController(): CameraController {
    return this._cameraController;
  }

  get audioController(): AudioController {
    return this._audioController;
  }

  get devConsoleController(): DevConsoleController {
    return this._devConsoleController;
  }

  get selectedObject(): CelestialBody | null {
    return this._selectedObject;
  }

  set moonsVibility(visible: boolean) {
    this.getMoons().forEach((moon: Moon) => {
      moon.orbitLine.visible = visible;
      moon.label.visible = visible;
      moon.visible = visible;
    });
  }

  get celestialObjects(): CelestialBody[] {
    return [this._sun, this._mercury, this._venus, this._earth, this._mars, 
      this._jupiter, this._saturn, this._uranus, this._neptune, this._pluto, this._moon];
  }

  getPlanets(): Planet[] {
    return this.celestialObjects.filter((object: CelestialBody) => object instanceof Planet) as Planet[];
  }
  
  getMoons(): Moon[] {
    return this.celestialObjects.filter((object: CelestialBody) => object instanceof Moon) as Moon[];
  }

  getLabels(): Array<Label> {
    return this.celestialObjects.map((object: CelestialBody) => object.label);
  }

  getOrbitLines(): Array<Line> {

    let moonOrbitLines: Array<Line> = [];
    let planetOrbitLines: Array<Line> = [];
    this.getMoons().forEach((moon: Moon) => {
      moonOrbitLines.push(moon.orbitLine);
    });
    this.getPlanets().forEach((planet: Planet) => {
      planetOrbitLines.push(planet.orbitLine);
    });
    return moonOrbitLines.concat(planetOrbitLines);
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

  selectObject(object: CelestialBody): void {

    if (this._selectedObject === object) {
      this._cameraController.zoomToObject(this._selectedObject);
      return;
    }
    this._selectedObject = object;
    this._cameraController.centerCameraOnObject(this._selectedObject);
    this.audioController.playClick(1);
  }

  private animate(): void {

    this._renderer.setAnimationLoop(() => {
      this._devConsoleController.stats.begin();
      this._timeController.update();
      if (this._selectedObject)
        this._uiController.showInfo(this._selectedObject);
      this._cameraController.update();
      this._devConsoleController.stats.end();
      this._renderer.render(this._scene, this._cameraController.camera);
    });
  }
}
