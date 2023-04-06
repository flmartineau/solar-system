import { Clock } from 'three';
import { CelestialBody } from '../components/celestial/CelestialBody';
import { Planet } from '../components/celestial/Planet';
import { Star } from '../components/celestial/Star';
import { Earth } from '../components/celestial/planets/Earth';
import { MainScene } from '../scenes/MainScene';
import { PlanetOrbitalPeriod } from 'astronomy-engine';

export class TimeController {
  private currentDate: Date;
  private simulationSpeed: number;
  private isPlaying: boolean;
  private clock: Clock;

  private mainScene: MainScene;

  constructor(mainScene: MainScene) {
    this.mainScene = mainScene;
    this.currentDate = new Date();
    this.simulationSpeed = 1;
    this.isPlaying = true;
    this.clock = new Clock();
  }

  public getDeltaTime(): number {
    return this.clock.getDelta();
  }

  public togglePlayPause(): void {
    this.isPlaying = !this.isPlaying;
    this.simulationSpeed = 1;
    this.mainScene.getUIController().updateSpeedDisplay();
    this.mainScene.getUIController().togglePlayPauseButton();
  }

  public setSpeed(speed: number): void {
    if (!this.isPlaying) {
      this.togglePlayPause();
    }
    this.simulationSpeed = speed;
  }

  public update(): void {
    if (!this.isPlaying) {
      this.mainScene.getCelestialObjects().forEach((celestialBody: CelestialBody) => {
        celestialBody.updateLabel();
      });
      return;
    }

    const deltaTime: number = this.getDeltaTime();
    const elapsedTime: number = deltaTime * 1000 * this.simulationSpeed;

    this.currentDate = new Date(this.currentDate.getTime() + elapsedTime);

    this.mainScene.getCelestialObjects().forEach((celestialBody: CelestialBody) => {
      if (celestialBody instanceof Planet) {
        celestialBody.updateOrbit();
        celestialBody.updateRotation();
        celestialBody.setLastOrbitLineUpdateTime(celestialBody.getLastOrbitLineUpdateTime() + elapsedTime);

        const orbitalPeriod: number = PlanetOrbitalPeriod(celestialBody.getBody()) * 24 * 60 * 60 * 1000;

        // Check if it's time to update the orbit line
        if (celestialBody.getLastOrbitLineUpdateTime() >= orbitalPeriod) {
          if (celestialBody instanceof Earth)
            celestialBody.refreshOrbitLine();
          celestialBody.setLastOrbitLineUpdateTime(0);
        }
      } else if (celestialBody instanceof Star) {
        celestialBody.rotateY(celestialBody.getRotationSpeed() * deltaTime * this.simulationSpeed);
      }
      celestialBody.updateLabel();
    });

    this.mainScene.getUIController().updateDateDisplay();
    this.mainScene.getUIController().updateTimeDisplay();
    this.mainScene.getUIController().updateSpeedDisplay();

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
