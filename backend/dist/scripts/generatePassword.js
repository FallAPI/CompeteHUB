"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const plainPassword = "NaufalAdmin12345";
const salt = 12;
bcrypt_1.default.hash(plainPassword, salt, (err, hash) => {
    if (err) {
        console.log("Error when hashing password");
    }
    else {
        console.log("Hashed password: ", hash);
    }
});
