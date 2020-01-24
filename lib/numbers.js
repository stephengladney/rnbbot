const hours = n => Number(n) * 3600000

const isMoreThanTwoHoursAgo = time => Date.now() - time >= hours(2)

const isPast = time =>
  Math.floor(Date.now() / 60000) >= Math.floor(time / 60000)

const ordinal = n => {
  switch (String(n).substr(-1)) {
    case "1":
      return `${String(n)}st`
    case "2":
      return `${String(n)}nd`
    case "3":
      return `${String(n)}rd`
    default:
      return `${String(n)}th`
  }
}

const humanizeDay = day => {
  switch (day) {
    case 0:
      return "Sunday"
    case 1:
      return "Monday"
    case 2:
      return "Tuesday"
    case 3:
      return "Wednesday"
    case 4:
      return "Thursday"
    case 5:
      return "Friday"
    case 6:
      return "Saturday"
    default:
      return "Invalid"
  }
}

module.exports = {
  hours,
  humanizeDay,
  isMoreThanTwoHoursAgo,
  isPast,
  ordinal
}
