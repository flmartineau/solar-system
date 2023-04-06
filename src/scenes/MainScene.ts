import {
  Scene,
  WebGLRenderer,
  PointLight,
  Mesh,
  CubeTexture,
  CubeTextureLoader,
  Sprite,
  CanvasTexture,
  SpriteMaterial,
  Vector3,
} from 'three';

import Stats from 'stats.js';

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
import { TemplateHelper } from '../helper/TemplateHelper';
import { CelestialBody } from '../components/celestial/CelestialBody';
import { Label } from '../components/celestial/Label';
import { UIController } from '../controllers/UIController';

export class MainScene {
  public scene: Scene;
  public renderer: WebGLRenderer;
  public timeController: TimeController;
  public cameraController: CameraController;
  public uiController: UIController;
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

  public selectedObject: CelestialBody | null;

  constructor(container: HTMLElement) {
    this.scene = new Scene();
    this.renderer = new WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.sortObjects = true;
    this.renderer.autoClear = true;

    this.cameraController = new CameraController(this.renderer, this);
    this.uiController = new UIController(this);


    this.selectedObject = null;
    container.appendChild(this.renderer.domElement);

    // Load the skybox textures
    const loader = new CubeTextureLoader();
    this.skybox = loader.load([
      './assets/textures/stars_2.jpg', './assets/textures/stars_2.jpg',
      './assets/textures/stars_2.jpg', './assets/textures/stars_2.jpg',
      './assets/textures/stars_2.jpg', './assets/textures/stars_2.jpg'
    ]);
    this.skybox.encoding = THREE.sRGBEncoding;

    // Set the scene background to the skybox
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

    this.timeController.setPlanets(this.getPlanets());
    this.timeController.setSun(this.sun);

    /** AXIS LINES
    
    const orbitMaterialX = new THREE.LineBasicMaterial({ color: 0xff0000 });  //RED
    let pointsX = [];
    pointsX.push(new THREE.Vector3(0, 0, 0));
    pointsX.push(new THREE.Vector3(100, 0, 0));
    const orbitGeometryX = new THREE.BufferGeometry().setFromPoints(pointsX);        
    const orbitLineX = new THREE.Line(orbitGeometryX, orbitMaterialX);
    const orbitMaterialY = new THREE.LineBasicMaterial({ color: 0x00ff00 }); //GREEN
    let pointsY = [];
    pointsY.push(new THREE.Vector3(0, 0, 0));
    pointsY.push(new THREE.Vector3(0, 100, 0));
    const orbitGeometryY = new THREE.BufferGeometry().setFromPoints(pointsY); 
    const orbitLineY = new THREE.Line(orbitGeometryY, orbitMaterialY);
    let pointsZ = [];
    pointsZ.push(new THREE.Vector3(0, 0, 0));
    pointsZ.push(new THREE.Vector3(0, 0, 100));
    const orbitMaterialZ = new THREE.LineBasicMaterial({ color: 0x0000ff }); //BLUE
    const orbitGeometryZ = new THREE.BufferGeometry().setFromPoints(pointsZ);
    const orbitLineZ = new THREE.Line(orbitGeometryZ, orbitMaterialZ);
    this.scene.add(orbitLineX);
    this.scene.add(orbitLineY);
    this.scene.add(orbitLineZ);
    */


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

  async fetchAndInsertContent(containerId: string, contentUrl: string, callback?: () => void) {
    const response = await fetch(contentUrl);
    const content = await response.text();

    const container = document.getElementById(containerId);
    container!.innerHTML = content;
    if (callback) {
      callback();
    }
  }

  getCelestialObjects(): CelestialBody[] {
    return [this.sun, this.mercury, this.venus, this.earth, this.mars, this.jupiter, this.saturn, this.uranus, this.neptune];
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
