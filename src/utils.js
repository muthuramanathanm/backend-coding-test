'use strict';

module.exports =  {
    readRidesRequest : (req) => {
        return {
            startLatitude: Number(req.start_lat),
            startLongitude: Number(req.start_long),
            endLatitude: Number(req.end_lat),
            endLongitude: Number(req.end_long),
            riderName: req.rider_name,
            driverName: req.driver_name,
            driverVehicle: req.driver_vehicle
        }
    },

    validateRidesRequest : (req) => {
            if (req.startLatitude < -90 || req.startLatitude > 90 || req.startLongitude < -180 || req.startLongitude > 180) {
                return 'Start latitude and longitude must be between -90 to 90 and -180 to 180 degrees respectively';
            }

            if (req.endLatitude < -90 || req.endLatitude > 90 || req.endLongitude < -180 || req.endLongitude > 180) {
                return 'End latitude and longitude must be between -90 to 90 and -180 to 180 degrees respectively';
            }

            if (typeof req.riderName !== 'string' || req.riderName.length < 1) {
                return 'Rider name must be a non empty string';
            }

            if (typeof req.driverName !== 'string' || req.driverName.length < 1) {
               return 'Driver name must be a non empty string'
            }

            if (typeof req.driverVehicle !== 'string' || req.driverVehicle.length < 1) {
                return 'Driver Vehicle must be a non empty string'
            }

            // returning a string instead of bool(true) - when moving to TS, this 
            // helps to keep a single return type instead of String | Boolean
            return 'valid';
    }
}