const slackChannel = "emailnotifications"
const teamName = "Rhythm and Blues"
class TeamMember {
  constructor({ firstName, lastName, email, slackHandle }) {
    this.firstName = firstName
    this.lastName = lastName
    this.email = email
    this.slackHandle = slackHandle
  }
}
const qaEngineer = new TeamMember({
  firstName: "Belinda",
  lastName: "Goodman",
  email: "belinda.goodman@salesloft.com",
  slackHandle: "belinda.goodman"
})

const designer = new TeamMember({
  firstName: "Sam",
  lastName: "Solomon",
  email: "sam.solomon@salesloft.com",
  slackHandle: "sam.solomon"
})

const productManager = new TeamMember({
  firstName: "Daniel",
  lastName: "Andrews",
  email: "daniel.andrews@salesloft.com",
  slackHandle: "daniel"
})

const engineers = [
  new TeamMember({
    firstName: "Stephen",
    lastName: "Gladney",
    email: "stephen.gladney@salesloft.com",
    slackHandle: "gladney"
  }),
  new TeamMember({
    firstName: "Ray",
    lastName: "Gesualdo",
    email: "ray.gesualdo@salesloft.com",
    slackHandle: "Ray"
  }),
  new TeamMember({
    firstName: "Adrianna",
    lastName: "Valdivia",
    email: "adrianna.valdivia@salesloft.com",
    slackHandle: "adrianna"
  }),
  new TeamMember({
    firstName: "Pete",
    lastName: "Finn",
    email: "pete.finn@salesloft.com",
    slackHandle: "pete"
  }),
  new TeamMember({
    firstName: "Matt",
    lastName: "Brooke",
    email: "matt.brooke@salesloft.com",
    slackHandle: "matt.brooke"
  })
]

const team = [qaEngineer, designer, productManager, ...engineers]

const findTeamMemberByEmail = email => {
  return (
    team.find(member => member.email === email) ||
    new TeamMember({
      firstName: "A non-team member",
      lastName: null,
      email: `${email} (not on team)`,
      slackHandle: "not"
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
      email: `notRnB@salesloft.com`,
      slackHandle: "notrnb"
    })
  )
}

module.exports = {
  designer,
  engineers,
  findTeamMemberByEmail,
  findTeamMemberByFullName,
  productManager,
  qaEngineer,
  slackChannel,
  teamName
}
