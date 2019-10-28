function TeamMember({ firstName, lastName, email, slackHandle }) {
  this.firstName = firstName
  this.lastName = lastName
  this.email = email
  this.slackHandle = slackHandle
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
const findEngineerByEmail = email => {
  return engineers.find(engineer => engineer.email === email)
}

module.exports = {
  qaEngineer: qaEngineer,
  designer: designer,
  engineers: engineers,
  findEngineerByEmail: findEngineerByEmail
}
