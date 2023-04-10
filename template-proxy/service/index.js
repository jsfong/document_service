const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const fs = require("fs");

const app = express();
const port = 3000;
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });

//LOCAL DEBUG
// mongoose.connect("mongodb://localhost:27017", { useNewUrlParser: true });

const mySchema = new mongoose.Schema(
  {
    name: String,
    age: Number,
    occupation: String,
  },
  { strict: false }
);
const model_collection = mongoose.model("collection", mySchema);

const dataFolder = "./data/";

//LOCAL DEBUG
// const dataFolder = "./../data/";

//Read folder
fs.readdirSync(dataFolder).forEach((file) => {
  //Read file
  fs.readFile(dataFolder + file, "utf-8", (err, jsonString) => {
    if (err) {
      console.log("File read failed:", err);
      return;
    } else {
      var name = file.split(".").slice(0, -1).join(".");
      saveDoc(name, jsonString);
      console.log(
        `Parse file: ${file} with content size ${jsonString.length} into db`
      );
    }
  });
});

//Express
app.get("/", (req, res) => {
  res.send("Hello World! Connecting to mongodb at " + process.env.MONGODB_URI);
});

app.get("/:id", function (req, res) {
  console.log(`Retrieving ${req.params.id} ...`);
  getDoc(req.params.id).then(function (data) { 

    //Remove mongodb specific field
    let result = data[0];
    delete result['_id'];
    delete result['__v'];
    delete result['docId'];
    res.json(result);
  });
});

async function getDoc(docId) {
  const doc = await model_collection.find({docId: `${docId}`}).lean();
  return doc;
}

async function saveDoc(docId, jsonString) {
  await model_collection
    .deleteMany({ docId: `${docId}` });

  const data = JSON.parse(jsonString);
  data["docId"] = docId;
  await model_collection.insertMany(data);  

}

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
