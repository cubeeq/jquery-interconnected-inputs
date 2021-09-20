/*
 * @class InterconnectedInputs ~jquery-interconnected-inputs~ (https://github.com/cubeeq/jquery-interconnected-inputs)
 * @author Developped by cubeeq (https://github.com/cubeeq)
 * @license Licensed under MIT (https://github.com/cubeeq/jquery-interconnected-inputs/blob/master/LICENSE)
 */

export default class InterconnectedInputs {

    dateFrom;
    dateStart;
    dateEnd;

    coreFormat = 'YYYY/MM/DD';
    message = {
        default: 'Function getMessage must have one parameter.',
        jquery: 'Require: https://jquery.com.',
        datepicker: 'Require: https://jqueryui.com/datepicker',
        momentjs: 'Require: https://momentjs.com.',
        jqueryinst: 'The input value is not an jQuery object.',
    }


    constructor(options) {
        if (typeof options      !== 'object') options      = Object.create(null);
        if (typeof options.from !== 'object') options.from = Object.create(null);
        if (typeof options.to   !== 'object') options.to   = Object.create(null);

        this.disableDaysFormat = typeof options.disableDaysFormat !== 'undefined' ? options.disableDaysFormat : 'YYYY-MM-DD';
        this.disableDays = typeof options.disableDays !== 'undefined' ? options.disableDays : [];

        this.inputFrom = options.from.input;
        this.inputTo   = options.to.input;

        this.fromDaysDiff = typeof options.from.daysDiff !== 'undefined' ? options.from.daysDiff : 0;
        this.toDaysDiff   = typeof options.to.daysDiff   !== 'undefined' ? options.to.daysDiff   : 0;
        
        this.datepicker     = options.datepicker;
        this.datepickerFrom = options.from.datepicker;
        this.datepickerTo   = options.to.datepicker;
    }

    init() {
        const self = this;
        const datepicker = self.getDatepicker();
        const inputFrom  = self.getInputFrom();
        const inputTo    = self.getInputTo();

        // Check all dependencies
        self.checkDependencies();

        // Check if the input is of type object jQuery
        self.checkJQueryObj(inputFrom);
        self.checkJQueryObj(inputTo);

        // DatepickerFrom settings
        let datepickerFrom = {
            beforeShowDay: function(date) {
                // Date off, if in list
                return [ self.compareDisable(date) ]
            },
            onSelect: function (str, obj) {
                const diff = self.getFromDaysDiff();
                const date = self.createDate(
                    obj.selectedYear,
                    obj.selectedMonth,
                    obj.selectedDay
                );
                
                // Set dateFrom
                self.setDateFrom(self.calcDaysDiff(date, diff));

                // InputTo cleaning
                self.clearInput(inputTo);
            }
        }

        // DatepickerTo settings
        let datepickerTo = {
            beforeShowDay: function(date) {
                const dateFrom = self.getDateFrom();

                let result = true;

                self.setDateStart(dateFrom);

                if (dateFrom) self.setDateEnd(self.breakDay());

                if (dateFrom && self.getDateEnd() !== null) {
                    result = date < self.getDateEnd();
                }

                if (!dateFrom) result = self.compareDisable(date);
                
                if (date < dateFrom) result = false;
                
                return [ result ];
            }
        }

        // Inputs cleaning
        self.clearInput(inputFrom);
        self.clearInput(inputTo);

        // Add common datepicker settings
        datepickerFrom = self.pushObj(datepickerFrom, datepicker);
        datepickerTo   = self.pushObj(datepickerTo, datepicker);

        // Add settings for the from input
        datepickerFrom = self.pushObj(datepickerFrom, self.getDatepickerFrom());

        // Add settings for the to input
        datepickerTo   = self.pushObj(datepickerTo, self.getDatepickerTo());

        // Pin datepicker to inputs
        inputFrom.datepicker(datepickerFrom);
        inputTo.datepicker(datepickerTo);
    }

    checkJQueryObj(obj) {
        if (obj instanceof jQuery === false)
            throw new Error(this.getMessage('jqueryinst'));
    }

    checkDependencies() {
        if (typeof $            !== 'function') throw new Error(this.getMessage('jquery'));
        if (typeof jQuery       !== 'function') throw new Error(this.getMessage('jquery'));
        if (typeof $.datepicker !== 'object')   throw new Error(this.getMessage('datepicker'));
        if (typeof moment       !== 'function') throw new Error(this.getMessage('momentjs'));
    }

    compareDisable(date) {
        let string = this.getCoreFormatedDate(date);
        return this.formatedDisableDays().indexOf(string) == -1;
    }

    pushObj(obj, obj2) {
        for (const i in obj2) {
            obj[i] = obj2[i];
        }
        return obj;
    }

    breakDay() {
        const disabledDays = this.formatedDisableDays();
        const dateStart    = new Date(this.getDateStart());

        for (const i in disabledDays) {
            const date = new Date(disabledDays[i]);

            if (dateStart <= date) {
                date.setDate(date.getDate() + this.getToDaysDiff());
                return date;
            }
        }

        return false;
    }

    formatedDisableDays() {
        const dates  = this.getDisableDays();
        let arr = [];

        for (const i in dates) {
            arr[i] = this.convertDisableDaysToCoreFormat(dates[i]);
        }

        return arr.sort();
    }

    clearInput(obj) {
        obj.val('');
    }

    getCoreFormatedDate(date) {
        return moment(date).format(this.getCoreFormat());
    }

    convertDisableDaysToCoreFormat(str) {
        return moment(str, this.getDisableDaysFormat()).format(this.getCoreFormat());
    }

    calcDaysDiff(date, num) {
        return date.setDate(date.getDate() + num);
    }

    createDate(Year, Month, Day) {
        return new Date(Year, Month, Day);
    }
    
    getDateStart() {
        return this.dateStart;
    }
    
    getDateEnd() {
        return this.dateEnd;
    }

    getDateFrom() {
        return this.dateFrom;
    }
    
    getDisableDays() {
        return this.disableDays;
    }

    getDisableDaysFormat() {
        return this.disableDaysFormat;
    }

    getInputFrom() {
        return this.inputFrom;
    }

    getInputTo() {
        return this.inputTo;
    }

    getFromDaysDiff() {
        return this.fromDaysDiff;
    }

    getToDaysDiff() {
        return this.toDaysDiff;
    }

    getDatepicker() {
        return this.datepicker;
    }

    getDatepickerFrom() {
        return this.datepickerFrom;
    }

    getDatepickerTo() {
        return this.datepickerTo;
    }

    getCoreFormat() {
        return this.coreFormat;
    }

    getMessage(str) {
        return this.message[str];
    }
    
    setDateStart(date) {
        this.dateStart = date ? date : new Date();
    }

    setDateEnd(date) {
        this.dateEnd = date ? date : null;
    }

    setDateFrom(date) {
        this.dateFrom = date ? date : null;
    }

}