var fs = require('fs');
var path = require('path');
var templatesDir = path.resolve(__dirname, '..', 'templates');
var emailTemplates = require('email-templates');
var nodemailer = require("nodemailer");
var rmdir = require('rimraf');

exports.displayAll = function (req, res) {
    var templates = [];
    var files = fs.readdirSync(process.env.TEMPLATES_DIR);
    for (var i=0;i<files.length;i++) {
        var filePath = process.env.TEMPLATES_DIR + "/" + files[i];
        var stat = fs.statSync(filePath);
        if(stat.isDirectory()) {
            templates.push(files[i]);
	}
    }
    res.render('displayAll.ejs', {templates:templates}, function (err, html) {
        if (err) {
            console.log(err);
        }
	res.send(html);
    });
}

exports.display = function (req, res) {
    var name = req.params.name;
    if (!fs.statSync(process.env.TEMPLATES_DIR + "/" + name)) {
        res.send(404);
    } else {
	var html = "";
	var text = "";
	var json = "";
        var css = "";
        
	try {
            html = fs.readFileSync(process.env.TEMPLATES_DIR + "/" + name + "/html.ejs");
            text = fs.readFileSync(process.env.TEMPLATES_DIR + "/" + name + "/text.ejs");
            css = fs.readFileSync(process.env.TEMPLATES_DIR + "/" + name + "/style.css");
            json = fs.readFileSync(process.env.TEMPLATES_DIR + "/" + name + "/vars.json");
	} catch (error) {
	}
        res.render('display.ejs', {json:json, html:html, text:text, css:css, name:name}, function (err, html) {
            if (err) {
                console.log(err);
            }
            res.send(html);	
        });
    }
}

exports.update = function (req, res) {
    var name = req.params.name;
    if (req.body.delete) {
        rmdir(process.env.TEMPLATES_DIR + "/" + name, function (err) {
	    if (err) {
		console.log(err);
	    }
            res.redirect("/templates");
	});
    } else {
        try {
            fs.writeFileSync(process.env.TEMPLATES_DIR + "/" + name + "/html.ejs", req.body.html);
            fs.writeFileSync(process.env.TEMPLATES_DIR + "/" + name + "/text.ejs", req.body.text);
            fs.writeFileSync(process.env.TEMPLATES_DIR + "/" + name + "/style.css", req.body.css);
            fs.writeFileSync(process.env.TEMPLATES_DIR + "/" + name + "/vars.json", req.body.json);
        } catch (error) {
        } 
        exports.display(req, res);
    }
}

exports.genTmp = function (req, res) {
    var name = req.params.name;
    emailTemplates(templatesDir, function(err, template) {
        if (err) {
            console.log(err);
	    res.send(404);
	} else {
	    var json = "{}";
	    try {
               json =JSON.parse(fs.readFileSync(process.env.TEMPLATES_DIR + "/" + name + "/vars.json"));
	    } catch (err) {}
	    var locals = {vars:json};
            template(name, locals, function(err, html, text) {
                if (err) {
		    res.send(require('util').inspect(err, {depth:null}));
		} else {
		    res.send(html);
		}
	    });
        }
    });
}

exports.new = function (req,res) {
    var html = "";
    var text = "";
    var json = "";
    var css = "";
    var name = "";

    res.render('display.ejs', {json:json, html:html, text:text, css:css, name:name}, function (err, html) {
       if (err) {
            console.log(err);
       }
       res.send(html);
    });
}

exports.add = function (req, res) {
    var name = req.body.name;
    if (!fs.existsSync(process.env.TEMPLATES_DIR + "/" + name)) {
        try {
    	    fs.mkdir(process.env.TEMPLATES_DIR + "/" + name);
            fs.writeFileSync(process.env.TEMPLATES_DIR + "/" + name + "/html.ejs", req.body.html);
            fs.writeFileSync(process.env.TEMPLATES_DIR + "/" + name + "/text.ejs", req.body.text);
            fs.writeFileSync(process.env.TEMPLATES_DIR + "/" + name + "/style.css", req.body.css);
            fs.writeFileSync(process.env.TEMPLATES_DIR + "/" + name + "/vars.json", req.body.json);
        } catch (error) {
        }
    } 
    res.redirect("/templates/" + name);
}
