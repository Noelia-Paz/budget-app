const express = require("express");
const bodyParser = require("body-parser");
const apiRouter = require("./routes/apiRoute");
const cors = require("cors");

const app = express();
app.use(cors());

require("./database");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api", apiRouter);

app.listen(4000, () => {
  console.log("server listening on port 4000");
});
