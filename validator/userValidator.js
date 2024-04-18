const { check } = require('express-validator');


module.exports = [
                  check('username', 'Username must be at least 4 characters long, maximum 8 characters long and is not empty!')
                      .isLength({ min: 4, max: 8}).trim().notEmpty(),
                  check('password', 'Password should be combination of one uppercase , one lower case, one special char, one digit and min 8 ')
                      .isStrongPassword({
                        minLength: 8,
                        minLowercase: 1,
                        minUppercase: 1,
                        minNumbers: 1,
                        minSymbols: 1,
                      }),
                  check('email', 'Email must be valid and is not empty!')
                      .isEmail().normalizeEmail().notEmpty(),
];