import { MainScene } from '../scenes/MainScene';
import React from 'react';
import DateDisplay from '../components/DateDisplay';
import InfoPanel from '../components/InfoPanel';
import ControlPanel from '../components/ControlPanel';
import Toolbar from '../components/Toolbar';
import SettingsModal from '../components/SettingsModal';
import BodiesList from '../components/BodiesList';
import { CelestialBody } from '../models/CelestialBody';
import { Planet } from '../models/Planet';
import LoadingScreen from '../components/LoadingScreen';


/**
 * User interface controller for the solar system application.
 */
export class UIController {

  private _mainScene: MainScene;

  //UI components
  public toolbarComponent: React.RefObject<Toolbar>;
  public dateDisplayComponent: React.RefObject<DateDisplay>;
  public infoPanelComponent: React.RefObject<InfoPanel>;
  public controlPanelComponent: React.RefObject<ControlPanel>;
  public settingsModalComponent: React.RefObject<SettingsModal>;
  public bodiesListComponent: React.RefObject<BodiesList>;
  public loadingScreenComponent: React.RefObject<LoadingScreen>;

  /**
   * Create a UIController.
   */
  constructor(mainScene: MainScene) {
    this._mainScene = mainScene;
    this.dateDisplayComponent = React.createRef<DateDisplay>();
    this.infoPanelComponent = React.createRef<InfoPanel>();
    this.controlPanelComponent = React.createRef<ControlPanel>();
    this.toolbarComponent = React.createRef<Toolbar>();
    this.settingsModalComponent = React.createRef<SettingsModal>();
    this.bodiesListComponent = React.createRef<BodiesList>();
    this.loadingScreenComponent = React.createRef<LoadingScreen>();
  }

  get bodiesList(): BodiesList {
    return this.bodiesListComponent.current!;
  }

  get loadingScreen(): LoadingScreen {
    return this.loadingScreenComponent.current!;
  }

  getCelestialBodyList(): Planet[] {
    return this._mainScene.planets;
  }
}
