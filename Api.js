const express = require("express");
const app = express();
const bodyP = require("body-parser");
const compiler = require("compilex");
const path = require("path");

const options = { stats: true };
compiler.init(options);

app.use(bodyP.json());
app.use("/codemirror-5.65.16", express.static(path.join(__dirname, "codemirror-5.65.16")));

app.get("/", function (req, res) {
    compiler.flush(function () {
        console.log("deleted");
    });
    res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/compile", function (req, res) {
    var code = req.body.code;
    var input = req.body.input;
    var lang = req.body.lang;
    try {
        var envData = { OS: "windows", options: { timeout: 10000 } };

        if (lang === "Cpp") {
            envData.cmd = "g++";
            if (!input) {
                compiler.compileCPP(envData, code, function (data) {
                    res.send(data.output ? data : { output: "error" });
                });
            } else {
                compiler.compileCPPWithInput(envData, code, input, function (data) {
                    res.send(data.output ? data : { output: "error" });
                });
            }
        } else if (lang === "Java") {
            if (!input) {
                compiler.compileJava(envData, code, function (data) {
                    res.send(data.output ? data : { output: "error" });
                });
            } else {
                compiler.compileJavaWithInput(envData, code, input, function (data) {
                    res.send(data.output ? data : { output: "error" });
                });
            }
        } else if (lang === "Python") {
            if (!input) {
                compiler.compilePython(envData, code, function (data) {
                    res.send(data.output ? data : { output: "error" });
                });
            } else {
                compiler.compilePythonWithInput(envData, code, input, function (data) {
                    res.send(data.output ? data : { output: "error" });
                });
            }
        }
    } catch (e) {
        console.log("error");
    }
});

app.listen(8000, function () {
    console.log("Server is running on port 8000");
});
