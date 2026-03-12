import argon2 from "argon2";

const generateHash = async () => {
    const hash = await argon2.hash("admin9069");
    console.log("Password Hash:");
    console.log(hash);
};

generateHash();
