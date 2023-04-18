import { KM_PER_AU, NextGlobalSolarEclipse, NextLunarEclipse } from "astronomy-engine";
import { TimeController } from "../controllers/TimeController";
import { UIController } from "../controllers/UIController";
import { TemplateHelper } from "../helper/TemplateHelper";
import { DateHelper } from "../helper/DateHelper";
import { Planet } from "../models/Planet";
import { Moon } from "../models/Moon";
import { MainScene } from "../scenes/MainScene";



export class InfoPanel {

    private _mainScene: MainScene;
    private _timeController: TimeController;
    private _uiController: UIController;

    /**
     * Create a new InfoPanel.
     */
    constructor(mainScene: MainScene, timeController: TimeController, uiController: UIController) {
        this._mainScene = mainScene;
        this._timeController = timeController;
        this._uiController = uiController;
        TemplateHelper.setTemplate('info-container', 'info.html').then(() => {
            this.addEventListeners();
        });
    }


    /**
     * Handles the click events for the info panel.
     */
    private addEventListeners(): void {
        document.getElementById('info-next-lunar-eclipse-button')?.addEventListener('click', () => {
            this._timeController.currentDate = NextLunarEclipse(this._timeController.currentDate).peak.date;
            this._uiController.controlPanel.updateCurrentDateButton(false);
        });

        document.getElementById('info-next-solar-eclipse-button')?.addEventListener('click', () => {
            this._timeController.currentDate = NextGlobalSolarEclipse(this._timeController.currentDate).peak.date;
            this._uiController.controlPanel.updateCurrentDateButton(false);
        });
    }


    /**
      * Show information about a celestial object.
      * @param {any} celestialObject - The celestial object to show information about.
      */
    public showInfo(celestialObject: any): void {
        const infoElement: HTMLElement | null = document.getElementById('info');

        if (infoElement) {

            let infoName: HTMLElement = document.getElementById('info-name') as HTMLElement;
            infoName.innerHTML = celestialObject.name;

            let infoMass: HTMLElement = document.getElementById('info-mass-value') as HTMLElement;
            infoMass.innerHTML = `${celestialObject.mass} kg`;

            let infoTemperature: HTMLElement = document.getElementById('info-temperature-value') as HTMLElement;
            switch (this._uiController.toolbar.settingsModal.getTemperatureUnit()) {
                case 'celsius':
                    infoTemperature.innerHTML = `${Math.round((celestialObject.temperature - 273.15) * 100) / 100} °C`;
                    break;
                case 'fahrenheit':
                    infoTemperature.innerHTML = `${Math.round(((celestialObject.temperature - 273.15) * 9 / 5 + 32) * 100) / 100} °F`;
                    break;
                default:
                    infoTemperature.innerHTML = `${celestialObject.temperature} K`;
                    break;
            }

            let infoDistanceFromSun: HTMLElement = document.getElementById('info-distance-sun-value') as HTMLElement;
            infoDistanceFromSun.innerHTML =
                this._uiController.toolbar.settingsModal.getDistanceUnit() == 'metric' ?
                    `${celestialObject.distanceToSun} km` :
                    `${Math.round((celestialObject.distanceToSun / KM_PER_AU) * 1000) / 1000} AU`;
            document.getElementById('info-distance-sun')!.style.display = (celestialObject instanceof Planet) ? 'flex' : 'none';

            let infoDistanceFromPlanet: HTMLElement = document.getElementById('info-distance-planet-value') as HTMLElement;
            infoDistanceFromPlanet.innerHTML = this._uiController.toolbar.settingsModal.getDistanceUnit() == 'metric' ?
                `${celestialObject.distanceToPlanet} km` :
                `${Math.round((celestialObject.distanceToPlanet / KM_PER_AU) * 1000) / 1000} AU`;
            document.getElementById('info-distance-sun')!.style.display = (celestialObject instanceof Planet) ? 'flex' : 'none';
            document.getElementById('info-distance-planet')!.style.display = (celestialObject instanceof Moon) ? 'flex' : 'none';


            let infoOrbitalPeriod: HTMLElement = document.getElementById('info-orbital-period-value') as HTMLElement;
            infoOrbitalPeriod.innerHTML = DateHelper.getDurationText(celestialObject.orbitalPeriod);
            document.getElementById('info-orbital-period')!.style.display = (celestialObject instanceof Planet) ? 'flex' : 'none';

            let infoRotationPeriod: HTMLElement = document.getElementById('info-rotation-period-value') as HTMLElement;
            infoRotationPeriod.innerHTML = `${Math.round(celestialObject.rotationPeriod * 1000) / 1000} days`;

            let infoNextLunarEclipse: HTMLButtonElement = document.getElementById('info-next-lunar-eclipse') as HTMLButtonElement;
            infoNextLunarEclipse.style.display = (celestialObject.name === 'Moon') ? 'flex' : 'none';

            let infoNextSolarEclipse: HTMLButtonElement = document.getElementById('info-next-solar-eclipse') as HTMLButtonElement;
            infoNextSolarEclipse.style.display = (celestialObject.name === 'Earth') ? 'flex' : 'none';

            infoElement.style.display = 'block';

            let infoHeader: HTMLElement = document.getElementById('info-header') as HTMLElement;

            infoHeader.setAttribute('style', `background-image: url('./assets/images/bodies/${celestialObject.name.toLowerCase()}.png');`);
        }

    }

    /**
     * Hide the information element.
     */
    public hideInfo(): void {
        if (this._mainScene.selectedObject !== null)
            return;
        const infoElement = document.getElementById('info');
        if (infoElement) {
            infoElement.style.display = 'none';
        }
    }
}