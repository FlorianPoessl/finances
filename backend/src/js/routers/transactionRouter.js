const express = require('express');
const router = express.Router();
const path = require('path');
const moment = require('moment');
var fs = require('fs-extra');

const {Transaction} = require('../schemas/transaction')

router.post(`/upload`, async function (req, res) {
    //console.log(req.files.foo);
    const file = req.files.foo;
    var uploadPath = path.join(__dirname, '/../../../files/csv', file.name)
    console.log(uploadPath);
    file.mv(uploadPath, function(err) {
        if (err)
            return res.status(500).send(err);
    });
    var data = fs.readFileSync(uploadPath)
        .toString()
        .split('\n')
        .map(e => e.trim())
        .map(e => e.split(';'))
    
    var insertTransactions = [];
    data.forEach(function(transactionEntry, index) {
        if (transactionEntry[0]) {
            const transaction = new Transaction({
                yearlyIndex: index,
                date: moment(transactionEntry[0], 'DD.MM.YYYY').toDate(),
                text: transactionEntry[1],
                type: 1,
                amount: (transactionEntry[3]) ? Number(transactionEntry[3].replace(",", ".")) : 0
            });
            insertTransactions.push(transaction);
        }
    })
    Transaction.insertMany(insertTransactions).then((createdTransaction) => {
        res.status(201).json(createdTransaction)
    }).catch((error) => {
        res.status(500).json({
            error: error,
            success: false
        });
    })
})

router.get(`/`, async (req, res) => {
    const transactionList = await Transaction.find();
    res.send(transactionList);
})

router.put('/:id', async (req, res) => {
    const transaction = await Transaction.findByIdAndUpdate(req.params.id, {
        yearlyIndex: req.body.yearlyIndex,
        date: moment(req.body.date, 'DD.MM.YYYY').toDate(),
        institution: req.body.institution,
        text: req.body.text,
        type: req.body.type,
        amount: req.body.amount
    });

    res.send(transaction);
});

router.delete('/:id', async (req, res) => {
    Transaction.findByIdAndDelete(req.params.id);
})

router.post(`/`, (req, res) => {
    const transaction = new Transaction({
        yearlyIndex: req.body.yearlyIndex,
        date: moment(req.body.date, 'DD.MM.YYYY').toDate(),
        institution: req.body.institution,
        text: req.body.text,
        type: req.body.type,
        amount: req.body.amount
    })

    transaction.save().then((createdTransaction) => {
        res.status(201).json(createdTransaction)
    }).catch((error) => {
        res.status(500).json({
            error: error,
            success: false
        });
    })
})

module.exports = router;
