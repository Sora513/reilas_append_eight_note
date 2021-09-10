const fs = require("fs").promises;;
fs.readFile("source/kawaii_OD_.Extreme.json", "utf-8").then((content) => {
    console.log(isJSON(content))
});

function isJSON(arg) {
    arg = (typeof arg === "function") ? arg() : arg;
    if (typeof arg !== "string") {
        return false;
    } try {
        arg = (!JSON) ? eval("(" + arg + ")") : JSON.parse(arg);
        return true;
    } catch (e) {
        return false;
    }
};