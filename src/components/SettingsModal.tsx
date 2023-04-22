import React from "react";


interface SettingsModalProps {
}

interface SettingsModalState {
    display: boolean;
    distanceUnit: string;
    temperatureUnit: string;
}

class SettingsModal extends React.Component<SettingsModalProps, SettingsModalState> {
    constructor(props: SettingsModalProps) {
        super(props);

        this.state = {
            display: false,
            distanceUnit: this.loadSettings(['distance-unit'])['distance-unit'],
            temperatureUnit: this.loadSettings(['temperature-unit'])['temperature-unit']
        };
    }

    get distanceUnit(): string {
        return this.state.distanceUnit ? this.state.distanceUnit : 'metric';
    }

    get temperatureUnit(): string {
        return this.state.temperatureUnit ? this.state.temperatureUnit : 'kelvin';
    }

    /**
    * Load the settings from local storage.
    * @param keys The keys to load.
    * @returns The settings.
    */
    loadSettings = (keys: string[]): Record<string, string> => {
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
     * Save the settings to local storage.
     * @param key The key to save.
     * @param value The value to save.
     */
    saveSettings = (key: string, value: string) => {
        if (key == 'distance-unit') {
            this.setState({distanceUnit: value});
        } else if (key == 'temperature-unit') {
            this.setState({temperatureUnit: value});
        }
       localStorage.setItem(key, value);
    }

    /**
     * Hide the modal.
     */
    hide = (): void => {
        this.setState({ display: false });
    }

    /**
     * Show the modal.
     */
    show = (): void => {
        this.setState({ display: true });
    }


    render() {
        return (
            <div className="settings-modal" id="settings-modal"
            style={{ display: this.state.display ? 'block' : 'none' }}>
                <div className="settings-modal-content">
                    <div className="settings-modal-content-header">
                        <span className="settings-modal-close"
                            onClick={this.hide}>&times;</span>
                        <span className="settings-modal-title"><h2>SETTINGS</h2></span>
                    </div>
                    <div className="settings-modal-content-body">
                        <div className="settings-modal-item">
                            <div className="seetings-modal-item-title">
                                <h3>Distance units :</h3>
                            </div>
                            <div className="toggle">
                                <input type="radio"
                                    id="distance-units-metric"
                                    name="distance-units"
                                    value="metric"
                                    checked={this.loadSettings(['distance-unit'])['distance-unit'] != 'au'}
                                    onChange={() => this.saveSettings('distance-unit','metric')}/>
                                <label htmlFor="distance-units-metric">Metric</label>
                                <input type="radio"
                                    id="distance-units-au"
                                    name="distance-units"
                                    value="AU"
                                    checked={this.loadSettings(['distance-unit'])['distance-unit'] == 'au'}
                                    onChange={() => this.saveSettings('distance-unit','au')}/>
                                <label htmlFor="distance-units-au">AU</label>
                            </div>
                        </div>
                        <div className="settings-modal-item">
                            <div className="seetings-modal-item-title">
                                <h3>Temperature units :</h3>
                            </div>
                            <div className="toggle">
                                <input type="radio"
                                    id="temperature-units-celsius"
                                    name="temperature-units"
                                    value="celsius"
                                    checked={this.loadSettings(['temperature-unit'])['temperature-unit'] === 'celsius'}
                                    onChange={() => this.saveSettings('temperature-unit', 'celsius')}/>
                                <label htmlFor="temperature-units-celsius">°C</label>
                                <input
                                    type="radio"
                                    id="temperature-units-fahrenheit"
                                    name="temperature-units"
                                    value="fahrenheit"
                                    checked={this.loadSettings(['temperature-unit'])['temperature-unit'] === 'fahrenheit'}
                                    onChange={() => this.saveSettings('temperature-unit','fahrenheit')}/>
                                <label htmlFor="temperature-units-fahrenheit">°F</label>
                                <input type="radio"
                                    id="temperature-units-kelvin"
                                    name="temperature-units"
                                    value="kelvin"
                                    checked={this.loadSettings(['temperature-unit'])['temperature-unit'] !== 'fahrenheit' &&
                                        this.loadSettings(['temperature-unit'])['temperature-unit'] !== 'celsius'}
                                        onChange={() => this.saveSettings('temperature-unit','kelvin')}/>
                                <label htmlFor="temperature-units-kelvin">K</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default SettingsModal;