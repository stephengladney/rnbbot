export function convertCase(str: string) {
  let wordArray: string[] = []
  if (str.includes("_")) wordArray = str.split("_")
  else if (str.includes("-")) wordArray = str.split("-")
  else if (str.includes(" ")) wordArray = str.split(" ")
  else {
    const isLowerCase = str[0] === str[0].toLowerCase()
    const wordStartIndexes = isLowerCase ? [0] : []
    str
      .split("")
      .forEach((letter, i) =>
        letter === letter.toUpperCase() ? wordStartIndexes.push(i) : null
      )
    wordStartIndexes.forEach((index, i) => {
      const endOfWord = wordStartIndexes[i + 1]
      wordArray.push(str.substring(index, endOfWord).toLowerCase())
    })
  }
  return {
    toConst: () => wordArray.join("_").toUpperCase(),
    toKabob: () => wordArray.join("-").toLowerCase(),
    toSnake: () => wordArray.join("_").toLowerCase(),
    toPascal: () =>
      wordArray
        .map(
          (word, i) =>
            word.substr(0, 1).toUpperCase() + word.substr(1).toLowerCase()
        )
        .join(""),
    toCamel: () =>
      wordArray
        .map((word, i) => {
          return i === 0
            ? word.toLowerCase()
            : word.substr(0, 1).toUpperCase() + word.substr(1).toLowerCase()
        })
        .join(""),
    toString: () => wordArray.join(" ").toLowerCase(),
  }
}
