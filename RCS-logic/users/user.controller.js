const { create, getUsers, getUserByUserId, updateUser, deleteUser, getUserByUsername,
    User_ID, Bot_ID, Game_date, Game_time, PGN, Winner,insertuvb } = require("./user.service");

const { genSaltSync, hashSync, compareSync} = require("bcrypt");

module.exports = {
    createUser: (req, res) => {
        //Extract password from body, hash and salt it
        const body = req.body;
        const salt = genSaltSync(10);
        body.password = hashSync(body.password, salt);

        //This callback is passed to create below, and is called in the pool.query method
        let callBack = function (err, results) {
            if(err) {
                console.log(err);
                return res.status(500).json({
                    success: 0,
                    message: "Database connection error"
                });
            }
            return res.status(200).json({
                success: 1,
                data: results
            });
        };

        create(body, callBack);
    },

    // getUserByUserId: (req, res) => {
    //     const id = req.params.id;

    //     let callback = function (err, results) {
    //         if(err) {
    //             console.log(err);
    //             return;
    //         }
    //         if(!results) {
    //             return res.json({
    //                 success: 0,
    //                 message: "Record not found"
    //             });
    //         }
    //         return res.json({
    //             success: 1,
    //             data: results
    //         });
    //     };

    //     getUserByUserId(id, callback);
    // },

    // getUsers: (req, res) => {
    //     let callback = function (err, results) {
    //         if(err) {
    //             console.log(err);
    //             return;
    //         }
    //         if(!results) {
    //             return res.json({
    //                 success: 0,
    //                 message: "Table empty"
    //             });
    //         }
    //         return res.json({
    //             success: 1,
    //             data: results
    //         });
    //     };

    //     getUsers(callback);
    // },

    // updateUser: (req, res) => {
    //     const body = req.body;
    //     const salt = genSaltSync(10);
    //     body.password = hashSync(body.password, salt);

    //     let callback = function (err, results) {
    //         if(err) {
    //             console.log(err);
    //             return;
    //         }
    //         return res.json({
    //             success: 1,
    //             message: "Updated successfully"
    //         });
    //     };
        
    //     updateUser(body, callback);
    // },

    // deleteUser: (req, res) => {
    //     const body = req.body;

    //     let callback = function(err, results) {
    //         if(err) {
    //             console.log(err);
    //             return;
    //         }
    //         return res.json({
    //             success: 1,
    //             message: "Record deleted successfully"
    //         });
    //     };

    //     deleteUser(body, callback);
    // },

    login: (req, res) => {
        const body = req.body;

        let callBack = function (error, results) {
            if(error) {
                console.log(error);
                return;
            }
            if(!results) {
                return res.json({
                    success: 0,
                    message: "Invalid username or password"
                });
            }
            const result = compareSync(body.password, results.password);
            if(result) {
                req.session.userName = body.username;
                return res.redirect("/ChessWebsite/home");
            }
            else {
                return res.json({
                    success: 0,
                    message: "Invalid username or password"
                });
            }
        };
        
        getUserByUsername(body.username, callBack);
    },
    
    gameover:(req, res) => {
        const body = req.body;
        let callback = function (error, results) {
        if(error) {
            console.log(error);
            return;
        }
        if(!results) {
            return res.json({
                success: 0,
                message: "Missing required Parameters"
            });
        }
        if(results){
            console.log("saved into database");
        }
    };
    insertuvb(body,callback);
},
    signUp: (req, res) => {
        //Extract password from body, hash and salt it
        const body = req.body;
        const salt = genSaltSync(10);
        const plainTextPassword = body.password;
        body.password = hashSync(body.password, salt);

        //This callback is passed to create below, and is called in the pool.query method
        let callBack = function (err, results) {
            if(err) {
                console.log(err);
                return res.status(500).json({
                    success: 0,
                    message: "Database connection error"
                });
            }
            req.body.password = plainTextPassword;
            return module.exports.login(req, res);
        };

        create(body, callBack);
    },

    logout: (req, res) => {
        req.session.destroy((err) => {
            if(err) throw err;
            return res.redirect("/ChessWebsite");
        });
    }
};