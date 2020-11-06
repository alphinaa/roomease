const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const db = require('../database/index');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

// GET
app.get('/signin/:id', (req, res) => {
  db.User.findOne({ firebaseAuthID: req.params.id }, (err, result) => {
    if (err) res.status(400).send(err);
    else res.status(200).json(result);
  })
});

app.get('/api/household/:id', (req, res) => {
  db.Household.findOne({ _id: req.params.id }, (err, result) => {
    if (err) res.status(400).send(err);
    else res.status(200).json(result);
  })
});

// POST
app.post('/signup', (req, res) => {
  // TO BE REPLACED FOR ACTUAL FIREBASE AUTH
  const {firstName, lastName , pictureURL, firebaseAuthID} = req.body;
  const newUser = new db.User({
    firstName: firstName,
    lastName: lastName,
    // birthday: birthday,
    pictureURL: pictureURL,
    householdID: '',
    isHouseholdOwner: false,
    firebaseAuthID: firebaseAuthID,
  });

  newUser.save((err, result) => {
    if (err) res.status(400).send(err);
    else res.status(200).json(result);
  })
});

// User creates household
app.post('/api/household', (req, res) => {
  const { name, householdOwner, firstName, userID } = req.body;
  const newHousehold = new db.Household({
    name: name,
    householdOwner: householdOwner,
    chores: [],
    expenses: [],
    groceries: [],
    users: [householdOwner],
  });

  // creates new household and updates user as owner of household.
  newHousehold.save((err, result) => {
    if (err) res.status(400).send(err);
    else {
      db.User.updateOne(
        { _id: userID },
        { householdID: result._id,
          isHouseholdOwner: true },
        (err, result) => {
          if (err) res.status(400).send(err);
          res.status(200).json(result);
        }
      )
    }
  })
});

app.post('/api/chore', (req, res) => {
  const {name, date, choreHolder, user, householdID} = req.body;
  const newChore = new db.Chore({
    name: name,
    date: date,
    choreHolder: choreHolder,
  })

  db.Household.updateOne(
    { _id: householdID },
    { $push: { chores: newChore } },
    (err, result) => {
      if (err) res.status(400).send(err);
      else res.status(200).json(result);
    }
  )
});

app.post('/api/expense', (req, res) => {
  const {name, amount, expenseHolder, householdID} = req.body;
  const newExpense = new db.Expense({
    name: name,
    amount: amount,
    expenseHolder: expenseHolder
  })

  db.Household.updateOne(
    { _id: householdID },
    { $push:  { expenses: newExpense } },
    (err, result) => {
      if (err) res.status(400).send(err);
      else res.status(200).json(result);
    }
  )
});

app.post('/api/grocery', (req, res) => {
  const {name, quantity, quantityType, householdID} = req.body;

  const newGrocery = new db.Grocery({
    name: name,
    quantity: quantity,
    quantityType: quantityType,
  });

  db.Household.updateOne(
    { _id: householdID },
    { $push: { groceries: newGrocery } },
    (err, result) => {
      if (err) res.status(400).send(err);
      else res.status(200).json(result);
    }
  );
});

// PUT
// add user to household
app.put('/api/user/:id', (req, res) => {
  const { householdID, firstName } = req.body;
  db.User.updateOne(
    { _id: req.params.id },
    { householdID: householdID },
    (err, result) => {
      if (err) res.status(400).send(err);
      else {
        db.Household.updateOne(
          { _id: householdID },
          { $push: { users: firstName } },
          (err, result) => {
            if (err) res.status(400).send(err);
            else res.status(200).json(result);
          }
        )
      }
    }
  )
})

const PORT = 3009;
app.listen(PORT, () => console.log(`LISTENING ON PORT ${PORT}`));