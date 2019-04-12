const express = require('express');
const router = express.Router();

router.route('/member/edit/:id')


    .all((req, res, next)=>{
        res.locals.memberData = {
            name: 'peter',
            age: 23
        };

        next();
    })
    .get((req, res)=>{
        res.json({
            memberData: res.locals.memberData,
            baseUrl: req.baseUrl,
            url: req.url,
            method: 'get'
        });
    })
    .post((req, res)=>{
        res.json({
            memberData: res.locals.memberData,
            baseUrl: req.baseUrl,
            url: req.url,
            method: 'post',
            body: req.body
        });
    });

module.exports = router;



