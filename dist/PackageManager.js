"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var os_1 = require("os");
var events_1 = require("events");
var linux_command_exists_1 = require("linux-command-exists");
var linux_shell_command_1 = require("linux-shell-command");
var assert_1 = require("assert");
var PackageManager = /** @class */ (function () {
    function PackageManager() {
        if (os_1.platform() !== 'linux') {
            throw Error("This module only runs on linux");
        }
        this.packageManagerName = '';
        this.error = null;
        this.ready = false;
        this.events = new events_1.EventEmitter();
    }
    PackageManager.prototype.findPackageManager = function (callback) {
        var _this = this;
        var result = new Promise(function (resolve, reject) {
            var kpms = Object.keys(PackageManager.knownPackageManagers);
            var p = [];
            var _loop_1 = function (i) {
                if (kpms[i] !== 'unknown') {
                    p.push(new Promise(function (resolve, reject) {
                        linux_command_exists_1.commandExists(kpms[i]).then(function (exists) {
                            resolve(exists === true);
                        }).catch(function (e) {
                            reject(e);
                        });
                    }));
                }
            };
            for (var i = 0; i < kpms.length; i++) {
                _loop_1(i);
            }
            Promise.all(p).then(function (results) {
                for (var i = 0; i < results.length; i++) {
                    if (results[i] === true) {
                        _this.error = null;
                        _this.ready = true;
                        _this.packageManagerName = kpms[i];
                        resolve();
                        return;
                    }
                }
                _this.error = null;
                _this.ready = true;
                _this.packageManagerName = "unknown";
                resolve();
            }).catch(function (e) {
                _this.error = e;
                _this.ready = true;
                _this.packageManagerName = "unknown";
                reject(e);
            });
        });
        if (typeof callback === "undefined") {
            return result;
        }
        else {
            result.then(function () {
                callback();
            }).catch(function (e) {
                throw e;
            });
        }
    };
    PackageManager.prototype.updateDatabase = function (callback) {
        var _this = this;
        var result = new Promise(function (resolve, reject) {
            if (_this.ok()) {
                if (_this.known()) {
                    try {
                        var update = linux_shell_command_1.shellCommand(PackageManager.knownPackageManagers[_this.packageManagerName].commands.update, [], undefined);
                        update.events.on('pid', function (pid) {
                            _this.events.emit('pid', pid);
                        }).on('stdout', function (stdout) {
                            _this.events.emit('stdout', stdout);
                        }).on('stderr', function (stderr) {
                            _this.events.emit('stderr', stderr);
                        }).on('exit', function (code) {
                            _this.events.emit('exit', code);
                        }).on('error', function (error) {
                            _this.events.emit('error', error);
                        });
                        update.execute(function (success) {
                            if (success === true) {
                                resolve();
                            }
                            else {
                                reject(update.error);
                            }
                        });
                    }
                    catch (e) {
                        reject(e);
                    }
                }
                else {
                    reject(Error("Impossible to update packages database without knowing the package manager used"));
                }
            }
            else {
                _this.findPackageManager().then(function () {
                    if (typeof callback === "undefined") {
                        _this.updateDatabase().then(function (r) {
                            resolve(r);
                        }).catch(function (e) {
                            reject(e);
                        });
                    }
                    else {
                        _this.updateDatabase(callback);
                    }
                }).catch(function (e) {
                    reject(e);
                });
            }
        });
        if (typeof callback === "undefined") {
            return result;
        }
        else {
            result.then(function () {
                callback();
            }).catch(function (e) {
                throw e;
            });
        }
    };
    PackageManager.prototype.listUpgradablePackages = function (callback) {
        var _this = this;
        var result = new Promise(function (resolve, reject) {
            if (_this.ok()) {
                if (_this.known()) {
                    linux_shell_command_1.execute(PackageManager.knownPackageManagers[_this.packageManagerName].commands.upgradable, []).then(function (_a) {
                        var sc = _a.shellCommand, success = _a.success;
                        if (success === true) {
                            var packages = [];
                            var buf = sc.stdout.split('\n');
                            for (var i = 0; i < buf.length; i++) {
                                var packageInformations = buf[i].split(' ');
                                var p = {
                                    name: packageInformations[0],
                                    currentVersion: packageInformations[1],
                                    lastVersion: packageInformations[2]
                                };
                                packages.push(p);
                            }
                            resolve(packages);
                        }
                        else {
                            reject(sc.error);
                        }
                    });
                }
                else {
                    reject(Error("Impossible to list upgradable packages without knowing the package manager used"));
                }
            }
            else {
                _this.findPackageManager().then(function () {
                    if (typeof callback === "undefined") {
                        _this.listUpgradablePackages().then(function (r) {
                            resolve(r);
                        }).catch(function (e) {
                            reject(e);
                        });
                    }
                    else {
                        _this.listUpgradablePackages(callback);
                    }
                }).catch(function (e) {
                    reject(e);
                });
            }
        });
        if (typeof callback === "undefined") {
            return result;
        }
        else {
            result.then(function (r) {
                callback(r);
            }).catch(function (e) {
                throw e;
            });
        }
    };
    PackageManager.prototype.upgradePackages = function (callback) {
        var _this = this;
        var result = new Promise(function (resolve, reject) {
            if (_this.ok()) {
                if (_this.known()) {
                    try {
                        var upgrade = linux_shell_command_1.shellCommand(PackageManager.knownPackageManagers[_this.packageManagerName].commands.upgrade, []);
                        upgrade.events.on('pid', function (pid) {
                            _this.events.emit('pid', pid);
                        }).on('stdout', function (stdout) {
                            _this.events.emit('stdout', stdout);
                        }).on('stderr', function (stderr) {
                            _this.events.emit('stderr', stderr);
                        }).on('exit', function (code) {
                            _this.events.emit('exit', code);
                        }).on('error', function (error) {
                            _this.events.emit('error', error);
                        });
                        _this.updateDatabase().then(function () {
                            upgrade.execute(function (success) {
                                if (success === true) {
                                    resolve();
                                }
                                else {
                                    reject(upgrade.error);
                                }
                            });
                        }).catch(function (e) {
                            reject(e);
                        });
                    }
                    catch (e) {
                        reject(e);
                    }
                }
                else {
                    reject(Error("Impossible to upgrade packages without knowing the package manager used"));
                }
            }
            else {
                _this.findPackageManager().then(function () {
                    if (typeof callback === "undefined") {
                        _this.upgradePackages().then(function (r) {
                            resolve(r);
                        }).catch(function (e) {
                            reject(e);
                        });
                    }
                    else {
                        _this.upgradePackages(callback);
                    }
                }).catch(function (e) {
                    reject(e);
                });
            }
        });
        if (typeof callback === "undefined") {
            return result;
        }
        else {
            result.then(function () {
                callback();
            }).catch(function (e) {
                throw e;
            });
        }
    };
    PackageManager.prototype.doesPackageExists = function (packageName, callback) {
        var _this = this;
        var result = new Promise(function (resolve, reject) {
            if (_this.ok()) {
                if (_this.known()) {
                    linux_shell_command_1.execute(PackageManager.knownPackageManagers[_this.packageManagerName].commands.exists, [packageName]).then(function (_a) {
                        var success = _a.success;
                        resolve(success);
                    }).catch(function (e) {
                        assert_1.rejects(e);
                    });
                }
                else {
                    reject(Error("Impossible to check if a package exists without knowing the package manager used"));
                }
            }
            else {
                _this.findPackageManager().then(function () {
                    if (typeof callback === "undefined") {
                        _this.doesPackageExists(packageName).then(function (r) {
                            resolve(r);
                        }).catch(function (e) {
                            reject(e);
                        });
                    }
                    else {
                        _this.doesPackageExists(packageName, callback);
                    }
                }).catch(function (e) {
                    reject(e);
                });
            }
        });
        if (typeof callback === "undefined") {
            return result;
        }
        else {
            result.then(function (r) {
                callback(r);
            }).catch(function (e) {
                throw e;
            });
        }
    };
    PackageManager.prototype.isPackageInstalled = function (packageName, callback) {
        var _this = this;
        var result = new Promise(function (resolve, reject) {
            if (_this.ok()) {
                if (_this.known()) {
                    linux_shell_command_1.execute(PackageManager.knownPackageManagers[_this.packageManagerName].commands.isInstalled, [packageName]).then(function (_a) {
                        var success = _a.success;
                        resolve(success);
                    }).catch(function (e) {
                        reject(e);
                    });
                }
                else {
                    reject(Error("Impossible to check if a package is installed without knowing the package manager used"));
                }
            }
            else {
                _this.findPackageManager().then(function () {
                    if (typeof callback === "undefined") {
                        _this.isPackageInstalled(packageName).then(function (r) {
                            resolve(r);
                        }).catch(function (e) {
                            reject(e);
                        });
                    }
                    else {
                        _this.isPackageInstalled(packageName, callback);
                    }
                }).catch(function (e) {
                    reject(e);
                });
            }
        });
        if (typeof callback === "undefined") {
            return result;
        }
        else {
            result.then(function (r) {
                callback(r);
            }).catch(function (e) {
                throw e;
            });
        }
    };
    PackageManager.prototype.installPackage = function (packageName, callback) {
        var _this = this;
        var result = new Promise(function (resolve, reject) {
            if (_this.ok()) {
                if (_this.known()) {
                    var packages_1;
                    var command_1 = PackageManager.knownPackageManagers[_this.packageManagerName].commands.install;
                    if (typeof packageName === 'string') {
                        packages_1 = [packageName];
                    }
                    else {
                        packages_1 = packageName;
                        command_1 = command_1.replace(/'\!\?\!'/, new Array(packageName.length).fill("'!?!'").join(' '));
                    }
                    _this.updateDatabase().then(function () {
                        var install = linux_shell_command_1.shellCommand(command_1, packages_1);
                        install.events.on('pid', function (pid) {
                            _this.events.emit('pid', pid);
                        }).on('stdout', function (stdout) {
                            _this.events.emit('stdout', stdout);
                        }).on('stderr', function (stderr) {
                            _this.events.emit('stderr', stderr);
                        }).on('exit', function (code) {
                            _this.events.emit('exit', code);
                        }).on('error', function (error) {
                            _this.events.emit('error', error);
                        });
                        install.execute(function (success) {
                            if (success === true) {
                                resolve();
                            }
                            else {
                                reject(install.error);
                            }
                        });
                    }).catch(function (e) {
                        reject(e);
                    });
                }
                else {
                    reject(Error("Impossible to install a package without knowing the package manager used"));
                }
            }
            else {
                _this.findPackageManager().then(function () {
                    if (typeof callback === "undefined") {
                        _this.installPackage(packageName).then(function () {
                            resolve();
                        }).catch(function (e) {
                            reject(e);
                        });
                    }
                    else {
                        _this.installPackage(packageName, callback);
                    }
                }).catch(function (e) {
                    reject(e);
                });
            }
        });
        if (typeof callback === "undefined") {
            return result;
        }
        else {
            result.then(function () {
                callback();
            }).catch(function (e) {
                throw e;
            });
        }
    };
    PackageManager.prototype.uninstallPackage = function (packageName, callback) {
        var _this = this;
        var result = new Promise(function (resolve, reject) {
            if (_this.ok()) {
                if (_this.known()) {
                    var packages = void 0;
                    var command = PackageManager.knownPackageManagers[_this.packageManagerName].commands.uninstall;
                    if (typeof packageName === 'string') {
                        packages = [packageName];
                    }
                    else {
                        packages = packageName;
                        command = command.replace(/'\!\?\!'/, new Array(packageName.length).fill("'!?!'").join(' '));
                    }
                    var uninstall = linux_shell_command_1.shellCommand(command, packages);
                    uninstall.events.on('pid', function (pid) {
                        _this.events.emit('pid', pid);
                    }).on('stdout', function (stdout) {
                        _this.events.emit('stdout', stdout);
                    }).on('stderr', function (stderr) {
                        _this.events.emit('stderr', stderr);
                    }).on('exit', function (code) {
                        _this.events.emit('exit', code);
                    }).on('error', function (error) {
                        _this.events.emit('error', error);
                    });
                    uninstall.execute(function (success) {
                        if (success === true) {
                            resolve();
                        }
                        else {
                            reject(uninstall.error);
                        }
                    });
                }
                else {
                    reject(Error("Impossible to uninstall a package without knowing the package manager used"));
                }
            }
            else {
                _this.findPackageManager().then(function () {
                    if (typeof callback === "undefined") {
                        _this.uninstallPackage(packageName).then(function () {
                            resolve();
                        }).catch(function (e) {
                            reject(e);
                        });
                    }
                    else {
                        _this.uninstallPackage(packageName, callback);
                    }
                }).catch(function (e) {
                    reject(e);
                });
            }
        });
        if (typeof callback === "undefined") {
            return result;
        }
        else {
            result.then(function () {
                callback();
            }).catch(function (e) {
                throw e;
            });
        }
    };
    PackageManager.prototype.searchPackage = function (packageName, callback) {
        var _this = this;
        var result = new Promise(function (resolve, reject) {
            if (_this.ok()) {
                if (_this.known()) {
                    linux_shell_command_1.execute(PackageManager.knownPackageManagers[_this.packageManagerName].commands.search, [packageName]).then(function (_a) {
                        var sc = _a.shellCommand, success = _a.success;
                        if (success === true) {
                            resolve(sc.stdout.split('\n'));
                        }
                        else {
                            reject(sc.error);
                        }
                    });
                }
                else {
                    reject(Error("Impossible to search for packages without knowing the package manager used"));
                }
            }
            else {
                _this.findPackageManager().then(function () {
                    if (typeof callback === "undefined") {
                        _this.searchPackage(packageName).then(function (r) {
                            resolve(r);
                        }).catch(function (e) {
                            reject(e);
                        });
                    }
                    else {
                        _this.searchPackage(packageName, callback);
                    }
                }).catch(function (e) {
                    reject(e);
                });
            }
        });
        if (typeof callback === "undefined") {
            return result;
        }
        else {
            result.then(function (r) {
                callback(r);
            }).catch(function (e) {
                throw e;
            });
        }
    };
    PackageManager.prototype.ok = function () {
        return this.ready && this.error === null && this.packageManagerName !== '';
    };
    PackageManager.prototype.known = function () {
        return this.ok() && this.packageManagerName !== '' && this.packageManagerName !== 'unknown';
    };
    PackageManager.knownPackageManagers = {
        'pacman': {
            name: "pacman",
            commands: {
                update: "sudo pacman -Syy",
                upgradable: "pacman -Qu | tr -d '\\-\\>' | tr -s ' '",
                upgrade: "sudo pacman -Su --noconfirm",
                exists: "pacman -Ssq ^'!?!'$",
                isInstalled: "pacman -Qs ^'!?!'$",
                install: "sudo pacman -S '!?!' --noconfirm",
                uninstall: "sudo pacman -R '!?!' --noconfirm",
                search: "pacman -Ssq '!?!'"
            }
        },
        'apt': {
            name: "apt",
            commands: {
                update: "sudo apt update",
                upgradable: "apt list --upgradable | awk -F ' ' '{print $1 \" \" $6 \" \" $2}' | tr -d ']'",
                upgrade: "sudo apt upgrade -y",
                exists: "apt search ^'!?!'$",
                isInstalled: "dpkg -s '!?!'",
                install: "sudo apt install '!?!' -y",
                uninstall: "sudo apt uninstall '!?!' -y",
                search: "apt search '!?!'"
            }
        }
    };
    return PackageManager;
}());
exports.PackageManager = PackageManager;
