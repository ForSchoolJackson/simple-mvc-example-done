const controllers = require('./controllers');

const router = (app) => {
  app.get('/page1', controllers.page1);
  app.get('/page2', controllers.page2);
  app.get('/page3', controllers.page3);
  app.get('/page4', controllers.page4);
  app.get('/getName', controllers.getName);

  // search animals
  app.get('/findByNameCat', controllers.searchCat);
  app.get('/findByNameDog', controllers.searchDog);

  app.get('/', controllers.index);

  app.get('/*', controllers.notFound);

  // Set animals
  app.post('/setCat', controllers.setCat);
  app.post('/setDog', controllers.setDog);

  // update
  app.post('/updateLast', controllers.updateLast);
};

// export the router function
module.exports = router;
