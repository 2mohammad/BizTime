const express = require("express");
const ExpressError = require("../../errorClass");
const router = express.Router();
const db = require("../../db");



router.get('/', async (req, res, next) => {
    try{
    const results = await db.query(`SELECT * FROM invoices`);
    return res.json({ invoices: results.rows });
    }
    catch (err){
    return next(err)
    }
});

// router.get('/search', async (req, res, next) =>{
//     try{
//         const { type } = req.query;
//         const results = await db.query(`SELECT * FROM users WHERE type=$1`, [type])
//         return res.json(results.rows);
//     } catch (err) {
//         return next(err)
//     }
// })

router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const results = await db.query('SELECT * FROM invoices WHERE id=$1', [id])
        if (results.rows.length === 0){
            throw new ExpressError(`entity of id ${id} not found`, 404)
        }
        return res.send({company: results.rows[0]})
    } catch(e) {
        return next(e)
    }
})

router.post('/', async (req, res, next) => {
    try {
        const { comp_code, amt } = req.body;
        const results = await db.query('INSERT INTO invoices (comp_code, amt) VALUES ($1, $2) RETURNING id, comp_code, amt, paid, add_date, paid_date', [comp_code, amt]);
        return res.status(201).json({invoice: results.rows[0]})
    } catch(e) {
        return next(e)
    }
})

router.patch('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { amt } = req.body;
        const results = await db.query('UPDATE invoices SET amt=$1 WHERE id=$2 RETURNING id, comp_code, amt, paid, add_date, paid_date', 
            [amt, id])
        if (results.rows.length === 0){
            throw new ExpressError("unable to update entity record", 404)
        }
            return res.send({ invoice: results.rows[0]})
    } catch(e) {
        return next(e)
    }
})

router.delete('/:id', async(req, res, next) =>{
    try{
        const { id } = req.params;
        const results = await db.query('DELETE FROM invoices WHERE id=$1 RETURNING id', [id])
        if (results.rows.length === 0){
            throw new ExpressError("unable to delete entity record", 404)
        }
        return res.send({msg: "Deleted"})
    } catch(e) {
        return next(e)
    }
})

module.exports = router;

