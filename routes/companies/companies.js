const express = require("express");
const ExpressError = require("../../errorClass");
const router = express.Router();
const db = require("../../db");



router.get('/', async (req, res, next) => {
    try{
    const results = await db.query(`SELECT * FROM companies`);
    return res.json({ companies: results.rows });
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

router.get('/:code', async (req, res, next) => {
    try {
        const { code } = req.params;
        const results = await db.query('SELECT * FROM companies WHERE code=$1', [code])
        const invoices = await db.query('SELECT * FROM invoices WHERE comp_code=$1', [code])
        const company_data = {};
        company_data.code = results.rows[0].code
        company_data.name = results.rows[0].name
        company_data.description = results.rows[0].description
        company_data.invoices = invoices.rows

        if (results.rows.length === 0){
            throw new ExpressError(`entity of code ${code} not found`, 404)
        }
        return res.send({company:company_data})
    } catch(e) {
        return next(e)
    }
})

router.post('/', async (req, res, next) => {
    try {
        const { code, name, description } = req.body;
        const results = await db.query('INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING code, name, description', [code, name, description]);
        return res.status(201).json({company: results.rows[0]})
    } catch(e) {
        return next(e)
    }
})

router.patch('/:code', async (req, res, next) => {
    try {
        const { code } = req.params;
        const { name, description } = req.body;

        const results = await db.query('UPDATE companies SET name=$1, description=$2 WHERE code=$3 RETURNING code, name, description', 
            [name, description, code])
        if (results.rows.length === 0){
            throw new ExpressError("unable to update entity record", 404)
        }
            return res.send({ company: results.rows[0]})
    } catch(e) {
        return next(e)
    }
})

router.delete('/:code', async(req, res, next) =>{
    try{
        const { code } = req.params;
        const results = await db.query('DELETE FROM companies WHERE code=$1 RETURNING code', [code])
        if (results.rows.length === 0){
            throw new ExpressError("unable to delete entity record", 404)
        }
        return res.send({msg: "Deleted"})
    } catch(e) {
        return next(e)
    }
})

module.exports = router;

