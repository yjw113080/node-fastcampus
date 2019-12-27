const express = require('express');
const router = express.Router();
const models = require('../models');


router.get('/', function (_, res) {
    models.Contacts.findAll({

    }).then((contacts) => {
        res.render('contacts/contacts.html', {
            contacts: contacts
        })
    });
})

router.get('/detail/:id' , function(req, res){
    models.Contacts.findByPk(req.params.id).then( (contact) => {
        res.render('contacts/detail.html', { contact: contact });  
    });
});

router.get('/write', function(req, res) {
    res.render('contacts/form.html')
})

router.post('/write', function(req, res) {
    models.Contacts.create({
        name: req.body.name,
        age: req.body.age,
        description: req.body.description
    }).then(()=> {
        res.redirect('/contacts')
    })
})



module.exports = router;