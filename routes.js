const passport=require('passport');
const bcrypt = require('bcrypt');

module.exports=function(app,myDataBase){

 //MIDDLEWARE FUNCTIONS
 function ensureAuthenticated(req,res,next){
    if(req.isAuthenticated()){
      return next();
    }
    res.redirect('/');
  };

  //GET ROUTES HANDLING
  app.route('/').get((req, res) => {
    res.render('index',{title: 'Connected to Database',
    message: "Please log in",showLogin: true,showRegistration: true});
  });
  
  app.route('/profile').get(ensureAuthenticated,(req,res) => {
    console.log('hai');
    res.render('profile',{username: req.user.username});
  });

  app.route('/logout').get((req,res) => {
    req.logout();
    res.redirect('/');
  })

  //POST ROUTES HANDLING
  app.route('/login').post(passport.authenticate('local',{failureRedirect: '/'}),(req,res) => {
    res.redirect('/profile');
  });

  app.route('/register').post((req,res,next) => {
    const hash=bcrypt.hashSync(req.body.password,12);
    myDataBase.findOne({username: req.body.username},(err,data) => {
      if(err){
        next(err)
      }else if(data){
        res.redirect('/');
      }else{
        myDataBase.insertOne({
          username: req.body.username,
          password: hash
        },(err,doc) => {
          if(err){
            res.redirect('/');
          }else{
            next(null,doc.ops[0]);
          }
        })
      }
    })
  })
  
   //404 ERROR HANDLING MIDDLEWARE FUNCTION
   app.use((req,res,next) => {
    res.status(404).type('text').send('Not Found');
  });

}