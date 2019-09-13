const express = require("express");
const app = express();

app.get("/helloworld", () => {
    console.log("HELLO WORLD endpoint hit!")
})

.listen(process.env.PORT || 5000, process.env.IP, () => {
    console.log("rnbBot server is now running!");
  });