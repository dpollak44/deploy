var express = require('express');
var router = express.Router();
const db = require('../pool');


router.route('/items')
    .get((req, res, next) => {
        db.query('SELECT * FROM groceries', (error, results, fields) => {
            if (error) return next(new Error(`Unable to fetch contacts ${error.message}`));
            console.log(results);
            res.send(results);
        });
    })
    .post((req, res, next) => {
        console.log(req.body.name, req.body.aisle)
        db.query(`INSERT INTO groceries(name,aisle_num)
                          VALUES(?,?)`,
            [req.body.name, req.body.aisle],
            (error, result) => {
                if (error) return next(new Error(`Unable to add item ${error.message}`));
                if (!result.affectedRows) return next(new Error(`Unable to add item`));

                const item = {
                    name: req.body.name,
                    aisle_num: req.body.aisle,
                    id: result.insertId
                };
                res.status(201).send(item);
            });
    })


router.route('/items/:id')
    .get((req, res, next) => {
        console.log(req.params.id)
        db.query('SELECT * FROM groceries WHERE aisle_num = ?',
            [req.params.id],
            (error, result, fields) => {
                if (error) return next(new Error(`Unable to get items ${req.params.id} ${error.message}`));
                if (!result) return next(new Error(`Unable to get items ${req.params.id}`, 404));

                res.send(result);
            });
    })
    .put((req, res, next) => {
        db.query(`UPDATE groceries SET name = ?, aisle_num = ?
                  WHERE id = ?`,
            [req.body.name, req.body.aisle_num, req.params.id],
            (error, result) => {
                if (error) return next(new Error(`Unable to update item ${req.params.id} ${error.message}`));
                console.log(result);
                if (!result.changedRows) return next(new Error(`Unable to update item`, 404));

                res.status(204).end();
            }
        );
    })
    .delete((req, res, next) => {
        console.log(req.params.id)
        db.query(`DELETE FROM groceries WHERE id = ?`,
            [req.params.id],
            (error, result) => {
                if (error) return next(new Error(`Unable to delete item ${req.params.id} ${error.message}`));
                if (!result.affectedRows) return next(new Error(`Unable to delete item ${req.params.id}`, 404));

                res.status(204).end();
            }
        );
    });

router.route('/aisles')
    .get((req, res, next) => {
        db.query('SELECT * from aisles', (error, results, fields) => {
            if (error) return next(new Error(`Unable to fetch aisles ${error.message}`));
            console.log(results);
            res.send(results);
        });
    })
    .post((req, res, next) => {
        db.query(`INSERT INTO aisles(name)
                  VALUES(?)`,
            [req.body.aisle],
            (error, result) => {
                if (error) return next(new Error(`Unable to add aisle ${error.message}`));
                if (!result.affectedRows) return next(new ApiError(`Unable to add aisle`));

                const aisle = {
                    name: req.body.aisle,
                    id: result.insertId
                };
                res.status(201).send(aisle);
            });
    })
    .delete((req, res, next) => {
        console.log(req.body.aisle)
        db.query(`DELETE FROM aisles WHERE id = ?`,
            [req.body.aisle],
            (error, result) => {
                if (error) return next(new Error(`Unable to delete aisle ${req.body.aisle} ${error.message}`));
                if (!result.affectedRows) return next(new Error(`Unable to delete aisle ${req.body.aisle}`, 404));
                res.status(204).end();
            }
        );
    });

router.route('/aisles/:id')
    .get((req, res, next) => {
        console.log(req.params.id)
        db.query('SELECT * FROM aisles WHERE id = ?',
            [req.params.id],
            (error, result, fields) => {
                if (error) return next(new Error(`Unable to get aisle ${req.params.id} ${error.message}`));
                if (!result) return next(new Error(`Unable to get aisle ${req.params.id}`, 404));

                res.send(result);
            });
    })
module.exports = router;