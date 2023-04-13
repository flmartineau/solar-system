import { Scene, WebGLRenderer, CubeTexture, CubeTextureLoader, sRGBEncoding, TextureLoader, Line } from 'three';

import { Planet } from '../components/celestial/Planet';
import { CameraController } from '../controllers/CameraController';
import { MouseEvents } from '../controllers/MouseEvents';
import { TimeController } from '../controllers/TimeController';
import { TemplateHelper } from '../helper/TemplateHelper';
import { CelestialBody } from '../components/celestial/CelestialBody';
import { Label } from '../components/celestial/Label';
import { UIController } from '../controllers/UIController';
import { AudioController } from '../controllers/AudioController';
import { DevConsoleController } from '../controllers/DevConsoleController';
import { Moon } from '../components/celestial/Moon';
import { SolarSystemFactory } from '../factories/SolarSystemFactory';


export class MainScene {
  private _scene: Scene;
  private _renderer: WebGLRenderer;
  private _textureLoader: TextureLoader;
  private _timeController: TimeController;
  private _cameraController: CameraController;
  private _uiController: UIController;
  private _audioController: AudioController;
  private _devConsoleController: DevConsoleController;
  private _solarSystemFactory?: SolarSystemFactory;
  private _mouseEvents: MouseEvents;

  private _skybox: CubeTexture;

  private _selectedObject: CelestialBody | null;

  private _moonsVisibility: boolean;

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
    this._moonsVisibility = true;
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

    this._mouseEvents = new MouseEvents(this);

    TemplateHelper.initTemplates(this._mouseEvents);

    this.loadData().then(() => {
      this._uiController.createCelestialObjectList();

      this.animate();

    });
    
  }

  private async loadData() {
    let dataRequest = await fetch('./data/solarsystem.json');
    let data = await dataRequest.json();
    this._solarSystemFactory = new SolarSystemFactory(data, this);
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

  get solarSystemFactory(): SolarSystemFactory {
    return this._solarSystemFactory as SolarSystemFactory;
  }

  get selectedObject(): CelestialBody | null {
    return this._selectedObject;
  }

  get moonsVisibility(): boolean {
    return this._moonsVisibility;
  }

  set moonsVisibility(visible: boolean) {
    this._moonsVisibility = visible;
    this.moons.forEach((moon: Moon) => {
      moon.orbitLine.visible = visible;
      moon.label.visible = visible;
      moon.visible = visible;
    });
  }

  get celestialObjects(): CelestialBody[] {
    if (!this.solarSystemFactory)
     return [];
    return this.solarSystemFactory?.celestialBodies;
  }

  get earth(): Planet {
    return this.solarSystemFactory.getPlanetByIndex(2);
  }

  get planets(): Planet[] {
    return this.celestialObjects.filter((object: CelestialBody) => object instanceof Planet) as Planet[];
  }
  
  get moons(): Moon[] {
    return this.celestialObjects.filter((object: CelestialBody) => object instanceof Moon) as Moon[];
  }

  get labels(): Array<Label> {
    return this.celestialObjects.map((object: CelestialBody) => object.label);
  }

  get orbitLines(): Array<Line> {

    let moonOrbitLines: Array<Line> = [];
    let planetOrbitLines: Array<Line> = [];
    this.moons.forEach((moon: Moon) => {
      moonOrbitLines.push(moon.orbitLine);
    });
    this.planets.forEach((planet: Planet) => {
      planetOrbitLines.push(planet.orbitLine);
    });
    return moonOrbitLines.concat(planetOrbitLines);
  }

  selectObject(object: CelestialBody): void {

    if (object.name == '')
      return;

      object.isSelected = true;

    if (this._selectedObject === object) {
      this._cameraController.zoomToObject(this._selectedObject);
      return;
    }
    if (this._selectedObject)
      this._selectedObject.isSelected = false;
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
