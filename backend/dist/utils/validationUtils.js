"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidatePassword = exports.ValidateEmail = void 0;
const ValidateEmail = (email) => {
    const gmailRegex = /^[^\s@]+@gmail\.com$/;
    return gmailRegex.test(email);
};
exports.ValidateEmail = ValidateEmail;
const ValidatePassword = (password) => {
    // At least 8 characters, one uppercase, one lowercase, one number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return passwordRegex.test(password);
};
exports.ValidatePassword = ValidatePassword;
