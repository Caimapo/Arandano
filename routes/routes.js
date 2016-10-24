var path = process.cwd();
var bcrypt = require('bcrypt');
var salt = bcrypt.genSaltSync(10);
const util = require('util');

module.exports = function (app, connection, passport) {

    app.route('/')
    .get(function(req, res) {
        //res.sendfile(process.cwd() + '/public/index.html');
        res.render('index.html');
    });

    app.route('/api')
    .get(function(req, res) {
        connection.query('SELECT * FROM Estudiante ', function(err, rows){
            res.json(rows);
        });
    })
    .post(function(req, res){
        var f = req.body;
        connection.query("INSERT INTO `Estudiante` (`nickname`, `nombre`, `email`, `password`, `tipo`) VALUES ('"+f.nickname+"', '"+f.nombre+"', '"+f.email+"', '"+f.pass+"', '"+f.tipon+"')", function(err, rows){
            res.json(rows); 
        });
    });

	app.route('/api/experto')
    .get(function(req, res) {
		var f = req.params.id;
		//var f = req.params.body;
        connection.query("SELECT * FROM Experto WHERE nombre_exp='"+f+"'", function(err, rows){
			if(err){ }
			//if(bcrypt.hashSync(passwordEnteredByUser, salt) === rows[0].exp_pass){
				//return "success";
				res.json(rows);
			//}
			//console.log(rows[0].exp_pass);
			//res.send(rows);
        });
    })
    .post(function(req, res){
        var f = req.body;
		var encPass = bcrypt.hashSync(f.password, salt);
		connection.query("INSERT INTO `Experto` (`exp_pass`, `nombre_exp`) VALUES ('"+encPass+"', '"+f.nickname+"')", function(err, rows){
            res.json(rows); 
        });
    });

	app.route('/api/login')
		.post(function(req, res) {
			var f = req.body;	
			console.log("el body: "+f);
			console.log(util.inspect(f, false, null))
			connection.query("SELECT * FROM Experto WHERE nombre_exp='"+f.user+"'", function(err, rows){
				console.log("Query : "+rows);
				console.log("Password enc : "+ bcrypt.hashSync(f.pass, salt) );
				if(err){ 
					throw err;
				}
				if(rows[0]){
					//if(bcrypt.hashSync(f.pass, salt) === rows[0].exp_pass){
					if(bcrypt.compareSync(f.pass, rows[0].exp_pass)){
						console.log("login successful");
						res.json({login: 1});
						//res.redirect('/dashboard');
					}
					else{
						console.log("login failed, wrong password");
						res.json({login: -1});
					}
				}
				else{
					console.log("not in database");
					res.json({login: 0});
				}
			});
		});


	app.route('/api/contenido')
    .get(function(req, res) {
        connection.query('SELECT * FROM Estudiante ', function(err, rows){
            res.json(rows);
        });
    })
    .post(function(req, res){
        var f = req.body;
        connection.query("INSERT INTO `Estudiante` (`nickname`, `nombre`, `email`, `password`, `tipo`) VALUES ('"+f.nickname+"', '"+f.nombre+"', '"+f.email+"', '"+f.pass+"', '"+f.tipon+"')", function(err, rows){
            res.json(rows); 
        });
    });

};


// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}



