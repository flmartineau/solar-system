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

export class MainScene {
  private scene: Scene;
  public camera: PerspectiveCamera;
  public renderer: WebGLRenderer;

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
    this.mouseEvents = new MouseEvents(this);

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

    this.animate();
  }

  private simulationSpeed: number = 1;

  public togglePlayPause(): void {
    this.isPlaying = !this.isPlaying;
    this.simulationSpeed = 1;
    const playPauseButton = document.getElementById('play-pause');
    if (playPauseButton) {
      playPauseButton.textContent = this.isPlaying ? 'Pause' : 'Play';
    }
  }

  public setSpeed(speed: number): void {
    if (!this.isPlaying) {
      this.togglePlayPause();
    }
    this.simulationSpeed = this.simulationSpeed * speed;
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

  // Helper function to display information
  public showInfo(celestialObject: any): void {
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

  public hideInfo(): void {
    const infoElement = document.getElementById('info');
    if (infoElement) {
      infoElement.style.display = 'none';
    }
  }
}
