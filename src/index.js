const express = require("express");
const bodyParser = require("body-parser");

const apiRouter = require("./routes/apiRoute");

const app = express();

require("./database");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api", apiRouter);

app.listen(3000, () => {
  console.log("server listening on port 3000");
});
