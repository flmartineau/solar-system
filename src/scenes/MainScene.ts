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
  Raycaster,
  AmbientLight
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export class MainScene {
  private scene: Scene;
  private camera: PerspectiveCamera;
  private renderer: WebGLRenderer;
  private sun: Mesh;
  private controls: OrbitControls;
  private raycaster: Raycaster;
  private mouse: Vector2;

  constructor(container: HTMLElement) {
    this.scene = new Scene();
    this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(this.renderer.domElement);

    this.camera.position.z = 5;
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.update();

    const light = new PointLight(0xffffff, 1, 0);
    light.position.set(0, 0, 0);
    this.scene.add(light);


    const ambientLight = new AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    const textureLoader = new TextureLoader();
    const sunTexture = textureLoader.load('../../assets/textures/sun.jpg');


    const sunMaterial = new MeshBasicMaterial({ map: sunTexture });
    const sunGeometry = new SphereGeometry(1, 32, 32);
    this.sun = new Mesh(sunGeometry, sunMaterial);
    this.scene.add(this.sun);

    this.raycaster = new Raycaster();
    this.mouse = new Vector2();

    window.addEventListener('mousemove', (event) => this.onMouseMove(event), false);
    window.addEventListener('resize', () => this.onWindowResize(), false);

    this.animate();
  }

  private animate(): void {
    requestAnimationFrame(() => this.animate());
    this.renderer.render(this.scene, this.camera);
    this.controls.update();
  }

  private onMouseMove(event: MouseEvent): void {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    const intersects = this.raycaster.intersectObjects([this.sun]);

    if (intersects.length > 0) {
      this.showSunInfo();
    } else {
      this.hideSunInfo();
    }
  }

  private onWindowResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  private showSunInfo(): void {
    const infoElement = document.getElementById('sun-info');
    if (infoElement) {
      infoElement.style.display = 'block';
    }
  }

  private hideSunInfo(): void {
    const infoElement = document.getElementById('sun-info');
    if (infoElement) {
      infoElement.style.display = 'none';
    }
  }
}
