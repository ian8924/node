const express = require('express');
const router = express.Router();

router.get(/^\/09\d{2}\-?\d{3}\-?\d{3}$/, (req, res) => {
    let path = req.url.slice(1);
    path = path.split('-').join('');
    res.send('mobile: '+ path);
});

module.exports = router;





