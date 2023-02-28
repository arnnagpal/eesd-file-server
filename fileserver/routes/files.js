var express = require('express');
var fs = require('fs');
var router = express.Router();

const filesFolder = './files/';

function fileExists(filename) {
    return new Promise((resolve, reject) => {
        fs.access(filename, fs.constants.R_OK, (err) => {
            if (!err) {
                resolve(true);
                return;
            }

            if (err.code === 'ENOENT') {
                console.log('File does not exist');
                resolve(false);
            } else {
                reject(err);
            }
        });
    });
}

function getContent(fileName, callback) {
    // remove any extension from the file name
    if (fileName.indexOf(".") > -1) {
        fileName = fileName.substring(0, fileName.indexOf("."));
    }

    if (!fileName.endsWith(".json")) {
        fileName += ".json";
    }

    fileExists(filesFolder + fileName).then(exists => {
        if (exists) {
            fs.readFile(filesFolder + fileName, 'utf8', function (err, data) {
                if (err) {
                    callback(err, null);
                } else {
                    callback(null, data);
                }
            });
        } else {
            callback("File does not exist", null);
        }
    });
}

router.delete('/delete/:fileName/:password', function (req, res, next) {
    // add auth
    let password = req.params.password;
    let fileName = req.params.fileName;
    if (!fileName || !password) {
        res.json({
            "data": {
                "message": "Error",
                "error": "Missing parameters"
            }
        });
        return;
    }

    if (password !== process.env.DELETE_FILE_PASS) {
        res.json({
            "data": {
                "message": "Error",
                "error": "Invalid password"
            }
        });
        return;
    }

    // remove any extension from the file name
    if (fileName.indexOf(".") > -1) {
        fileName = fileName.substring(0, fileName.indexOf("."));
    }
});

/* GET getfiles listing. */
router.get('/', function (req, res, next) {
    fs.readdir(filesFolder, (err, files) => {
        let f = [];

        files.forEach(file => {
            if (file.endsWith(".json")) {
                f.push(file);
            }
        });

        res.json({
            "data": {
                "files": f
            }
        });
    });
});

router.get("/exists/:filename", function (req, res, next) {
    let fileName = req.params.filename;
    if (!fileName) {
        res.json({
            "data": {
                "message": "Error",
                "error": "Missing parameters"
            }
        });
        return;
    }

    // remove any extension from the file name
    if (fileName.indexOf(".") > -1) {
        fileName = fileName.substring(0, fileName.indexOf("."));
    }

    if (!fileName.endsWith(".json")) {
        fileName += ".json";
    }

    fileExists(filesFolder + fileName).then(exists => {
        if (exists) {
            res.json({
                "data": {
                    "message": true,
                    "path": filesFolder + fileName
                }
            });
        } else {
            res.json({
                "data": {
                    "message": false,
                    "path": filesFolder + fileName
                }
            });
        }
    });
});

router.get('/get/:fileName', function (req, res, next) {
    let fileName = req.params.fileName;
    if (!fileName) {
        res.json({
            "data": {
                "message": "Error",
                "error": "Missing parameters"
            }
        });
        return;
    }

    getContent(fileName, function (err, data) {
        if (err) {
            res.json({
                "data": {
                    "message": "Error",
                    "error": err
                }
            });
        } else {
            res.json({
                "data": {
                    "message": "File read",
                    "path": filesFolder + fileName,
                    "file": data
                }
            });
        }
    });

});

/* POST file listing. */
router.post('/create', function (req, res, next) {
    let fileName = req.body.fileName;
    let fileContent = req.body.fileContent;

    if (fileName && fileContent) {
        if (fileName.indexOf(".") > -1) {
            fileName = fileName.substring(0, fileName.indexOf("."));
        }

        if (!fileName.endsWith(".json")) {
            fileName += ".json";
        }

        fileExists(filesFolder + fileName).then(exists => {
            if (exists) {
                res.json({
                    "data": {
                        "message": "Error",
                        "error": "File already exists"
                    }
                });
                return;
            }

            fs.writeFile(filesFolder + fileName, fileContent, function (err) {
                if (err) {
                    res.json({
                        "data": {
                            "message": "Error",
                            "error": err
                        }
                    });
                } else {
                    res.json({
                        "data": {
                            "message": "File created",
                            "path": filesFolder + fileName + ".json"
                        }
                    });
                }
            });
        });
    } else {
        res.json({
            "data": {
                "message": "Error",
                "error": "Missing parameters"
            }
        });
    }
});

router.post('/append', function (req, res, next) {
    let fileName = req.body.fileName;
    let d = req.body.data;

    if (fileName.indexOf(".") > -1) {
        fileName = fileName.substring(0, fileName.indexOf("."));
    }

    if (!fileName.endsWith(".json")) {
        fileName += ".json";
    }

    if (fileName && d) {
        getContent(fileName, function (err, data) {
            if (err) {
                res.json({
                    "data": {
                        "message": "Error",
                        "error": err
                    }
                });
            } else {
                let fileData = JSON.parse(data);
                fileData.data.push(d);

                fs.writeFile(filesFolder + fileName, JSON.stringify(fileData), function (err) {
                    if (err) {
                        res.json({
                            "data": {
                                "message": "Error",
                                "error": err
                            }
                        });
                    } else {
                        res.json({
                            "data": {
                                "message": "File updated",
                                "path": filesFolder + fileName
                            }
                        });
                    }
                });
            }
        });
    } else {
        res.json({
            "data": {
                "message": "Error",
                "error": "Missing parameters"
            }
        });
    }
});

module.exports = router;
