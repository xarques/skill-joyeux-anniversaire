const moment = require('moment-timezone'); // will help us do all the dates math while considering the moment-timezone
const util = require('./util');

const getBirthdayData = (day, month, year, timezone) => {
    const today = moment().tz(timezone).startOf('day');
    const wasBorn = moment(`${month}/${day}/${year}`, 'MM/DD/YYYY').tz(timezone).startOf('day');
    const nextBirthday = moment(`${month}/${day}/${today.year()}`, 'MM/DD/YYYY').tz(timezone).startOf('day');
    if (today.isAfter(nextBirthday)) {
        nextBirthday.add(1, 'years');
    }
    const age = today.diff(wasBorn, 'years');
    const daysAlive = today.diff(wasBorn, 'days');
    const daysUntilBirthday = nextBirthday.startOf('day').diff(today, 'days'); //same day returns 0
    
    return {
        daysAlive,
        daysUntilBirthday,
        age
    }
};

const createBirthdayReminder = (daysUntilBirthday, timezone, locale, message) => {
    moment.locale(locale);
    const createMoment = moment().tz(timezone);
    let triggerMoment = createMoment.startOf('day').add(daysUntilBirthday, 'days');
    if (daysUntilBirthday === 0) {
        triggerMoment = createMoment.startOf('day').add(1, 'years'); // reminder created on the day of birthday will trigger next year
    }
    console.log('Reminder schedule', triggerMoment.format('YYYY-MM-DDTHH:mm:00.000'));
    
    return util.createReminder(createMoment, triggerMoment, timezone, locale, message);
}

module.exports = {
    getBirthdayData,
    createBirthdayReminder
}