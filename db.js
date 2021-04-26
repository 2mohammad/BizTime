const { Client } = require("pg");

let DB_URI;

if (process.env.NODE_ENV === "test") {
    DB_URI = "postgresql:///BizTime_test";
} else {
    DB_URI = "postgresql:///BizTime_db";
}

let db = new Client({
    connectionString: DB_URI
});

db.connect();

module.exports = db;
