const router = require("express").Router();

const ProfessorController = require("../controllers/ProfessorController");

// middlewares
const verifyToken = require("../helpers/verifyToken");
const { imageUpload } = require("../helpers/imageUpload");

router.post("/register", ProfessorController.register);
router.post("/login", ProfessorController.login);
router.get("/checkuser", ProfessorController.checkUser);
router.get("/:id", ProfessorController.getUserById);
router.put(
  "/edit/:id",
  verifyToken,
  imageUpload.single("image"),
  ProfessorController.editUser
);

module.exports = router;