import app from "./app.js";
import appConfig from "./config/index.js";
import db from "./config/db.js";

(async () => {
    // Connecting to MongoDB
    await db.connectToDb();

    // Starting the server
    app.listen(appConfig.port, () => {
        console.log("************************************************");
        console.log("App Server Information:")
        console.log(`Server is listening on port: ${appConfig.port}`)
        console.log(`Server is running on environment: ${appConfig.node_env}`);
        console.log(`Server is connected to database: ${appConfig.db.url}`);
        console.log("************************************************");
    })
}) ();
