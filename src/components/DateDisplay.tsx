import React, { Component } from 'react';
import { TimeController } from '../controllers/TimeController';
import { UIController } from '../controllers/UIController';
import { DateHelper } from '../helper/DateHelper';

interface DateDisplayProps {
  timeController: TimeController;
  uiController: UIController;
}

class DateDisplay extends Component<DateDisplayProps> {
  private dateInputRef = React.createRef<HTMLInputElement>();

  componentDidMount() {
    if (this.dateInputRef.current) {
      this.dateInputRef.current.addEventListener('keypress', (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
          const newDate: Date | null = new Date(this.dateInputRef.current!.value);
          if (newDate) {
            this.props.timeController.currentDate = newDate;
          }
        }
      });
    }
  }

  componentDidUpdate() {
    this.updateDateTimeDisplay();
  }

  updateDateTimeDisplay = () => {
    const simulationSpeed: number = this.props.timeController.simulationSpeed;
    const currentDate: Date = this.props.timeController.currentDate;

    if (this.dateInputRef.current && simulationSpeed !== 0) {
      this.dateInputRef.current.value = DateHelper.formatDateFromFormat(currentDate, 'YYYY-MM-DDTHH:mm:ss');
    }
  };

  render() {
    return (
      <div id="current-date-time">
        <div id="date-container">
          <input ref={this.dateInputRef} id="current-date-time-picker" type="datetime-local" step="1" />
        </div>
      </div>
    );
  }
}

export default DateDisplay;
