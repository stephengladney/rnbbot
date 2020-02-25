const slackChannel = "rnb-private"
const teamName = "Rhythm and Blues"
class TeamMember {
  constructor({ firstName, lastName, email, slackHandle, slackId }) {
    this.firstName = firstName
    this.lastName = lastName
    this.email = email
    this.slackHandle = slackHandle
    this.slackId = slackId
  }
}
const qaEngineer = new TeamMember({
  firstName: "Belinda",
  lastName: "Goodman",
  email: "belinda.goodman@salesloft.com",
  slackHandle: "belinda.goodman",
  slackId: "U6NGS5BN1"
})

const designer = new TeamMember({
  firstName: "Sam",
  lastName: "Solomon",
  email: "sam.solomon@salesloft.com",
  slackHandle: "sam.solomon",
  slackId: "U4GRF0ZB2"
})

const productManager = new TeamMember({
  firstName: "Daniel",
  lastName: "Andrews",
  email: "daniel.andrews@salesloft.com",
  slackHandle: "daniel",
  slackId: "U0BGKRRNW"
})

const engineers = [
  new TeamMember({
    firstName: "Stephen",
    lastName: "Gladney",
    email: "stephen.gladney@salesloft.com",
    slackHandle: "gladney",
    slackId: "U0JFDH6DT"
  }),
  new TeamMember({
    firstName: "Ray",
    lastName: "Gesualdo",
    email: "ray.gesualdo@salesloft.com",
    slackHandle: "Ray",
    slackId: "UAFN8FU76"
  }),
  new TeamMember({
    firstName: "Adrianna",
    lastName: "Valdivia",
    email: "adrianna.valdivia@salesloft.com",
    slackHandle: "adrianna",
    slackId: "UF9DXJ6KH"
  }),
  new TeamMember({
    firstName: "Taylor",
    lastName: "Martin",
    email: "taylor.martin@salesloft.com",
    slackHandle: "tmart",
    slackId: "UE149MWM7"
  }),
  new TeamMember({
    firstName: "Stephen",
    lastName: "Settle",
    email: "stephen.settle@salesloft.com",
    slackHandle: "settle",
    slackId: "U04NZTQSL"
  }),
  new TeamMember({
    firstName: "Patrick",
    lastName: "Hoydar",
    email: "patrick.hoydar@salesloft.com",
    slackHandle: "Hodar",
    slackId: "U727JM1F0"
  })
]

const team = [qaEngineer, designer, productManager, ...engineers]

const findTeamMemberByEmail = email => {
  return (
    team.find(member => member.email === email) ||
    new TeamMember({
      firstName: "A non-team member",
      lastName: null,
      email: `${email}`,
      slackHandle: null
    })
  )
}

function findTeamMemberByFullName(fullName) {
  const space = fullName.indexOf(" ")
  const firstName = fullName.substring(0, space)
  const lastName = fullName.substring(space + 1)
  return (
    team.find(
      member => member.firstName === firstName && member.lastName === lastName
    ) ||
    new TeamMember({
      firstName: firstName,
      lastName: lastName,
      email: null,
      slackHandle: null
    })
  )
}

module.exports = {
  designer,
  engineers,
  findTeamMemberByFullName,
  productManager,
  qaEngineer,
  slackChannel,
  teamName
}
