const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const fs = require("fs");
const http = require("http").Server(app);
const PORT = 3000;

const validateAjv = require("./middleware/validate");
const recipeSchema = require("./schema/recipeSchema");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/recipes", (req, res) => {
  fs.readFile("./data.json", (err, data) => {
    if (err) {
      console.log("File read failed:", err);
      return;
    }
    let parsedData = JSON.parse(data);
    let recipeNames = parsedData.recipes.map((item) => item.name);
    res.status(200).send({ recipeNames });
  });
});

app.get("/recipes/details/:recipeName", (req, res) => {
  let recipeName = req.params.recipeName;
  let recipeDetails = {};

  fs.readFile("./data.json", (err, data) => {
    if (err) {
      console.log("File read failed:", err);
      return;
    }
    let parsedData = JSON.parse(data);
    let details;
    parsedData.recipes.forEach((item) => {
      if (item.name === recipeName) {
        details = {
          ingredients: item.ingredients,
          numSteps: item.instructions.length,
        };
        recipeDetails = { details };
      }
    });
    res.status(200).send(recipeDetails);
  });
});

app.post("/recipes", validateAjv(recipeSchema), (req, res) => {
  fs.readFile("./data.json", (err, data) => {
    if (err) {
      console.log("File read failed:", err);
      return;
    }
    let fileContents = JSON.parse(data);

    let existingRecipes = [];
    
    fileContents.recipes.forEach(recipe => existingRecipes.push(recipe.name))

    if(existingRecipes.includes(req.body.name)){
      res.status(400).send({ "error": "Recipe already exists" });
    }
    else{
      fileContents.recipes.push(req.body);
  
      fs.writeFile("./data.json", JSON.stringify(fileContents), (err) => {
        if (err) console.log("Error writing file:", err);
      });
      res.status(201).send();
    }
  });
});

app.put("/recipes", validateAjv(recipeSchema), (req, res) => {
  fs.readFile("./data.json", (err, data) => {
    if (err) {
      console.log("File read failed:", err);
      return;
    }
    let fileContents = JSON.parse(data);

    let existingRecipes = [];
    fileContents.recipes.forEach(recipe => existingRecipes.push(recipe.name))
    console.log(existingRecipes)
    console.log(existingRecipes.includes(req.body.name))

    if(!existingRecipes.includes(req.body.name)){
      res.status(404).send({ "error": "Recipe does not exist" });
    }
    else{
      fileContents.recipes = fileContents.recipes.map(recipe => {
        if(recipe.name === req.body.name){
          recipe = req.body;
        }
        existingRecipes.push(recipe.name)
        return recipe;
      })

      fs.writeFile("./data.json", JSON.stringify(fileContents), (err) => {
        if (err) console.log("Error writing file:", err);
      });
      res.status(204).send();
    }
  });
});

let server = http.listen(PORT, () => {
  console.log(`Server is listening on port ${server.address().port}`);
});
