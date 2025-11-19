import app from "./app.js";

(async () => {
    app.listen(process.env.PORT, () => {
        console.log("************************************************");
        console.log(`Server is listening on port: ${process.env.PORT}`);
        console.log("************************************************");
    })
}) ();
