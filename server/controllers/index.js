// pull in our models. This will automatically load the index.js from that folder
const models = require('../models');
const { Cat } = models;

const hostIndex = async (req, res) => {
  let name = 'unknown';

  try {
    const doc = await Cat.findOne({}, {}, {
      sort: { 'createdDate': 'descending' }
    }).lean().exec();
    if (doc) {
      name = doc.name;
    }
  } catch (err) {
    console.log(err);
  }

  res.render('index', {
    currentName: name,
    title: 'Home',
    pageName: 'Home Page'
  });
};

const hostPage1 = async (req, res) => {
  try {
    const docs = await Cat.find({}).lean().exec();
    return res.render('page1', { cats: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'failed to find cats' });
  }
};

const hostPage2 = (req, res) => {
  res.render('page2');
};

const hostPage3 = (req, res) => {
  res.render('page3');
};

const getName = async (req, res) => {
  try {
    const doc = await Cat.findOne({})
      .sort({ 'createdDate': 'descending' }).lean().exec();
    if (!doc) {
      return res.status(404).json({ error: 'No cat found' });
    }
    return res.json({ name: doc.name });
  } catch (err) {
    console.log(err);
    return res.status(500).json(
      { error: 'Something went wrong contacting the database' });
  }
};

const setName = async (req, res) => {
  if (!req.body.firstname || !req.body.lastname || !req.body.beds) {
    return res.status(400).json({ error: 'firstname, lastname and beds are all required' });
  }

  const catData = {
    name: `${req.body.firstname} ${req.body.lastname}`,
    bedsOwned: req.body.beds,
  };
  const newCat = new Cat(catData);
  console.log(newCat);

  try {
    await newCat.save();
    return res.status(201).json({
      name: newCat.name,
      beds: newCat.bedsOwned,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'failed to create cat' });
  }

};

const searchName = async (req, res) => {
  if (!req.query.name) {
    return res.status(400).json({ error: 'Name is required to perform a search' });
  }

  try {
    const doc = await Cat.findOne({ name: req.query.name }).select('name bedsOwned').exec();
    if (!doc) {
      return res.status(404).json({ error: 'No cat found' });
    }
    return res.json({ name: doc.name, beds: doc.bedsOwned });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

const updateLast = (req, res) => {
  const updatePromise =
    Cat.findOneAndUpdate({}, { $inc: { 'bedsOwned': 1 } }, {
      returnDocument: 'after',
      sort: {
        'createdDate': 'descending'
      }
    }).lean().exec();
  updatePromise.then((doc) => res.json({
    name: doc.name,
    beds: doc.bedsOwned,
  }));
  updatePromise.catch((err) => {
    console.log(err);
    return res.status(500).json({ error: 'Something went wrong' });
  });

};

const notFound = (req, res) => {
  res.status(404).render('notFound', {
    page: req.url,
  });
};

module.exports = {
  index: hostIndex,
  page1: hostPage1,
  page2: hostPage2,
  page3: hostPage3,
  getName,
  setName,
  updateLast,
  searchName,
  notFound,
};
