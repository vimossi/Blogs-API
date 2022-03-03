const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./router');

const app = express();

app.use(bodyParser.json());
app.use(routes);

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (request, response) => {
  response.send();
});

app.listen(3000, () => console.log('ouvindo porta 3000!'));
