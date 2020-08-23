const express = require('express');
const router = express.Router();
const trackingLogic = require('../logic/tracking.logic');


router.post('/tracking', async function (req, res) {

    let trackingNumber = req.body.trackingNumber;
    let courierCode = req.body.courierCode;


    let result = await trackingLogic.getTrackingInfo(trackingNumber, courierCode);
    res.status(result.status);
    res.json(result.body);

});


router.use('/', express.static('public'));


module.exports = router;
