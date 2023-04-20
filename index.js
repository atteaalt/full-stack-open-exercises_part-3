const express = require("express");
const morgan = require("morgan");

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
  res.json(phoneNumbers);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const phoneNumber = phoneNumbers.find((person) => person.id === id);

  if (phoneNumber) {
    res.json(phoneNumber);
  } else {
    res.status(404).end();
  }
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
  if (phoneNumbers.find((person) => person.name === body.name)) {
    return res.status(400).json({
      error: "Name must be unique",
    });
  }

  const phoneNumber = {
    id: getRandomInt(0, 10000),
    name: body.name,
    number: body.number,
  };
  console.log("added:", phoneNumber);

  phoneNumbers = phoneNumbers.concat(phoneNumber);

  res.json(phoneNumber);
});

app.get("/info", (req, res) => {
  const date = new Date();
  res.send(`<div>Phonebook has info for ${phoneNumbers.length} people</div>
  <div>${date.toString()}</div>`);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
