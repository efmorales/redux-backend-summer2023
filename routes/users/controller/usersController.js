
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const { createUser, hashPassword, comparePassword } = require("./userHelper");


module.exports = {
    login: async (req, res) => {
        try {
            console.log(req.body);

            // check if user exists / get the user from DB

            let foundUser = await User.findOne({email:req.body.email})

            if (!foundUser) {
                throw {
                    status: 404,
                    message: "User Not Found"
                }
            }

            // check if password matches

            let checkedPassword = await comparePassword(req.body.password, foundUser.password);

            if (!checkedPassword) {
                throw {
                    status: 403,
                    message: "Invalid password"
                }
            }

            let payload = {
                id: foundUser._id,
                email: foundUser.email,
            }

            let expiration = new Number
            if (req.body.isRemember) {
                expiration = 60*60*24*7
            } else {
                expiration = 60*15
            }
            let token = await jwt.sign(payload, process.env.SUPER_SECRET_KEY, {expiresIn: expiration})

            
            res.status(200).json({
                user: {

                    email: foundUser.email,
                    firstname: foundUser.firstname,
                    lastname: foundUser.lastname
                },
                    message: "Successful Login!!",
                    token: token
            })
        } catch (error) {
            res.status(error.status).json(error.message);
        }
    },

    register: async (req, res) => {
        try {
            console.log(req.body);

            let foundUser = await User.findOne({email:req.body.email});

            if (foundUser) {
                throw {
                    status: 409,
                    message: "user exist already"
                }
            }

            let newUser = await createUser(req.body);

            let hashedPassword = await hashPassword(req.body.password)

            newUser.password = hashedPassword

            //hash password
            let savedUser = await newUser.save();

            res.status(200).json({
                email: savedUser.email,
                firstname: savedUser.firstname,
                lastname: savedUser.lastname,
                message: `succesfully registered ${savedUser.email}`,
            })
        }
        catch (e) {
            res.status(e.status).json('error');
        }
    },

    authtoken: async (req, res) => {

        // console.log(req.decoded);

        let foundUser = await User.findById(req.decoded.id);

        // let token = await jwt.sign(payload, process.env.JWT_KEY,{expiresIn: 60*60});

        res.status(200).json({
            email: foundUser.email,
            firstname: foundUser.firstname,
            lastname: foundUser.lastname,
            message: 'succesful login',
        });
        
    },

    deleteuser: async (req, res) => {
        const result = await User.deleteOne({ _id: req.decoded.id });
      
        if (result.deletedCount === 1) {
          res.status(200).json({
            message: 'User successfully deleted'
          });
        } else {
          res.status(404).json({
            message: 'User not found'
          });
        }
      }

    // add controller function object
}


// const login = (req, res) => {
//     return {
//         email: req.body.email
//     }
// }
//
// module.exports = {
//     login
// }