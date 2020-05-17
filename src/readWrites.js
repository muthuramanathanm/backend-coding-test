'use strict';

module.exports = (db) => {
    return {
        insertIntoDB: async (ride, db) => {
            console.log("DB =====>>>>>>>>>>>>>> \n", db);
            console.log('inside INSERTINTODB ', ride);
            try {
                const values = [
                    ride.startLatitude, 
                    ride.startLongitude, 
                    ride.endLatitude, 
                    ride.endLongitude, 
                    ride.riderName,
                    ride.driverName, 
                    ride.driverVehicle
                ];
    
                const response = await db.run('INSERT INTO Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) VALUES (?, ?, ?, ?, ?, ?, ?)', values);
                console.log('INSERT RESPONSE', response);
            } catch(err) {
                console.log('Error inserting record into table ', err);
            }

        },
        selectRideFromDB: (rideID) => {
            db.all('SELECT * FROM Rides WHERE rideID = ?', rideID, (err, row) => {
                if (err) {
                    return err;
                }
                return row;
            });
        }
    }
}