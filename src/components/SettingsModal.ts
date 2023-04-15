import { TemplateHelper } from "../helper/TemplateHelper";

export class SettingsModal {
    private _settingsModal?: HTMLElement;

    /**
     * Create a new SettingsModal.
     */
    constructor() {
        TemplateHelper.setTemplate('settings-modal-container', 'settings-modal.html').then(() => {
            this._settingsModal = document.getElementById('settings-modal')!;
            this.hide();

            this.initModal();

            const settingsModalClose: Element = document.getElementsByClassName('settings-modal-close')[0];
            if (settingsModalClose) {
                settingsModalClose.addEventListener('click', () => this.hide());
            }

            const distanceUnitMetric: HTMLInputElement = document.getElementById('distance-units-metric') as HTMLInputElement;
            const distanceUnitUA: HTMLInputElement = document.getElementById('distance-units-au') as HTMLInputElement;
            if (distanceUnitMetric) {
                distanceUnitMetric.addEventListener('click', () => this.saveSettings({ 'distance-unit': 'metric' }));
            }
            if (distanceUnitUA) {
                distanceUnitUA.addEventListener('click', () => this.saveSettings({ 'distance-unit': 'au' }));
            }


            const temperatureUnitCelsius: HTMLInputElement = document.getElementById('temperature-units-celsius') as HTMLInputElement;
            const temperatureUnitFahrenheit: HTMLInputElement = document.getElementById('temperature-units-fahrenheit') as HTMLInputElement;
            const temperatureUnitKelvin: HTMLInputElement = document.getElementById('temperature-units-kelvin') as HTMLInputElement;
            if (temperatureUnitCelsius) {
                temperatureUnitCelsius.addEventListener('click', () => this.saveSettings({ 'temperature-unit': 'celsius' }));
            }
            if (temperatureUnitFahrenheit) {
                temperatureUnitFahrenheit.addEventListener('click', () => this.saveSettings({ 'temperature-unit': 'fahrenheit' }));
            }
            if (temperatureUnitKelvin) {
                temperatureUnitKelvin.addEventListener('click', () => this.saveSettings({ 'temperature-unit': 'kelvin' }));
            }
        })

    }

    /**
     * Initialize the modal with the saved settings.
     */
    private initModal(): void {
        const distanceUnitSetting: string = this.loadSettings(['distance-unit'])['distance-unit'];
        const distanceUnitMetric: HTMLInputElement = document.getElementById('distance-units-metric') as HTMLInputElement;
        const distanceUnitUA: HTMLInputElement = document.getElementById('distance-units-au') as HTMLInputElement;
        if (distanceUnitSetting) {
            distanceUnitMetric!.checked = distanceUnitSetting === 'metric';
            distanceUnitUA!.checked = distanceUnitSetting === 'au';
        } else {
            distanceUnitMetric!.checked = true;
        }

        const temperatureUnitSetting: string = this.loadSettings(['temperature-unit'])['temperature-unit'];
        const temperatureUnitCelsius: HTMLInputElement = document.getElementById('temperature-units-celsius') as HTMLInputElement;
        const temperatureUnitFahrenheit: HTMLInputElement = document.getElementById('temperature-units-fahrenheit') as HTMLInputElement;
        const temperatureUnitKelvin: HTMLInputElement = document.getElementById('temperature-units-kelvin') as HTMLInputElement;
        if (temperatureUnitSetting) {
            temperatureUnitCelsius!.checked = this.loadSettings(['temperature-unit'])['temperature-unit'] === 'celsius';
            temperatureUnitFahrenheit!.checked = this.loadSettings(['temperature-unit'])['temperature-unit'] === 'fahrenheit';
            temperatureUnitKelvin!.checked = this.loadSettings(['temperature-unit'])['temperature-unit'] === 'kelvin';
        } else {
            temperatureUnitKelvin!.checked = true;
        }

    }

    /**
     * Show the modal.
     */
    public show(): void {
        this._settingsModal!.style.display = 'block';
    }

    /**
     * Hide the modal.
     */
    public hide(): void {
        this._settingsModal!.style.display = 'none';
    }

    /**
     * Save the settings to local storage.
     * @param settings The settings to save. 
     */
    private saveSettings(settings: Record<string, string>) {
        for (const key in settings) {
            if (settings.hasOwnProperty(key)) {
                localStorage.setItem(key, settings[key]);
            }
        }
    }

    /**
     * Load the settings from local storage.
     * @param keys The keys to load.
     * @returns The settings.
     */
    private loadSettings(keys: string[]): Record<string, string> {
        const settings: Record<string, string> = {};

        keys.forEach(key => {
            const value = localStorage.getItem(key);
            if (value !== null) {
                settings[key] = value;
            }
        });

        return settings;
    }

    /**
     * Get the distance unit from local storage.
     * @returns the distance unit.
     */
    public getDistanceUnit(): string {
        const settingsValues: Record<string, string> = this.loadSettings(['distance-unit']);
        return settingsValues['distance-unit'];
    }

    /**
     * Get the temperature unit from local storage.
     * @returns the temperature unit.
     */
    public getTemperatureUnit(): string {
        const settingsValues: Record<string, string> = this.loadSettings(['temperature-unit']);
        return settingsValues['temperature-unit'];
    }



}
