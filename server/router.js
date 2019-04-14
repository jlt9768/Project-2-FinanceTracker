const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getPremium', mid.requiresSecure, mid.requiresLogin, controllers.Account.getPremium);
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getFinances', mid.requiresLogin, controllers.Finance.getFinances);
  //app.get('/getDomos', mid.requiresLogin, controllers.Domo.getDomos);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/finance', mid.requiresLogin, controllers.Finance.financePage);
  app.post('/finance', mid.requiresLogin, controllers.Finance.make);
  app.post('/upgrade', mid.requiresLogin, controllers.Account.upgrade);
  // app.get('/changePass', mid.requiresSecure(), mid.requiresLogin(),
         // controllers.Account.changePassPage);
  app.post('/changePass', mid.requiresSecure, mid.requiresLogin,
          controllers.Account.changePass);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
