import { MainScene } from '../scenes/MainScene';
import { BodiesList } from '../components/BodiesList';
import React from 'react';
import DateDisplay from '../components/DateDisplay';
import InfoPanel from '../components/InfoPanel';
import ControlPanel from '../components/ControlPanel';
import Toolbar from '../components/Toolbar';
import SettingsModal from '../components/SettingsModal';

/**
 * User interface controller for the solar system application.
 */
export class UIController {

  //UI components
  public toolbarComponent: React.RefObject<Toolbar>;
  public dateDisplayComponent: React.RefObject<DateDisplay>;
  public infoPanelComponent: React.RefObject<InfoPanel>;
  public controlPanelComponent: React.RefObject<ControlPanel>;
  public settingsModalComponent: React.RefObject<SettingsModal>;
  private _bodiesList: BodiesList;


  private _showInfo: boolean = false;

  /**
   * Create a UIController.
   * @param {MainScene} mainScene - The main scene object.
   */
  constructor(mainScene: MainScene) {
    this._bodiesList = new BodiesList(mainScene);
    this.dateDisplayComponent = React.createRef<DateDisplay>();
    this.infoPanelComponent = React.createRef<InfoPanel>();
    this.controlPanelComponent = React.createRef<ControlPanel>();
    this.toolbarComponent = React.createRef<Toolbar>();
    this.settingsModalComponent = React.createRef<SettingsModal>();
  }

  set showInfo(showInfo: boolean) {
    this._showInfo = showInfo;
  }

  get showInfo(): boolean {
    return this._showInfo;
  }

  get bodiesList(): BodiesList {
    return this._bodiesList;
  }
}
