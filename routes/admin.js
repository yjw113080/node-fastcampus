const express = require('express');
const router = express.Router();
const models = require('../models');



router.get('/products', function(_, res) {
    models.Products.findAll({
        // 여기는 검색 조건이 들어감
    }).then((products)=> {
        res.render('admin/products.html', {products: products});
    });
})

router.get('/', function(req,res){
    res.send('admin app');
});

router.get('/products', function(req, res) {
    // res.send('product page :)');
    res.render('admin/products.html', {
        'school': 'nodejs'
    });
});

router.get('/products/write', function (req, res) { 
    res.render('admin/form.html');
 });

router.post('/products/write', function (req, res) { 
    models.Products.create({
        name : req.body.name,
        price : req.body.price ,
        description : req.body.description
    }).then( () => {
        res.redirect('/admin/products');
    });
 })

 router.get('/products/detail/:id' , function(req, res){
    models.Products.findByPk(req.params.id).then( (product) => {
        res.render('admin/detail.html', { product: product });  
    });
});

module.exports = router;