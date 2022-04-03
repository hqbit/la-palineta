import express from "express";
import { Request, Response } from "express";
import path from "path";

const app = express();

app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname + "/../frontend/index.html"));
});

const publicDirectoryPath = path.join(__dirname, "/../frontend");
app.use(express.static(publicDirectoryPath));

app.listen(process.env.PORT || 5500, () => {
  console.log("Application started on port 5000!");
});
