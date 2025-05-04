import bcrypt, { hash } from 'bcrypt';

const plainPassword: string = "NaufalAdmin12345";
const salt:number = 12;

bcrypt.hash(plainPassword, salt, (err, hash) => {
    if(err){
        console.log("Error when hashing password");
    }else{
        console.log("Hashed password: ", hash);
    }
})
