require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const Person = require("./models/person");
const app = express();

app.use(express.static("build"));
app.use(express.json());

morgan.token("body", (req) => JSON.stringify(req.body));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

app.get("/", (req, res) => {
  res.send("<div>You shouldn't be here :/</div>");
});

app.get("/api/persons", (req, res) => {
  Person.find({}).then((allPersons) => {
    res.json(allPersons);
  });
});

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => {
      next(error);
    });
});

app.delete("/api/persons/:id", (req, res, next) => {
  const id = String(req.params.id);
  Person.findByIdAndRemove(id)
    .then(() => res.status(204).end())
    .catch((error) => {
      next(error);
    });
});

app.post("/api/persons/", (req, res, next) => {
  const body = req.body;
  /*
  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "content missing",
    });
  }*/

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person
    .save()
    .then((savedPerson) => {
      console.log("added:", savedPerson);
      res.json(savedPerson);
    })
    .catch((error) => {
      next(error);
    });
});

app.put("/api/persons/:id", (req, res, next) => {
  const body = req.body;

  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(req.params.id, person, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((updatedPerson) => res.json(updatedPerson))
    .catch((error) => {
      next(error);
    });
});

app.get("/info", (req, res) => {
  Person.count({}).then((count) => {
    const date = new Date();
    res.send(`<div>Phonebook has info for ${count} people</div>
    <div>${date.toString()}</div>`);
  });
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, req, res, next) => {
  console.log(error.message);

  if (error.name === "CastError") {
    return res.status(400).send({ name: "malformatted id", ...error });
  } else if (error.name === "ValidationError") {
    return res.status(400).json(error);
  }
  return res.status(500).json(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
