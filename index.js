const express = require("express");
const PORT = 5000;
const app = express();
const cors = require("cors");
const path = require("path");
app.use(cors({
    origin: "*"
}));
app.use(express.json());
app.use("/", require("./routes/Upload.js"));
app.listen(PORT, () => {
    console.log(`Listening on Port ${PORT}`);
})