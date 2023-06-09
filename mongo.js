const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

if (process.argv.length > 5) {
  console.log("too many arguments");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://atteaaltonen:${password}@phonebook.pk3g2wu.mongodb.net/PhonebookApp?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length === 3) {
  console.log("phonebook:");
  Person.find({}).then((result) => {
    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
} else {
  const person = new Person({
    name: String(process.argv[3]),
    number: String(process.argv[4]),
  });

  person.save().then(() => {
    console.log(
      `Added person '${person.name}' (number: ${person.number}) to phonebook`
    );
    mongoose.connection.close();
  });
}
