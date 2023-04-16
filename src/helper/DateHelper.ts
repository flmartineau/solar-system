import moment from "moment";

export abstract class DateHelper {

    static formatDateFromFormat(date: Date, format: string) {
        return (moment(date).format(format));
    }

    static getDateFromString(dateString: string, format: string): Date {
        return (moment(dateString, format).toDate());
    }

    static setTimeToDate(newTime: string, date: Date): Date {
        const newDate: string = moment(date).format('YYYY-MM-DD');
        const newDateWithTime: string = newDate + ' ' + newTime;
        return (moment(newDateWithTime, 'YYYY-MM-DD HH:mm:ss').toDate());
    }

    static getDurationText(durationInDays: number): string {
        const HOURS_IN_DAY = 24;
        const DAYS_IN_YEAR = 365.25;

        let remainingDays: number = durationInDays;

        const years: number = Math.floor(remainingDays / DAYS_IN_YEAR);
        remainingDays %= DAYS_IN_YEAR;

        const days: number = Math.floor(remainingDays);
        remainingDays %= 1;

        const hours: number = Math.floor(remainingDays * HOURS_IN_DAY);
        remainingDays %= (1 / HOURS_IN_DAY);

        let result: string = '';

        if (years > 0) {
            result += years === 1 ? `${years} yr ` : `${years} yrs `;
        }
        if (days > 0) {
            result += `${days} d `;
        }
        if (hours > 0) {
            result += `${hours} h`;
        }

        return result.trim();
    }


}
