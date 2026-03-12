import argon2 from "argon2";

const testPassword = async () => {
    const password = "admin9069";
    const hash = "$argon2id$v=19$m=65536,t=3,p=4$1kuhDOnFdgTnTHTLEHuVlg$w+L/rS/UCdguA0qfRux2Z6mlQgHvbP9xt1bIzBkMM4M";
    
    const isValid = await argon2.verify(hash, password);
    console.log("Password valid:", isValid);
};

testPassword();
