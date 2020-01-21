const express = require('express');
const router = express.Router();
const models = require('../models');
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });


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

router.get('/write', csrfProtection, function(req, res) {
    res.render('contacts/form.html', { csrfToken : req.csrfToken() } );
})

router.post('/write', csrfProtection, function(req, res) {
    models.Contacts.create({
        name: req.body.name,
        age: req.body.age,
        description: req.body.description
    }).then(()=> {
        res.redirect('/contacts')
    })
})

router.get('/edit/:id', csrfProtection, async (req, res) => {
    let contact = await models.Contacts.findByPk(req.params.id);
    res.render('contacts/form.html', {contact, csrfToken : req.csrfToken()});
})

router.post('/edit/:id', csrfProtection, async(req, res) => {
    let contact = await models.Contacts.update(req.body, {where: {id: req.params.id}});
    res.redirect(`/contacts/detail/${req.params.id}`);    
})

router.get('/delete/:id', async(req, res) => {
    let contact = await models.Contacts.destroy({where: {id: req.params.id}});
    res.redirect('/contacts');
})

router.post('/detail/:id', async(req, res) => {
    try {
        let contact = await models.Contacts.findByPk(req.params.id);
        await contact.createHistory(req.body);
        res.redirect(`/contacts/detail/${req.params.id}`);
    } catch (e) {
        console.log(e);
    }
})

router.get('/detail/delete/:contact_id/:history_id', async(req, res) => {
    try {
        await models.ContactsHistory.destroy({
            where: {id: req.params.history_id}
        });
        res.redirect(`/contacts/detail/${req.params.id}`);
    } catch (e) {
        console.log(e);
    }
})

module.exports = router;