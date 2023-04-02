import { MainScene } from '../scenes/MainScene';

export class UIController {
  private mainScene: MainScene;

  constructor(mainScene: MainScene) {
    this.mainScene = mainScene;
  }

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
