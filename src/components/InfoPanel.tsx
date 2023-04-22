import React from "react";
import { KM_PER_AU, NextGlobalSolarEclipse, NextLunarEclipse } from "astronomy-engine";
import { TimeController } from "../controllers/TimeController";
import { UIController } from "../controllers/UIController";
import { DateHelper } from "../helper/DateHelper";
import { Planet } from "../models/Planet";
import { Moon } from "../models/Moon";
import { MainScene } from "../scenes/MainScene";

interface InfoPanelProps {
  mainScene: MainScene;
  timeController: TimeController;
  uiController: UIController;
}

interface InfoPanelState {
  celestialObject: any;
}

class InfoPanel extends React.Component<InfoPanelProps, InfoPanelState> {

  constructor(props: InfoPanelProps) {
    super(props);

    this.state = {
      celestialObject: null
    };
  }


  setSelectedObject = (value: any) => {
    this.setState(() => ({
      celestialObject: value
    }));
  }


  handleNextLunarEclipse = () => {
    const { timeController, uiController } = this.props;
    timeController.currentDate = NextLunarEclipse(timeController.currentDate).peak.date;
    uiController.controlPanelComponent?.current?.updateCurrentDateButton(false);
  };

  handleNextSolarEclipse = () => {
    const { timeController, uiController } = this.props;
    timeController.currentDate = NextGlobalSolarEclipse(timeController.currentDate).peak.date;
    uiController.controlPanelComponent?.current?.updateCurrentDateButton(false);
  };

  getTemperatureText = () => {
    switch (this.props.uiController.toolbar.settingsModal.getTemperatureUnit()) {
      case 'celsius':
        return `${Math.round((this.state.celestialObject?.temperature - 273.15) * 100) / 100} °C`;
      case 'fahrenheit':
        return `${Math.round(((this.state.celestialObject?.temperature - 273.15) * 9 / 5 + 32) * 100) / 100} °F`;
      default:
        return `${this.state.celestialObject?.temperature} K`;
    }
  }


  getDistanceText = (distance: number) => {
    switch (this.props.uiController.toolbar.settingsModal.getDistanceUnit()) {
      case 'au':
        return `${Math.round((distance / KM_PER_AU) * 1000) / 1000} AU`;
      case 'metric':
      default:
        return `${distance} km`;
    }
  }


  render() {
    return (
      <div id="info" style={{ display: this.state.celestialObject !== null ? 'block' : 'none' }}>
        <div id="info-header" style={{ backgroundImage: `url('./assets/images/bodies/${this.state.celestialObject?.name.toLowerCase()}.png')` }}>
          <div className="info-element" id="info-name">
            <div id="info-name">{this.state.celestialObject?.name}</div>
          </div>
        </div>
        <div id="info-content">
          {/* Mass */}
          <div className="info-element" id="info-mass">
            <div id="info-mass-title">
              <strong>Mass:&nbsp;</strong>
            </div>
            <div id="info-mass-value">{`${this.state.celestialObject?.mass} kg`}</div>
          </div>
          {/* Temperature */}
          <div className="info-element" id="info-temperature">
            <div id="info-temperature-title">
              <strong>Temperature:&nbsp;</strong>
            </div>
            <div id="info-temperature-value">
              {this.getTemperatureText()}
            </div>
          </div>
          {/* Distance from Sun */}
          {this.state.celestialObject instanceof Planet && (
            <div className="info-element" id="info-distance-sun">
              <div id="info-distance-sun-title">
                <strong>Distance from Sun:&nbsp;</strong>
              </div>
              <div id="info-distance-sun-value">
                {this.getDistanceText(this.state.celestialObject?.distanceToSun)}
              </div>
            </div>
          )}
          {/* Distance from Planet */}
          {this.state.celestialObject instanceof Moon && (
            <div className="info-element" id="info-distance-planet">
              <div id="info-distance-planet-title">
                <strong>Distance from Planet:&nbsp;</strong>
              </div>
              <div id="info-distance-planet-value">
                {this.getDistanceText(this.state.celestialObject?.distanceToPlanet)}
              </div>
            </div>
          )}
          {/* Orbital Period */}
          {this.state.celestialObject instanceof Planet && (
            <div className="info-element" id="info-orbital-period">
              <div id="info-orbital-period-title">
                <strong>Orbital Period:&nbsp;</strong>
              </div>
              <div id="info-orbital-period-value">
                {DateHelper.getDurationText(this.state.celestialObject?.orbitalPeriod)}
              </div>
            </div>
          )}
          {/* Rotation Period */}
          <div className="info-element" id="info-rotation-period">
            <div id="info-rotation-period-title">
              <strong>Rotation Period:&nbsp;</strong>
            </div>
            <div id="info-rotation-period-value">
              {`${Math.round(this.state.celestialObject?.rotationPeriod * 1000) / 1000} days`}
            </div>
          </div>
          {/* Next Lunar Eclipse */}
          {this.state.celestialObject?.name === "Moon" && (
            <div className="info-element" id="info-next-lunar-eclipse">
              <button className="info-button" id="info-next-lunar-eclipse-button" onClick={this.handleNextLunarEclipse}>
                Go to next lunar eclipse
              </button>
            </div>
          )}
          {/* Next Solar Eclipse */}
          {this.state.celestialObject?.name === "Earth" && (
            <div className="info-element" id="info-next-solar-eclipse">
              <button className="info-button" id="info-next-solar-eclipse-button" onClick={this.handleNextSolarEclipse}>
                Go to next solar eclipse
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };
}

export default InfoPanel;

