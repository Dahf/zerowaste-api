const express = require('express');
const jwt = require('jsonwebtoken');
const Meals = require('./models/Meals');

const app = express ();
app.use(express.json());

const PORT = process.env.PORT || 8080;
const secretKey = process.env.KEY; 

function verifyJWT(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).send({ error: "Token ist erforderlich" });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(403).send({ error: "Token ist ungültig" });
        }
        req.user = decoded;
        next();
    });
}

app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
});

app.get("/status", (request, response) => {
    const status = {
       "Status": "Running"
    };
    response.send(status);
 });


 app.post("/meal", verifyJWT, (request, response) => {
    const { name, description, servingSize, calories, fat, carbohydrates, protein, fiber, sugar, sodium } = request.body

    const newMealData = {
        name,
        description,
        servingSize,
        calories,
        fat,
        carbohydrates,
        protein,
        fiber,
        sugar,
        sodium
    };

    Meals.createMeal(newMealData)
        .then(createdMeal => {
            response.status(201).json(createdMeal);
        })
        .catch(error => {
            response.status(500).json({ error: "Fehler beim Erstellen des meals" });
        });

 });
 app.get('/meals', async (req, res) => {
    try {
      const { ingredient, calories } = req.query;
      
      let query = {};
      if (ingredient) {
        query['$ingredients.name$'] = ingredient; // Filtern nach Zutatenname
      }
      if (calories) {
        query.calories = {
          [sequelize.Op.lte]: calories // Meals mit Kalorien <= dem angegebenen Wert
        };
      }
  
      const meals = await Meal.findAll({
        where: query,
        include: [{
          model: sequelize.model('ingredient'), // Angenommen Ihr Zutaten-Modell heißt 'ingredient'
          as: 'ingredients',
          attributes: ['id', 'name', 'measure'] // Sie könnten weitere Attribute hinzufügen, die Sie brauchen
        }]
      });
  
      res.json(meals);
    } catch (error) {
      console.error('Fehler beim Abrufen der Meals:', error);
      res.status(500).send('Serverfehler');
    }
  });