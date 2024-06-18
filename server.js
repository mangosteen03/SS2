import "dotenv/config";
import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import passport from "passport";
import path from "path";
import { fileURLToPath } from "url";
import { renderFile } from "ejs";
import sequelize from "./db.js";
import homeRoutes from "./routes/homeRoutes.js";
import "./controllers/authController.js"; // Initialize passport strategies

// Initialize express app
const app = express();

// Get __dirname equivalent in ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set up view engine and middleware
app.engine("html", renderFile);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));

app.set("view cache", false);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configure session
app.use(
  session({
    secret: "random secret",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Initialize and sync models
const initializeDatabase = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log("Database synchronized");
  } catch (error) {
    console.error("Unable to synchronize the database:", error);
  }
};
initializeDatabase();

// Routes
app.use("/", homeRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
