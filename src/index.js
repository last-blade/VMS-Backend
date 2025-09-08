import { app } from "./app.js";
import { connectDB } from "./database/database.js";

connectDB()
.then(() => {
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`)
    })
})
.catch((error) => {
    console.log("Error in connection to database", error.message);
})
.finally(() => {
    console.log("Database connection attempt finished.");
});