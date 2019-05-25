const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')

const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())

const mongodb_conn_module = require('./mongodbConnModule');
var db = mongodb_conn_module.connect();

// --- /test ---

var Test = require("../models/test");

app.get('/test', (req, res) => {
    Test.find({}, 'name purpose url created updated', function(error, data) {
        if (error) { console.error(error); }
        res.send(data);
    }).sort({ _id: -1 })
})
app.post('/test', (req, res) => {
    var db = req.db;
    var name = req.body.name;
    var purpose = req.body.purpose;
    var url = req.body.url;
    var steps = req.body.steps;
    var record = new Test({
        name: name,
        purpose: purpose,
        url: url,
        steps: steps,
        created: new Date()
    })
    record.save(function(error) {
        if (error) {
            console.log(error)
        }
        res.send({
            success: true
        })
    })
})
app.put('/test/:id', (req, res) => {
    var db = req.db;
    Test.findById(req.params.id, function(error, record) {
        if (error) { console.error(error); }
        if (record) {
            record.name = req.body.name;
            record.purpose = req.body.purpose;
            record.url = req.body.url;
            record.steps = req.body.steps;
            record.updated = new Date()
            record.save(function(error) {
                if (error) {
                    console.log(error)
                }
                res.send({
                    success: true
                })
            })
        }
    })
})
app.delete('/test/:id', (req, res) => {
    var db = req.db;
    Test.remove({
        _id: req.params.id
    }, function(err, test) {
        if (err)
            res.send(err)
        res.send({
            success: true
        })
    })
})
app.get('/test/:id', (req, res) => {
    var db = req.db;
    Test.findById(req.params.id, function(error, test) {
        if (error) { console.error(error); }
        res.send(test)
    })
})


app.listen(process.env.PORT || 8081);