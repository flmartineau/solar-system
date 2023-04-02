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

  private labels: Array<Sprite>;

  constructor(container: HTMLElement) {
    this.scene = new Scene();
    this.labels = new Array<Sprite>();
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
    let sunLabel = this.createLabel(this.sun);
    this.scene.add(sunLabel);
    this.labels.push(sunLabel);

    this.planets = [this.mercury, this.venus, this.earth, this.mars, this.jupiter, this.saturn, this.uranus, this.neptune];

    this.planets.forEach((planet: Planet) => {
      this.scene.add(planet);
      this.scene.add(planet.createOrbitLine());
      //planet.add(this.createLabel(planet.name));
      let label = this.createLabel(planet);
      this.scene.add(label);
      this.labels.push(label);
    });

    this.timeController = new TimeController(this.sun, this.planets);
    

    this.animate();

    this.mouseEvents = new MouseEvents(this);

    TemplateHelper.initTemplates(this.mouseEvents);
  }

  private createLabel(celestialBody: CelestialBody): Sprite {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 256;
    canvas.height = 64;
    if (context) {
      context.font = '48px Arial';
      context.textAlign = 'center';
      context.fillStyle = 'white';
      context.fillText(celestialBody.name, canvas.width / 2, canvas.height / 2);
    }
  
    const texture = new CanvasTexture(canvas);
    const material = new SpriteMaterial({ map: texture, transparent: true });
    const sprite = new Sprite(material);
    sprite.scale.set(0.15, 0.0375, 1);


    console.log(celestialBody.name);
    console.log(celestialBody.position.x, celestialBody.position.y, celestialBody.position.z);

    sprite.position.copy(celestialBody.position.clone());
  
    return sprite;
  }

  updateLabels(): void {
    console.log("update labels");
    // Pour chaque objet céleste (planètes et soleil)
    this.getCelestialObjects().forEach((obj: Mesh, index: number) => {
        const label = this.labels[index];
        console.log("udpate label : ", label)
        if (label) {
         // Mettre à jour la position et la taille du label en fonction de la position de la caméra
        const cameraPosition = this.cameraController.getCamera().position;

        const scale = cameraPosition.distanceTo(obj.position) * 1;
        label.scale.set(0.15 * scale, 0.0375 * scale, 1);

        // Calculer la direction entre la caméra et l'objet
        const direction = new THREE.Vector3().subVectors(cameraPosition, obj.position).normalize();

        // Utiliser le vecteur "up" de la caméra pour déterminer la direction droite et haute pour positionner le label
        const cameraUp = this.cameraController.getCamera().up.clone();

        // Trouver le vecteur perpendiculaire entre la direction et le vecteur "up" de la caméra
        //const right = direction.clone().cross(cameraUp);

        // Utiliser le vecteur 'right' pour déterminer le vecteur 'up' sans tenir compte de la direction entre la caméra et l'objet
        //const up = direction.clone().cross(right).normalize();

        // Calculer la position du label à droite et légèrement au-dessus de l'objet
        const distance = obj.scale.x * 1.5;
        //const labelPosition = obj.position.clone().add(right.multiplyScalar(distance)).add(up.multiplyScalar(distance / 2));


        let planetRadius = this.planets.find((planet: Planet) => planet.name === obj.name)?.radius;

        //label.position.y = obj.position.y + 0.5;
        //label.position.y += obj.scale.y * 0.5;

        label.position.y = obj.position.y;
        /**
        if(obj.name === 'Jupiter')
        console.log(planetRadius);

        if (planetRadius)
        label.position.y = obj.position.y + planetRadius;
        */

        label.position.copy(obj.position.clone());
        if (planetRadius)
        label.position.y = obj.position.y + planetRadius;
        //label.position.copy(labelPosition);
        label.lookAt(cameraPosition);

        }
      
    });
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
    this.updateLabels();
  }
}
