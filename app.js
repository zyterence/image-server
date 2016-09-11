var express = require('express')
var multer = require('multer')
var upload = multer({
	dest: 'public/uploads/'
})
var crypto = require('crypto')
var port = process.env.PORT || 3000
var app = express()

// app.use(express.static('public'))
app.use('/static', express.static('public'))
app.set('views', './views')
app.set('view engine', 'jade')
app.listen(port)

console.log('server started')

app.get('/', function(request, response, next) {
	response.render('upload')
})

var storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, './public/uploads/')
	},
	filename: function(req, file, cb) {
		crypto.pseudoRandomBytes(16, function(err, raw) {
			cb(null, raw.toString('hex') + Date.now() + file.originalname)
		})
	}
})

var uploadImage = multer({
	storage: storage
}).any()

app.post('/', function(request, response) {
	uploadImage(request, response, function(err) {
		if (err) {
			console.log(err.message)
			return
		}
		console.log(request.files)
		response.redirect('/static/uploads/' + request.files[0].filename)
	})
})
