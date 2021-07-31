import app from "./app";

const server = app.listen(8081, () => {
    console.log(`App listening at http://localhost:8081`)
});