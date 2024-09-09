// Copyright (c) [2024] [Diridium Technologies Inc.  https://diridium.com]
// 
// tested using node 16
// post json below to http://yourip:3000/bb
// {
//   "cda" : "base64 CDA without CRLFs"
// }
// response will be:
// {
//  "cda_json" : "escaped JSON of CDA"
// }

const express = require('express');
const bodyParser = require('body-parser');
const bb = require("@amida-tech/blue-button")

const app = express();
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.post('/bb', (req, res) => {
        try {
            const cdaxml = Buffer.from(req.body.cda, 'base64').toString('utf8');
                const cdajson = JSON.stringify(bb.parse(cdaxml))
                let response = {
                        cda_json: cdajson
                }
                res.status(200).json(response)}
        catch (error) {
                res.status(400).json(JSON.stringify({error}))
        }
});


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
