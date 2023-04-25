require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const Person = require("./models/person");
const app = express();

app.use(express.static("build"));
app.use(express.json());

morgan.token("body", (req, res) => JSON.stringify(req.body));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

let phoneNumbers = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1,
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2,
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3,
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4,
  },
];

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
};

app.get("/", (req, res) => {
  res.send("<div>You shouldn't be here :/</div>");
});

app.get("/api/persons", (req, res) => {
  Person.find({}).then((allPersons) => {
    res.json(allPersons);
  });
});

app.get("/api/persons/:id", (req, res) => {
  Person.findById(req.params.id).then((person) => {
    res.json(person);
  });
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  phoneNumbers = phoneNumbers.filter((person) => person.id !== id);

  res.status(204).end();
});

app.post("/api/persons/", (req, res) => {
  const body = req.body;
  //console.log("body:", body);

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "content missing",
    });
  }
  // if (phoneNumbers.find((person) => person.name === body.name)) {
  //   return res.status(400).json({
  //     error: "Name must be unique",
  //   });
  // }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedPerson) => {
    console.log("added:", savedPerson);
    res.json(savedPerson);
  });
});

app.get("/info", (req, res) => {
  const date = new Date();
  res.send(`<div>Phonebook has info for ${phoneNumbers.length} people</div>
  <div>${date.toString()}</div>`);
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
