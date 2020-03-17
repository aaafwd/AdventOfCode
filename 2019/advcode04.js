(function(){

function verify(x) {
    let str = String(x);
    let adjacent = false
    for (let i = 1; i < str.length; ++i) {
        if (str[i] == str[i-1]) {
            if (i == 1 && str[i] != str[i+1]) {
                adjacent = true;
            } else if (i == 5 && str[i] != str[i-2]) {
                adjacent = true;
            } else if (str[i] != str[i-2] && str[i] != str[i+1]) {
                adjacent = true;
            }
        }
        if (str[i] < str[i-1]) return false;
    }

    return adjacent;
}

let res = 0;
for (let i = 168630; i<= 718098; ++i) {
    if (verify(i)) ++res;
}
console.log(res);

})();

