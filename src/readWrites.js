"use strict";

module.exports = db => {
  return {
    insertIntoDB: ride => {
      return new Promise((resolve, reject) => {
        const values = [
          ride.startLatitude,
          ride.startLongitude,
          ride.endLatitude,
          ride.endLongitude,
          ride.riderName,
          ride.driverName,
          ride.driverVehicle
        ];
        db.run(
          "INSERT INTO Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) VALUES (?, ?, ?, ?, ?, ?, ?)",
          values,
          function(err) {
            if (err) {
              console.log("Error inserting records into DB", err);
              reject(err);
            }
            const query = `SELECT * FROM Rides WHERE rideID = ${this.lastID}`;
            db.all(query, function(err, rows) {
              if (err) {
                reject(err);
              }
              resolve(rows);
            });
          }
        );
      });
    },
    selectRideFromDB: query => {
      return new Promise((resolve, reject) => {
        db.all(query, (err, row) => {
          if (err) {
            reject(err);
          }
          resolve(row);
        });
      });
    }
  };
};
