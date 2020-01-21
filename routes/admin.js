const express = require('express');
const router = express.Router();
const models = require('../models');
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });
const path = require('path');
const uploadDir = path.join( __dirname , '../uploads' ); // 루트의 uploads위치에 저장한다.
const fs = require('fs');


//multer 셋팅
const multer  = require('multer');
const storage = multer.diskStorage({
    destination :  (req, file, callback) => { //이미지가 저장되는 도착지 지정
        callback(null, uploadDir );
    },
    filename :  (req, file, callback) => { // products-날짜.jpg(png) 저장 
        callback(null, 'products-' + Date.now() + '.'+ file.mimetype.split('/')[1] );
    }
});
const upload = multer({ storage: storage });


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

router.post('/products/write', upload.single('thumbnail'), csrfProtection, async (req, res) => { 
    try {
        req.body.thumbnail = (req.file) ? req.file.filename : "";
        await models.Products.create(req.body);
        res.redirect('/admin/products');
    } catch (e) {
        console.log(e);
    } 
    
 })

 router.get('/products/detail/:id' , async(req, res) => {

    let product = await models.Products.findOne({where: {id: req.params.id}, include: ['Memo']});
    res.render('admin/detail.html', { product: product });  

});

router.get('/products/edit/:id', csrfProtection, async (req, res) => {

    let product = await models.Products.findByPk(req.params.id);
    res.render('admin/form.html', {product, csrfToken : req.csrfToken()});
})

/*
router.post('/products/edit/:id', upload.single('thumbnail') , csrfProtection , async(req, res) => {

    try{
        // 이전에 저장되어있는 파일명을 받아오기 위함
        const product = await models.Products.findByPk(req.params.id);

        // 파일요청이면 파일명을 담고 아니면 이전 DB에서 가져온다
        req.body.thumbnail = (req.file) ? req.file.filename : product.thumbnail;
        
        await models.Products.update(
            req.body , 
            { 
                where : { id: req.params.id } 
            }
        );
        res.redirect('/admin/products/detail/' + req.params.id );

    }catch(e){

    }

});
*/


router.post('/products/edit/:id', upload.single('thumbnamil'), csrfProtection, async (req, res) => {
    try {
        // 기존 파일명 가져오고, 파일 요청이 새로 들어오면 그 요청값을, 아니면 이전 값을 넣는다.
        const product = await models.Products.findByPk(req.params.id);

        if(req.file && product.thumbnail) {  //요청중에 파일이 존재할 경우 이전이미지 지운다.
            fs.unlinkSync( uploadDir + '/' + product.thumbnail );
        }

        req.body.thumbnail = (req.file) ? req.file.filename : product.thumbnail;
        await models.Products.update(req.body, {
            where: {id: req.params.id}
        });
        res.redirect(`/admin/products/detail/${req.params.id}`);
        
    } catch (e) {
        console.log(e);
    }
    
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