const models = require('../models');

const Finance = models.Finance;
// console.dir(Finance);
const financePage = (req, res) => {
  Finance.FinanceModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }
    return res.render('app', { csrfToken: req.csrfToken(), finances: docs });
  });
};

const makeFinance = (req, res) => {
  if (!req.body.date || !req.body.item || !req.body.type) {
    return res.status(400).json({ error: ' Date, Item, and Type are required ' });
  }

  const financeData = {
    date: req.body.date,
    item: req.body.item,
    owner: req.session.account._id,
    type: req.body.type,
    amount: req.body.amount,
  };

  const newFinance = new Finance.FinanceModel(financeData);

  const financePromise = newFinance.save();

  financePromise.then(() => res.json({ redirect: '/finance' }));

  financePromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Finance already exists' });
    }

    return res.status(400).json({ error: 'An error occurred' });
  });
  return financePromise;
};

const getFinances = (request, response) => {
  const req = request;
  const res = response;

  return Finance.FinanceModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }
    return res.json({ finances: docs });
  });
};

module.exports.financePage = financePage;
module.exports.getFinances = getFinances;
module.exports.make = makeFinance;
