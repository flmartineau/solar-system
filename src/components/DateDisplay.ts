import { TimeController } from "../controllers/TimeController";
import { UIController } from "../controllers/UIController";
import { DateHelper } from "../helper/DateHelper";
import { TemplateHelper } from "../helper/TemplateHelper";


export class DateDisplay {


    private _timeController: TimeController;
    private _uiController: UIController;


    /**
     * Create a new DateDisplay.
     */
    constructor(timeController: TimeController, uiController: UIController) {
        this._timeController = timeController;
        this._uiController = uiController;
        TemplateHelper.setTemplate('current-date-container', 'current-date.html').then(() => {
            this.addEventListeners();
        });
    }

    /**
    * Handles the click events for the date inputs.
    */
    private addEventListeners(): void {
        document.getElementById('current-date-time-picker')?.addEventListener('keypress', 
        (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
              let newDate: Date | null = new Date((<HTMLInputElement>document.getElementById('current-date-time-picker')).value);
              if (newDate) {
                this._timeController.currentDate = newDate;
                this._uiController.controlPanel.updateCurrentDateButton(false);
              }
            }
          });
    }

    public updateDateTimeDisplay() {
        let simulationSpeed: number = this._timeController.simulationSpeed;
        let currentDate: Date = this._timeController.currentDate;
        const currentPicker = document.getElementById('current-date-time-picker') as HTMLInputElement;
        if (currentPicker && simulationSpeed !== 0) {
          currentPicker.value = DateHelper.formatDateFromFormat(currentDate, 'YYYY-MM-DDTHH:mm:ss');
        }
      }



}