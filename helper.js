const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
};

const getDateOfToday = () => {
    let date = new Date();
    let dateDay = date.getDate();
    let dateMonth = date.getMonth() + 1; //zero based
    let dateYear = date.getFullYear();
    return `${dateDay}_${dateMonth}_${dateYear}`;
};

module.exports = {
    capitalize,
    getDateOfToday
};
