const express = require('express');
const campsiteRouter = express.Router();

//set up end points
campsiteRouter.route('/')
.all((req, res, next) => {
	res.statusCode = 200;//code for success
	res.setHeader('Content-Type', 'text/html');
	next();
})
.get((req, res) => {//returns info
	res.end('Will send all the campsites to you');
})
.post((req, res) => {// sends info to server
	res.end(`Will add the campsite: ${req.body.name} with description: ${req.body.description}`)
})
.put((req, res) => {//updates existing info
	res.statusCode  = 403;//forbiden temple
	res.end('PUT operation not supported on /campsites');
})
.delete((req, res) => {//robot noises
	res.end('Deleting all campsites');
});

campsiteRouter.route('/:campsiteId')
.all((req, res, next) => {
	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/html');
	next();
})
.get((req, res) => {
	res.end(`Will send details of the campsite: ${req.params.campsiteId} to you`);
})
.post((req, res) => {
	res.statusCode = 403;
	res.end(`POST operation not supported on /campsites/${req.params.campsiteId}`);
})
.put((req, res) => {
	res.write(`Updating the campsite: ${req.params.campsiteId}\n`);
	res.end(`Will update the campsite: ${req.body.name}
		with description: ${req.body.description}`);
})
.delete((req, res) => {
	res.end(`Deleting campsite: ${req.params.campsiteId}`);
});
module.exports = campsiteRouter;