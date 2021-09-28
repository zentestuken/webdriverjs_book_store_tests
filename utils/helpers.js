// here, some useful functions are described

let pushText = async function (els) {
    let texts = [];
    for (let i = 0; i < els.length; i++) {
        await els[i].getText().then((res) => {
            texts.push(res);
        });
    }
    return texts;
}

let arraysEqual = function (arr1, arr2) {
    let notEqual = false;
    if (arr1.length === arr2.length) {
        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) {
                notEqual = true;
            }
        }
    } else { notEqual = true; }
    return !notEqual;
}

let generateValidPassword = function () {
    let password = '';
    for (let i = 0; i < 6; i++) {
        let a = (i === 0) ?
            String.fromCharCode(65 + Math.floor(Math.random() * 26)) :
            String.fromCharCode(65 + Math.floor(Math.random() * 26)).toLowerCase();
        password += a;
    }
    let special = "!@#$%^&";
    password += special.charAt(Math.ceil(special.length * Math.random() * Math.random()));
    password += Math.floor(Math.random() * 10);
    return password;
}


module.exports = { pushText, arraysEqual, generateValidPassword };