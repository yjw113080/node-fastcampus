const express = require('express');
const router = express.Router();
const models = require('../models');
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });


router.get('/products', async (_, res) => {
    try{
        const products = await models.Products.findAll(); // 여기까지 기다려줘
        res.render('admin/products.html', {products: products});
    } catch(e) {
        console.log(e);
    }
    
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

router.get('/products/write', csrfProtection, function (req, res) { 
    res.render('admin/form.html', {csrfToken : req.csrfToken()});
 });

router.post('/products/write', csrfProtection, async (req, res) => { 
    await models.Products.create(req.body);
    res.redirect('/admin/products');
 })

 router.get('/products/detail/:id' , async(req, res) => {

    let product = await models.Products.findOne({where: {id: req.params.id}, include: ['Memo']});
    res.render('admin/detail.html', { product: product });  

});

router.get('/products/edit/:id', csrfProtection, async (req, res) => {
    let product = await models.Products.findByPk(req.params.id);
    res.render('admin/form.html', {product});
})

router.post('/products/edit/:id', csrfProtection, async (req, res) => {
    let product = await models.Products.update(req.body, {where: {id: req.params.id}});
    res.redirect(`/admin/products/detail/${req.params.id}`);
})

router.get('/products/delete/:id', async (req, res) => {
    let product = await models.Products.destroy({ where: { id: req.params.id } });
    res.redirect('/admin/products');
})


router.post('/products/detail/:id', async(req, res)=> {
    try {
        const product = await models.Products.findByPk(req.params.id);
        await product.createMemo(req.body);
        res.redirect(`/admin/products/detail/${req.params.id}`)
    } catch (e) {
        console.log(e);
    }
})

router.get('/products/delete/:product_id/:memo_id', async(req, res)=> {
    try {
        await models.ProductsMemo.destroy({
            where: {
                id: req.params.memo_id
            }
        });
        res.redirect(`/admin/products/detail/${req.params.product_id}`);
    } catch (e) {
        console.log(e);
    }
})
module.exports = router;