import { Label } from '../components/celestial/Label';
import { Planet } from '../components/celestial/Planet';
import { Star } from '../components/celestial/Star';
import { MainScene } from '../scenes/MainScene';

export class UIController {
  private mainScene: MainScene;

  constructor(mainScene: MainScene) {
    this.mainScene = mainScene;
  }

  public showInfo(celestialObject: any): void {
    const infoElement = document.getElementById('info');

    if (celestialObject instanceof Star) {
      if (infoElement) {
        infoElement.innerHTML = `
          <strong>Name:</strong> ${celestialObject.name}<br>
          <strong>Mass:</strong> ${celestialObject.mass} kg<br>
          <strong>Temperature:</strong> ${celestialObject.temperature} K
        `;
        infoElement.style.display = 'block';
      }

    } else if (celestialObject instanceof Planet) {
      if (infoElement) {
        infoElement.innerHTML = `
          <strong>Name:</strong> ${celestialObject.name}<br>
          <strong>Mass:</strong> ${celestialObject.mass} kg<br>
          <strong>Temperature:</strong> ${celestialObject.temperature} K<br>
          <strong>Distance From Sun:</strong> ${celestialObject.distanceToSun} AU
        `;
        infoElement.style.display = 'block';
      }

    }
  }

  public hideInfo(): void {
    if (this.mainScene.selectedObject !== null) 
      return;
    const infoElement = document.getElementById('info');
    if (infoElement) {
      infoElement.style.display = 'none';
    }
  }


  public toggleOrbitLines(): void {
    let orbitLinesVisible = false;
    this.mainScene.getPlanets().forEach((planet: Planet) => {
      planet.getOrbitLine().visible = !planet.getOrbitLine().visible;
      orbitLinesVisible = planet.getOrbitLine().visible;
    });
    const toggleOrbitsIcon = document.getElementById('toggleOrbits') as HTMLImageElement;
    if (toggleOrbitsIcon) {
      toggleOrbitsIcon.src = orbitLinesVisible ? '/assets/icons/orbit_lines_on.png' : '/assets/icons/orbit_lines_off.png';
    }
  }

  public toggleLabels(): void {
    let labelsVisible = false;

    this.mainScene.getLabels().forEach((label: Label) => {
      label.visible = !label.visible;
      labelsVisible = label.visible;
    });

    const toggleLabelsIcon = document.getElementById('toggleLabels') as HTMLImageElement;
    if (toggleLabelsIcon) {
      toggleLabelsIcon.src = labelsVisible ? '/assets/icons/planet_labels_on.png' : '/assets/icons/planet_labels_off.png';
    }
  }




}
