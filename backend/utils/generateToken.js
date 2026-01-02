const jwt = require('jsonwebtoken');

/**
 * Generates a JSON Web Token (JWT) for the given user ID.
 * @param {string} id - The MongoDB ObjectId of the user.
 * @returns {string} The signed JWT token.
 */
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d', // Token expires in 30 days
    });
};

module.exports = generateToken;