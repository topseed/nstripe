declare var require: any
declare var process: any
declare var console: Console
declare var __dirname: any

const express = require('express')
const exp = new express()
const fs = require('fs')
const yaml = require('js-yaml')

// ////////////////////////////////////////////////
let keys = yaml.load(fs.readFileSync('keys.yaml'))

const stripe = require('stripe')(keys.keySecret) // from keys.yaml

const PORT = 8444
exp.use(require('body-parser').urlencoded({extended: false}))

// ////////////////////////////////////////////////
exp.post('/api/charge', (req, res) => {
  let amount = 500;

  stripe.customers.create({
	  email: req.body.stripeEmail,
	 source: req.body.stripeToken
  })
  .then(customer =>
	 stripe.charges.create({
		amount,
		description: 'Sample Charge',
			currency: 'usd',
			customer: customer.id
	 }))
  .then(charge => res.send('/chargedPg'))
})

// ////////////////////////////////////////////////
exp.use(express.static('public'))
exp.listen(PORT)
console.log(PORT)

