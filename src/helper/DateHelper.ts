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

    static getDeltaDaysBetweenDates(date1: Date, date2: Date): number {
        const momentDate1 = moment(date1);
        const momentDate2 = moment(date2);
        const diffMilliseconds = momentDate2.diff(momentDate1, 'milliseconds');
        return diffMilliseconds / (1000 * 60 * 60 * 24);
    }


}
