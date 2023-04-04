import moment from "moment";

export abstract class DateHelper {
    
    static formatDate(date: Date): string {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    }

    static formatDateFromFormat(date: Date, format: string) {
       return (moment(date).format(format)); 
    }

    static getDateFromString(dateString: string, format: string): Date {
        return (moment(dateString, format).toDate());
    }


    static setTimeToDate(newTime: string, date: Date): Date {
        const newDate = moment(date).format('YYYY-MM-DD');
        const newDateWithTime = newDate + ' ' + newTime;
        return (moment(newDateWithTime, 'YYYY-MM-DD HH:mm:ss').toDate());
    }

}
