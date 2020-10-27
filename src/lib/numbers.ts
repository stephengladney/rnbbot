export const hours = (n: number) => Number(n) * 3600000

export const isPast = (time: number | undefined) =>
  time ? Math.floor(Date.now() / 60000) >= Math.floor(time / 60000) : undefined

export const ordinal = (n: number) => {
  if (n >= 11 && n <= 13) return `${String(n)}th`
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

export const humanizeDay = (day: number) => {
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
