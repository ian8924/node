module.exports = app => {
    app.get('/my-params1/:action/:id', (req, res) => {
        res.json(req.params);
    });

    app.get('/my-params2/:action?/:id?', (req, res) => {
        res.json(req.params);
    });

    app.get('/my-params3/*/*?', (req, res) => {
        res.json(req.params);
    });
};