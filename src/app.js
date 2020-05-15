'use strict';

const express = require('express');
const utils = require('./utils');
const app = express();

const bodyParser = require('body-parser');
const dbOps = require('./readWrites');
const jsonParser = bodyParser.json();

module.exports = (db) => {
    app.get('/health', (req, res) => res.send('Healthy'));

    app.post('/rides', jsonParser,  async (req, res) => {
        try {

        }catch (err) {
            console.log('Error adding the ride', err);

        }
        const ride = utils.readRidesRequest(req.body);
        const validationRes = utils.validateRidesRequest(ride);

        if (validationRes !== 'valid') {
            // there is a validation error
            return res.send({
                error_code: 'VALIDATION_ERROR',
                message: validationRes
            });
        }

        const result = await dbOps(db).insertIntoDB(ride);
        res.send(result);
    });

    app.get('/rides', async (req, res) => {
        try {
            //destructure and set offset
            const [limit, offset] = [req.query.pageSize, (req.query.page -1) * req.query.pageSize];
            const sql = `SELECT * FROM Rides ORDER BY rideID LIMIT ${limit} OFFSET ${offset}`;

            const result = await dbOps(db).selectRideFromDB(sql);
            if(result.length === 0)  {
                return res.send({
                    error_code: 'RIDES_NOT_FOUND_ERROR',
                    message: 'Could not find any rides'
                });
            }
            return res.send(result);
        } catch (err) {
            console.log('Error fetching rides', err);
            return res.send({
                error_code: 'SERVER_ERROR',
                message: 'Unknown error'
            })
        }
    });

    app.get('/rides/:id', async(req, res) => {
/*         try {
            const sql = `'SELECT rideID, startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle FROM Rides WHERE rideID= :rideID', {
                rideID: ${req.params.id}
            }`;
            const result = await dbOps(db).selectRideFromDB(sql);
            if(result.length === 0)  {
                return res.send({
                    error_code: 'RIDES_NOT_FOUND_ERROR',
                    message: 'Could not find any rides'
                });
            }
            return res.send(result);
        } catch (err) {
            console.log('Error getting the ride with ID ', rideID, err);
            res.send({
                error_code: 'SERVER_ERROR',
                message: 'Unknown error'
            });
        } */
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
