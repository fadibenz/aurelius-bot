
function renderChange(change,embed,color){
    change = change.toFixed(2)
    if (change > 0) {
        change = `+${change} %`
        if (color) embed.setColor(0x3CDE3C)
    }
      else if (change < 0){
        change = `${change} %`
        if (color) embed.setColor(0xFF0601)
    }
       else if (change.toFixed(2) === 0){
            change = `${change}%`
            if (color) embed.setColor(0x808080)
    } 
    return change;
}

function convertToInternationalCurrencySystem (labelValue) {

    // Nine Zeroes for Billions
    return Math.abs(Number(labelValue)) >= 1.0e+12

    ? (Math.abs(Number(labelValue)) / 1.0e+12).toFixed(2) + "T"
    
    : Math.abs(Number(labelValue)) >= 1.0e+9

    ? (Math.abs(Number(labelValue)) / 1.0e+9).toFixed(2) + "B"
    // Six Zeroes for Millions 
    : Math.abs(Number(labelValue)) >= 1.0e+6

    ? (Math.abs(Number(labelValue)) / 1.0e+6).toFixed(2) + "M"
    // Three Zeroes for Thousands
    : Math.abs(Number(labelValue)) >= 1.0e+3

    ? (Math.abs(Number(labelValue)) / 1.0e+3).toFixed(2) + "K"

    : Math.abs(Number(labelValue));

}

module.exports = {
    renderChange,
    convertToInternationalCurrencySystem
}