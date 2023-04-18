import { MainScene } from '../scenes/MainScene';
import { ControlPanel } from '../components/ControlPanel';
import { InfoPanel } from '../components/InfoPanel';
import { Toolbar } from '../components/Toolbar';
import { DateDisplay } from '../components/DateDisplay';
import { BodiesList } from '../components/BodiesList';

/**
 * User interface controller for the solar system application.
 */
export class UIController {

  //UI components
  private _controlPanel: ControlPanel;
  private _infoPanel: InfoPanel;
  private _toolbar: Toolbar;
  private _dateDisplay: DateDisplay;
  private _bodiesList: BodiesList;

  /**
   * Create a UIController.
   * @param {MainScene} mainScene - The main scene object.
   */
  constructor(mainScene: MainScene) {
    this._controlPanel = new ControlPanel(mainScene.timeController, mainScene.audioController);
    this._infoPanel = new InfoPanel(mainScene, mainScene.timeController, this);
    this._toolbar = new Toolbar(mainScene, this);
    this._bodiesList = new BodiesList(mainScene, this.toolbar);
    this._dateDisplay = new DateDisplay(mainScene.timeController, this);
  }

  get controlPanel(): ControlPanel {
    return this._controlPanel;
  }

  get infoPanel(): InfoPanel {
    return this._infoPanel;
  }

  get toolbar(): Toolbar {
    return this._toolbar;
  }

  get dateDisplay(): DateDisplay {
    return this._dateDisplay;
  }

  get bodiesList(): BodiesList {
    return this._bodiesList;
  }
}
