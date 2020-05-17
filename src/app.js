'use strict';

const express = require('express');
const utils = require('./utils');
const app = express();
const data = require('./dbOperations');

const bodyParser = require('body-parser');
const dbOps = require('./readWrites');
const jsonParser = bodyParser.json();
const util = require('util');


module.exports = (db) => {

    const query = util.promisify(db.all);
    app.get('/health', (req, res) => res.send('Healthy'));

    app.post('/rides', jsonParser,  (req, res) => {
        const ride = utils.readRidesRequest(req.body);
        const validationRes = utils.validateRidesRequest(ride);

        if (validationRes !== 'valid') {
            // there is a validation error
            return res.send({
                error_code: 'VALIDATION_ERROR',
                message: validationRes
            });
        }

        // dbOps().insertIntoDB(ride);

        // console.log('data' , data);
        data.forEach(async(ride) => {
            var values = [ride.startLatitude, ride.startLongitude, ride.endLatitude, ride.endLongitude, ride.riderName, ride.driverName, ride.driverVehicle];

            const response = await db.run('INSERT INTO Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) VALUES (?, ?, ?, ?, ?, ?, ?)', values, (err, row) => {
                if(err) {
                    // return res.send({
                    //     error_code: 'SERVER_ERR',
                    //     message: 'error'
                    // });
                    console.log('Error inserting record', err);
                }

            });
        });

        // var values = [ride.startLatitude, ride.startLongitude, ride.endLatitude, ride.endLongitude, ride.riderName, ride.driverName, ride.driverVehicle];
        // try {

        // } catch(err) {
        //              return res.send({
        //             error_code: 'SERVER_ERROR',
        //             message: 'Unknown error'
        //         });
        // }
        // await db.run('INSERT INTO Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) VALUES (?, ?, ?, ?, ?, ?, ?)', values, function (err) {
        //     if (err) {
        //         return res.send({
        //             error_code: 'SERVER_ERROR',
        //             message: 'Unknown error'
        //         });
        //     }

        //     db.all('SELECT * FROM Rides WHERE rideID = ?', this.lastID, function (err, rows) {
        //         if (err) {
        //             return res.send({
        //                 error_code: 'SERVER_ERROR',
        //                 message: 'Unknown error'
        //             });
        //         }

        //         res.send(rows);
        //     });
        // });

        
        res.send({
            status: '200',
            message: 'done'
        })
    });

    app.get('/rides', async (req, res) => {
        try {
            //destructure and set offset
            const [limit, offset] = [req.query.pageSize, (req.query.page -1) * req.query.pageSize];
            const resp  = await db.all(`SELECT * FROM Rides ORDER BY rideID LIMIT ${limit} OFFSET ${offset}` );
            const sql = `SELECT * FROM Rides ORDER BY rideID LIMIT ${limit} OFFSET ${offset}`;
            const result = await db.run(sql);
    
            console.log('get rides response', result, '\n ======');
        } catch (err) {
            console.log('Error running query', err);
        }
        // const [limit, offset] = [req.query.pageSize, (req.query.page -1) * req.query.pageSize];
        // const resp  = await query(`SELECT * FROM Rides ORDER BY rideID LIMIT ${limit} OFFSET ${offset}` );

        // console.log('get rides response', resp);
        //, function (err, rows) {
            /* if (err) {
                return res.send({
                    error_code: 'SERVER_ERROR',
                    message: 'Unknown error'
                });
            }

            if (rows.length === 0) {
                return res.send({
                    error_code: 'RIDES_NOT_FOUND_ERROR',
                    message: 'Could not find any rides'
                });
            } 
            res.send(rows); */
       // });
    });

    app.get('/rides/:id', (req, res) => {
        db.all('SELECT rideID, startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle FROM Rides WHERE rideID= :rideID', {
            rideID: req.params.id
        }, function (err, rows) {
            if (err) {
                return res.send({
                    error_code: 'SERVER_ERROR',
                    message: 'Unknown error'
                });
            }

            if (rows.length === 0) {
                return res.send({
                    error_code: 'RIDES_NOT_FOUND_ERROR',
                    message: 'Could not find any rides'
                });
            }

            res.send(rows);
        });
    });

    return app;
};
