import { Clock } from 'three';
import { CelestialBody } from '../components/celestial/CelestialBody';
import { Planet } from '../components/celestial/Planet';
import { Star } from '../components/celestial/Star';
import { Sun } from '../components/celestial/Sun';
import { Earth } from '../components/celestial/planets/Earth';
import { DateHelper } from '../helper/DateHelper';
import { MainScene } from '../scenes/MainScene';
import { PlanetOrbitalPeriod } from 'astronomy-engine';

export class TimeController {
  private planets: Array<Planet>;
  private sun: Star | null;
  private currentDate: Date;
  private simulationSpeed: number;
  private isPlaying: boolean;
  private clock: Clock;
  private refreshOrbitLineTimer: number;

  private mainScene: MainScene;

  constructor(mainScene: MainScene) {
    this.mainScene = mainScene;
    this.planets = new Array<Planet>();
    this.sun = null;
    this.currentDate = new Date();
    this.simulationSpeed = 1;
    this.isPlaying = true;
    this.clock = new Clock();
    this.refreshOrbitLineTimer = 0;
  }

  getElapsedTime(): number {
    return this.clock.getElapsedTime();
  }

  getDeltaTime(): number {
    return this.clock.getDelta();
  }

  setPlanets(planets: Array<Planet>): void {
    this.planets = planets;
  }

  setSun(sun: Star): void {
    this.sun = sun;
  }

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

  public update(): void {
    if (!this.isPlaying) {
      this.mainScene.getCelestialObjects().forEach((celestialBody: CelestialBody) => {
        celestialBody.updateLabel();
      });
      return;
    }
  
    const deltaTime = this.getDeltaTime();
    const elapsedTime = deltaTime * 1000 * this.simulationSpeed;
  
    this.currentDate = new Date(this.currentDate.getTime() + elapsedTime);
    this.refreshOrbitLineTimer += deltaTime * this.simulationSpeed;

    if (this.sun && this.sun.rotationSpeed)
      this.sun.rotateY(this.sun.rotationSpeed * deltaTime * this.simulationSpeed);
  
    this.mainScene.getCelestialObjects().forEach((celestialBody: CelestialBody) => {
      if (celestialBody instanceof Planet) {
        celestialBody.updateOrbit();
        celestialBody.updateRotation();


        celestialBody.lastOrbitLineUpdateTime += elapsedTime;

        const orbitalPeriod = PlanetOrbitalPeriod(celestialBody.body) * 24 * 60 * 60 * 1000;

        // Check if it's time to update the orbit line
        if (celestialBody.lastOrbitLineUpdateTime >= orbitalPeriod) {
          if (celestialBody instanceof Earth) 
          console.log('refreshing orbit line');
          celestialBody.refreshOrbitLine();
          celestialBody.lastOrbitLineUpdateTime = 0;
      }



      }
      celestialBody.updateLabel();
    });
  
    
  
    this.mainScene.uiController.updateDateDisplay();
  
    this.mainScene.uiController.updateTimeDisplay();
  
    this.mainScene.uiController.updateSpeedDisplay();
  
    this.clock.elapsedTime = 0;
  }
  

  public getCurrentDate(): Date {
    return this.currentDate;
  }

  public getSimulationSpeed(): number {
    return this.simulationSpeed;
  }

  public setCurrentDate(currentDate: Date): void {
    this.togglePlayPause();
    this.currentDate = currentDate;
    this.update();

    this.togglePlayPause();
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}
