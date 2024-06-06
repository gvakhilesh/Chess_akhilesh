const { 
    createUser, 
    getUserByUserId, 
    getUsers, 
    updateUser, 
    deleteUser,
    getUserIdByUsername, 
    login,
    signUp,
    logout,gameover,User_ID, Bot_ID, Game_date, Game_time, PGN, Winner
} = require("./user.controller");
const router = require("express").Router();
const { requireAuthentication } = require("../../auth/session");
const multer = require("multer");
const { spawn } = require("child_process");
const path = require("path");
const upload = multer({ dest: "uploads/" });


/*Below 4 are SAME ROUTES but DIFFERENT ENDPOINTS*/
// router.post("/", requireAuthentication, createUser);
// router.get("/", requireAuthentication, getUsers);
// router.patch("/", requireAuthentication, updateUser);
// router.delete("/", requireAuthentication, deleteUser);

// router.get("/:id", requireAuthentication, getUserByUserId);

router.get("/", (req, res) => {
    res.redirect("ChessWebsite/login");
});
router.get("/login", (req, res) => {
    res.render("login");
});

router.post("/login", login);
router.post("/signup", signUp);

router.get("/home", requireAuthentication, (req, res) => {
    res.render("home", {userName: req.session.userName});
});
router.get("/profile", requireAuthentication, (req, res) => {
    res.render("profile", {userName: req.session.userName});
});
router.get("/playUser", requireAuthentication, (req, res) => {
    res.render("playUser", {userName: req.session.userName});
});
router.get("/playBot", requireAuthentication, (req, res) => {
    res.render("playBot", {userName: req.session.userName});
});
router.get("/chat", requireAuthentication, (req, res) => {
    res.render("chat");
})
router.get("/boardToFen", requireAuthentication, (req, res) => {
    res.render("boardToFen", {userName: req.session.userName});
});

router.get('/playBot/get-username', (req, res) => {
    const whiteUsername = req.session.userName;
    res.json({ whiteUsername});
});

router.get("/logout", requireAuthentication, logout); 

router.post("/playBot/GameOver",gameover);


router.post("/boardToFen/process_image", upload.single("image"), (req, res) => {
    // Validate input parameters
    if (!req.file) {
        return res.status(400).send("No image uploaded.");
    }

    // Path of the uploaded image
    const imagePath = req.file.path;
    console.log('Received image for processing:', imagePath);
    
    // Execute Python script using child process
    const pythonProcess = spawn('python', ['preprocess.py', imagePath]);

    // Capture stdout data
    let predictedFen = '';
    pythonProcess.stdout.on('data', (data) => {
        predictedFen += data.toString();
    });

    // Handle process exit
    pythonProcess.on('close', (code) => {
        if (code === 0) {
            // Assuming Python script returns predicted FEN as stdout
            predictedFen = predictedFen.trim(); // Trim whitespace
            console.log('Predicted FEN:', predictedFen);
            res.send(predictedFen); // Send predicted FEN back to client
        } else {
            console.error('Python script execution failed with code:', code);
            res.status(500).send("Error processing image.");
        }
    });
});







module.exports = router;