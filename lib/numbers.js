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

module.exports = {
  hours: hours,
  isMoreThanTwoHoursAgo: isMoreThanTwoHoursAgo,
  isPast: isPast,
  ordinal: ordinal
}
