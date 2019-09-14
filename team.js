function TeamMember(firstName, lastName, email, slackHandle) {
  this.firstName = firstName;
  this.lastName = lastName;
  this.email = email;
  this.slackHandle = slackHandle;
}
const qaEngineer = new TeamMember(
  "Belinda",
  "Goodman",
  "belinda.goodman@salesloft.com",
  "belinda.goodman"
);

const designer = new TeamMember(
  "Sam",
  "Solomon",
  "sam.solomon@salesloft.com",
  "sam.solomon"
);
const engineers = [
  new TeamMember(
    "Stephen",
    "Gladney",
    "stephen.gladney@salesloft.com",
    "gladney"
  ),
  new TeamMember("Ray", "Gesualdo", "ray.gesualdo@salesloft.com", "Ray"),
  new TeamMember(
    "Adrianna",
    "Valdivia",
    "adrianna.valdivia@salesloft.com",
    "adrianna"
  ),
  new TeamMember("Pete", "Finn", "pete.finn@salesloft.com", "pete"),
  new TeamMember("Matt", "Brooke", "matt.brooke@salesloft.com", "matt.brooke")
];
const findEngineerByEmail = email => {
  return engineers.find(engineer => engineer.email === email);
};

module.exports = {
  qaEngineer: qaEngineer,
  designer: designer,
  engineers: engineers,
  findEngineerByEmail: email => findEngineerByEmail(email)
};
