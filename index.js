const express = require("express");
const Joi = require("joi");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello world");
});

// START MAKING CRUD API ==>

const genres = [
  { id: 1, gName: "Action" },
  { id: 2, gName: "Adventure" },
  { id: 3, gName: "Comedy" },
  { id: 4, gName: "Biographical" },
];

function validateGenre(genre) {
  const schema = {
    gName: Joi.string().min(3).required(),
  };

  return Joi.validate(genre, schema);
}

// Handling GET Request for getting the list of all genres ->
app.get("/api/genres", (req, res) => {
  res.send(genres);
});

// Handling GET Request for getting the genre name with its respective ID ->
app.get("/api/genres/:id", (req, res) => {
  // Getting the genre
  const genre = genres.find((g) => g.id === parseInt(req.params.id));

  // If genre not found, return 404
  if (!genre)
    return res.status(404).send("The genre with given ID was not found!");

  // If alright, sending the genre as a response
  res.send(genre);
});

// Handling POST Request ->
app.post("/api/genres", (req, res) => {
  const genre = {
    id: genres.length + 1,
    gName: req.body.gName,
  };

  // Validating gName
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Adding the genre object to genres and displaying it.
  genres.push(genre);
  res.send(genre);
});

// Handling PUT Request ->
app.put("/api/genres/:id", (req, res) => {
  // Validating genre
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Getting the genre
  const genre = genres.find((g) => g.id === parseInt(req.params.id));

  // If genre not found, return 404
  if (!genre)
    return res.status(404).send("The genre with given ID was not found!");

  // Updating the gName
  genre.gName = req.body.gName;
  res.send(genre);
});

// Handling DELETE Request ->
app.delete("/api/genres/:id", (req, res) => {
  // If the genre not found, return 404
  const genre = genres.find((g) => g.id === parseInt(req.params.id));
  if (!genre)
    return res.status(404).send("The genre of given ID was not found!");

  // If alright, deleting the genre
  const index = genres.indexOf(genre);
  genres.splice(index, 1);

  // Returning the genre
  res.send(genre);
});

// Listening the server ==>
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
