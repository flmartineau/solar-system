import { MainScene } from '../scenes/MainScene';
import { ControlPanel } from '../components/ControlPanel';
import { Toolbar } from '../components/Toolbar';
import { BodiesList } from '../components/BodiesList';
import React from 'react';
import DateDisplay from '../components/DateDisplay';
import  InfoPanel  from '../components/InfoPanel';
/**
 * User interface controller for the solar system application.
 */
export class UIController {

  //UI components
  private _controlPanel: ControlPanel;
  private _toolbar: Toolbar;
  public dateDisplayComponent: React.RefObject<DateDisplay>;
  public infoPanelComponent: React.RefObject<InfoPanel>;
  private _bodiesList: BodiesList;


  private _showInfo: boolean = false;

  /**
   * Create a UIController.
   * @param {MainScene} mainScene - The main scene object.
   */
  constructor(mainScene: MainScene) {
    this._controlPanel = new ControlPanel(mainScene.timeController, mainScene.audioController);
    this._toolbar = new Toolbar(mainScene, this);
    this._bodiesList = new BodiesList(mainScene, this.toolbar);
    this.dateDisplayComponent = React.createRef<DateDisplay>();
    this.infoPanelComponent = React.createRef<InfoPanel>();
  }

  set showInfo(showInfo: boolean) {
    this._showInfo = showInfo;
  }

  get showInfo(): boolean {
    return this._showInfo;
  }

  get controlPanel(): ControlPanel {
    return this._controlPanel;
  }

  get toolbar(): Toolbar {
    return this._toolbar;
  }

  get bodiesList(): BodiesList {
    return this._bodiesList;
  }
}
