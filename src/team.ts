const slackChannel = "rnbot"
const teamName = "Rhythm and Blues"

interface TeamMemberProps {
  firstName: string
  lastName?: string
  email?: string
  slackHandle?: string
  slackId?: string
}

class TeamMember {
  firstName: string
  lastName?: string
  email?: string
  slackHandle?: string
  slackId?: string

  constructor({
    firstName,
    lastName,
    email,
    slackHandle,
    slackId,
  }: TeamMemberProps) {
    this.firstName = firstName
    this.lastName = lastName
    this.email = email
    this.slackHandle = slackHandle
    this.slackId = slackId
  }
}
const qaEngineer = new TeamMember({
  firstName: "Jeff",
  lastName: "Thoensen",
  email: "jeff.thoensen@salesloft.com",
  slackHandle: "jeff",
  slackId: "U0DM1N3SL",
})

const designer = new TeamMember({
  firstName: "Sam",
  lastName: "Solomon",
  email: "sam.solomon@salesloft.com",
  slackHandle: "sam.solomon",
  slackId: "U4GRF0ZB2",
})

const productManager = new TeamMember({
  firstName: "Daniel",
  lastName: "Andrews",
  email: "daniel.andrews@salesloft.com",
  slackHandle: "daniel",
  slackId: "U0BGKRRNW",
})

const engineers = [
  new TeamMember({
    firstName: "Stephen",
    lastName: "Gladney",
    email: "stephen.gladney@salesloft.com",
    slackHandle: "gladney",
    slackId: "U0JFDH6DT",
  }),
  new TeamMember({
    firstName: "Ray",
    lastName: "Gesualdo",
    email: "ray.gesualdo@salesloft.com",
    slackHandle: "Ray",
    slackId: "UAFN8FU76",
  }),
  new TeamMember({
    firstName: "Kenny",
    lastName: "Alvarez",
    email: "kenny.alvarez@salesloft.com",
    slackHandle: "kenny.alvarez",
    slackId: "U1D7UCRNF",
  }),
  new TeamMember({
    firstName: "Stephen",
    lastName: "Settle",
    email: "stephen.settle@salesloft.com",
    slackHandle: "settle",
    slackId: "U04NZTQSL",
  }),
  new TeamMember({
    firstName: "Patrick",
    lastName: "Hoydar",
    email: "patrick.hoydar@salesloft.com",
    slackHandle: "Hodar",
    slackId: "U727JM1F0",
  }),
]

const team = [qaEngineer, designer, productManager, ...engineers]

const findTeamMemberByEmail = (email: string) => {
  return (
    team.find((member) => member.email === email) ||
    new TeamMember({
      firstName: "A non-team member",
      email: `${email}`,
    })
  )
}

function findTeamMemberByFullName(fullName: string) {
  const space = fullName.indexOf(" ")
  const firstName = fullName.substring(0, space)
  const lastName = fullName.substring(space + 1)
  return (
    team.find(
      (member: TeamMemberProps) =>
        member.firstName === firstName && member.lastName === lastName
    ) ||
    new TeamMember({
      firstName: firstName,
      lastName: lastName,
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
  teamName,
}
