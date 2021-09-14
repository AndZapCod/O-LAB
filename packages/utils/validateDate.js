const moment = require("moment")

const getValidDates = (quantity, frecuency) =>{
    return {validFrom: moment().toDate(), validTo: moment().add(quantity, frecuency).toDate()}
}

module.exports = getValidDates