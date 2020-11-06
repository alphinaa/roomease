const mongoose = require ('mongoose');
mongoose.connect('mongodb://localhost:27017/roomease', {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  // birthday: Date,
  pictureURL: String,
  householdID: String,
  isHouseholdOwner: Boolean,
  firebaseAuthID: String,
});

// subdocument
const choreSchema = new mongoose.Schema({
  name: String,
  date: Date,
  choreHolder: String,
});

// subdocument
const expenseSchema = new mongoose.Schema({
  name: String,
  amount: mongoose.Types.Decimal128,
  expenseHolder: String,
});

// subdocument
const grocerySchema = new mongoose.Schema({
  name: String,
  quantity: mongoose.Types.Decimal128,
  quantityType: String,
})

const householdSchema = new mongoose.Schema({
  name: String,
  householdOwner: String, // reference the user
  chores: [],
  expenses: [],
  groceries: [],
  users: [],
});

const User = mongoose.model('User', userSchema);
const Chore = mongoose.model('Chore', choreSchema);
const Expense = mongoose.model('Expense', expenseSchema);
const Grocery = mongoose.model('Grocery', grocerySchema);
const Household = mongoose.model('Household', householdSchema);

module.exports = {
  User,
  Chore,
  Expense,
  Grocery,
  Household,
}