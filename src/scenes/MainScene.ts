import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  PointLight,
  Mesh,
  Vector2,
  Raycaster,
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

export class MainScene {
  private scene: Scene;
  private camera: PerspectiveCamera;
  private renderer: WebGLRenderer;

  private cameraController: CameraController;

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

  private raycaster: Raycaster;
  private mouse: Vector2;
  private skybox: CubeTexture;

  private selectedObject: Mesh | null;
  private isPlaying: boolean;
  private currentDate: Date;



  constructor(container: HTMLElement) {
    this.scene = new Scene();
    this.isPlaying = true;
    this.currentDate = new Date();
    this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.cameraController = new CameraController(this.camera, this.renderer);

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


    this.raycaster = new Raycaster();
    this.mouse = new Vector2();

    window.addEventListener('mousemove', (event) => this.onMouseMove(event), false);
    window.addEventListener('resize', () => this.onWindowResize(), false);
    document.getElementById('play-pause')?.addEventListener('click', () => this.togglePlayPause());
    document.getElementById('forward-x10')?.addEventListener('click', () => this.setSpeed(10));
    document.getElementById('forward-x100')?.addEventListener('click', () => this.setSpeed(100));
    document.getElementById('forward-x1000')?.addEventListener('click', () => this.setSpeed(1000));
    document.getElementById('backward-x10')?.addEventListener('click', () => this.setSpeed(-10));
    document.getElementById('backward-x100')?.addEventListener('click', () => this.setSpeed(-100));
    document.getElementById('backward-x1000')?.addEventListener('click', () => this.setSpeed(-1000));


    this.animate();
  }

  private simulationSpeed: number = 1;

  private togglePlayPause(): void {
    this.isPlaying = !this.isPlaying;
    this.simulationSpeed = 1;
    const playPauseButton = document.getElementById('play-pause');
    if (playPauseButton) {
      playPauseButton.textContent = this.isPlaying ? 'Pause' : 'Play';
    }
  }

  private setSpeed(speed: number): void {
    if (!this.isPlaying) {
      this.togglePlayPause();
    }
    this.simulationSpeed = this.simulationSpeed * speed;
  }

  private onClick(event: MouseEvent): void {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    const celestialObjects = [this.sun, this.mercury, this.venus, this.earth, this.mars, this.jupiter, this.saturn, this.uranus, this.neptune]; // Add more planets to this array as needed
    const intersects = this.raycaster.intersectObjects(celestialObjects);

    if (intersects.length > 0) {
      const object = intersects[0].object;
      this.selectedObject = object as Mesh;
      this.centerCameraOnObject(this.selectedObject);
    }
  }

  private centerCameraOnObject(object: Mesh): void {
    this.cameraController.centerCameraOnObject(object);
  }

  private animate(): void {
    requestAnimationFrame(() => this.animate());
    const deltaTime = 0.016; // Use a fixed time step or calculate the elapsed time since the last frame

    if (this.isPlaying) {
      this.sun.rotation.y += this.sun.rotationSpeed * this.simulationSpeed * deltaTime;

      // Update the current date based on the simulation speed
      const elapsedTime = deltaTime * 1000 * this.simulationSpeed; // Multiply by 1000 to convert seconds to milliseconds
      this.currentDate = new Date(this.currentDate.getTime() + elapsedTime);

      this.planets.forEach((planet: Planet) => {

        planet.rotateY(planet.rotationSpeed * deltaTime * this.simulationSpeed);
        //planet.rotation.y += planet.rotationSpeed * this.simulationSpeed * deltaTime;
        planet.updateOrbit(deltaTime, this.simulationSpeed);
      });

      

      // Display the updated date in the HTML element
      const dateElement = document.getElementById('current-date');
      if (dateElement) {
        dateElement.textContent = this.formatDate(this.currentDate);

      }
    }

    this.cameraController.update();


    this.renderer.render(this.scene, this.camera);


  }

  private formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Les mois sont de 0 à 11, donc nous ajoutons 1
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  }


  private onMouseMove(event: MouseEvent): void {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    const intersects = this.raycaster.intersectObjects([this.sun, this.mercury, this.venus, this.earth,
    this.mars, this.jupiter, this.saturn, this.uranus, this.neptune]);


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
