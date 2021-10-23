const express = require('express');
const cors = require('cors');
const sgMail = require('@sendgrid/mail');
require("dotenv").config();

const app = express();

app.use(express.urlencoded({ extended: true })); //parse url data of type encoded
app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	next();
});

app.use(express.static(__dirname + "/public"));
app.use("/assets", express.static(__dirname + "/public/assets"));

app.get('/api', (req, res, next) => {
	res.send('API Status: Running');
});

app.post('/api/email', (req, res, next) => {
	console.log(req.body);
	sgMail.setApiKey(process.env.SENDGRID_API_KEY);
	const msg = {
    to: "rinavolovich@gmail.com",
    from: req.body.email,
    subject: "Website Contact Attempt",
    text: req.body.message,
    html: `<div>${req.body.message}</div>`
  };
	sgMail
		.send(msg)
		.then(() => {
			console.log('Email sent')
			res.status(200).json({
				success: true
			});
		})
		.catch((err) => {
			console.error(err);
			res.status(401).json({
				success: false
			});
		});
});
const port = process.env.PORT || 3030;

app.listen(port, () => console.log(`Server is running on port ${port}`));