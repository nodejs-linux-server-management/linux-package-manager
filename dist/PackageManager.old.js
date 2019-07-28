"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import { ShellCommand, ShellCommandEvents } from "./ShellCommand";
// import { BooleanResult } from "../Types/Result";
// import { commandExists } from "../Informations/system";
var os_1 = require("os");
var events_1 = require("events");
var linux_command_exists_1 = require("linux-command-exists");
var PackageManager = /** @class */ (function () {
    function PackageManager() {
        if (os_1.platform() !== 'linux') {
            throw Error("This module only runs on linux");
        }
        this.packageManagerName = "unknown";
        this.error = null;
        this.ready = false;
        this.events = new events_1.EventEmitter();
    }
    PackageManager.prototype.findPackageManager = function (callback) {
        var _this = this;
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
                var result = results[i];
                if (result.error !== null) {
                    _this.error = result.error;
                    _this.ready = true;
                    _this.packageManagerName = "unknown";
                    callback({ error: _this.error, data: _this.ok() });
                    return;
                }
                else if (result.data === true) {
                    _this.error = null;
                    _this.ready = true;
                    _this.packageManagerName = kpms[i];
                    callback({ error: _this.error, data: _this.ok() });
                    return;
                }
                else {
                }
            }
            _this.error = null;
            _this.ready = true;
            _this.packageManagerName = "unknown";
            callback({ error: _this.error, data: _this.ok() });
        }).catch(function (error) {
            callback({ error: error, data: false });
        });
    };
    PackageManager.prototype.updateDatabase = function (callback) {
        var _this = this;
        if (this.ok()) {
            if (this.known()) {
                var update = new ShellCommand(PackageManager.knownPackageManagers[this.packageManagerName].commands.update, []);
                update.execute(function () {
                    callback({ error: update.error, data: update.error === null });
                });
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
            }
            else {
                callback({ error: Error("Impossible to update packages database without knowing the package manager used"), data: false });
            }
        }
        else {
            this.findPackageManager(function (found) {
                if (found.error === null) {
                    _this.updateDatabase(callback);
                }
                else {
                    callback(found);
                }
            });
        }
    };
    PackageManager.prototype.listUpgradablePackages = function (callback) {
        var _this = this;
        if (this.ok()) {
            if (this.known()) {
                this.updateDatabase(function (updated) {
                    if (updated.error === null) {
                        var upgradable = new ShellCommand(PackageManager.knownPackageManagers[_this.packageManagerName].commands.upgradable, []);
                        upgradable.events.on('pid', function (pid) {
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
                        upgradable.execute(function (success) {
                            if (success) {
                                var packages = { error: null, data: {} };
                                var buf = upgradable.stdout.split('\n');
                                for (var i = 0; i < buf.length; i++) {
                                    var packageInformations = buf[i].split(' ');
                                    var p = {
                                        name: packageInformations[0],
                                        currentVersion: packageInformations[1],
                                        lastVersion: packageInformations[2]
                                    };
                                    packages.data[p.name] = p;
                                }
                                callback(packages);
                            }
                            else {
                                callback({ error: upgradable.error, data: {} });
                            }
                        });
                    }
                    else {
                        callback({ error: updated.error, data: {} });
                    }
                });
            }
            else {
                callback({ error: Error("Impossible to list upgradable packages without knowing the package manager used"), data: {} });
            }
        }
        else {
            this.findPackageManager(function (found) {
                if (found.error === null) {
                    _this.listUpgradablePackages(callback);
                }
                else {
                    callback({ error: found.error, data: {} });
                }
            });
        }
    };
    PackageManager.prototype.upgradePackages = function (callback) {
        var _this = this;
        if (this.ok()) {
            if (this.known()) {
                var upgrade = new ShellCommand(PackageManager.knownPackageManagers[this.packageManagerName].commands.upgrade, []);
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
                this.updateDatabase(function (updated) {
                    if (updated.error === null) {
                        upgrade.execute(function (success) {
                            if (success === true) {
                                callback({ error: null, data: true });
                            }
                            else {
                                callback({ error: upgrade.error, data: false });
                            }
                        });
                    }
                    else {
                        callback({ error: updated.error, data: false });
                    }
                });
            }
            else {
                callback({ error: Error("Impossible to upgrade packages without knowing the package manager used"), data: false });
            }
        }
        else {
            this.findPackageManager(function (found) {
                if (found.error === null) {
                    _this.upgradePackages(callback);
                }
                else {
                    callback(found);
                }
            });
        }
    };
    PackageManager.prototype.doesPackageExists = function (packageName, callback) {
        var _this = this;
        if (this.ok()) {
            if (this.known()) {
                var exists = new ShellCommand(PackageManager.knownPackageManagers[this.packageManagerName].commands.exists, [packageName]);
                this.updateDatabase(function (success) {
                    if (success.error === null) {
                        exists.execute(function (success) {
                            if (success) {
                                callback({ error: null, data: true });
                            }
                            else {
                                if (exists.exitStatus === 1) {
                                    callback({ error: null, data: false });
                                }
                                else {
                                    callback({ error: exists.error, data: false });
                                }
                            }
                        });
                    }
                    else {
                        callback(success);
                    }
                });
            }
            else {
                callback({ error: Error("Impossible to check if a package exists without knowing the package manager used"), data: false });
            }
        }
        else {
            this.findPackageManager(function (found) {
                if (found.error === null) {
                    _this.doesPackageExists(packageName, callback);
                }
                else {
                    callback(found);
                }
            });
        }
    };
    PackageManager.prototype.isPackageInstalled = function (packageName, callback) {
        var _this = this;
        if (this.ok()) {
            if (this.known()) {
                var installed = new ShellCommand(PackageManager.knownPackageManagers[this.packageManagerName].commands.isInstalled, [packageName]);
                installed.execute(function (success) {
                    if (success) {
                        callback({ error: null, data: true });
                    }
                    else {
                        if (installed.exitStatus === 1) {
                            callback({ error: null, data: false });
                        }
                        else {
                            callback({ error: installed.error, data: false });
                        }
                    }
                });
            }
            else {
                callback({ error: Error("Impossible to check if a package is installed without knowing the package manager used"), data: false });
            }
        }
        else {
            this.findPackageManager(function (found) {
                if (found.error === null) {
                    _this.isPackageInstalled(packageName, callback);
                }
                else {
                    callback(found);
                }
            });
        }
    };
    PackageManager.prototype.installPackage = function (packageName, callback) {
        var _this = this;
        if (this.ok()) {
            if (this.known()) {
                var packages_1;
                var command_1 = PackageManager.knownPackageManagers[this.packageManagerName].commands.install;
                if (typeof packageName === 'string') {
                    packages_1 = [packageName];
                }
                else {
                    packages_1 = packageName;
                    command_1 = command_1.replace(/'\!\?\!'/, new Array(packageName.length).fill("'!?!'").join(' '));
                }
                this.updateDatabase(function (updated) {
                    if (updated.error === null) {
                        var install = new ShellCommand(command_1, packages_1);
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
                            if (success) {
                                callback({ error: null, data: true });
                            }
                            else {
                                if (install.exitStatus === 1) {
                                    callback({ error: null, data: false });
                                }
                                else {
                                    callback({ error: install.error, data: false });
                                }
                            }
                        });
                    }
                    else {
                        callback(updated);
                    }
                });
            }
            else {
                callback({ error: Error("Impossible to install a package without knowing the package manager used"), data: false });
            }
        }
        else {
            this.findPackageManager(function (found) {
                if (found.error === null) {
                    _this.installPackage(packageName, callback);
                }
                else {
                    callback(found);
                }
            });
        }
    };
    PackageManager.prototype.uninstallPackage = function (packageName, callback) {
        var _this = this;
        if (this.ok()) {
            if (this.known()) {
                var packages = void 0;
                var command = PackageManager.knownPackageManagers[this.packageManagerName].commands.uninstall;
                if (typeof packageName === 'string') {
                    packages = [packageName];
                }
                else {
                    packages = packageName;
                    command = command.replace(/'\!\?\!'/, new Array(packageName.length).fill("'!?!'").join(' '));
                }
                var uninstall = new ShellCommand(command, packages);
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
                    if (success) {
                        callback({ error: null, data: true });
                    }
                    else {
                        if (uninstall.exitStatus === 1) {
                            callback({ error: null, data: false });
                        }
                        else {
                            callback({ error: uninstall.error, data: false });
                        }
                    }
                });
            }
            else {
                callback({ error: Error("Impossible to uninstall a package without knowing the package manager used"), data: false });
            }
        }
        else {
            this.findPackageManager(function (found) {
                if (found.error === null) {
                    _this.uninstallPackage(packageName, callback);
                }
                else {
                    callback(found);
                }
            });
        }
    };
    PackageManager.prototype.searchPackage = function (packageName, callback) {
        var _this = this;
        if (this.ok()) {
            if (this.known()) {
                var search = new ShellCommand(PackageManager.knownPackageManagers[this.packageManagerName].commands.search, [packageName]);
                search.events.on('pid', function (pid) {
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
                search.execute(function (success) {
                    if (success) {
                        callback({ error: null, data: search.stdout.split('\n') });
                    }
                    else {
                        if (search.exitStatus === 1) {
                            callback({ error: null, data: [] });
                        }
                        else {
                            callback({ error: search.error, data: [] });
                        }
                    }
                });
            }
            else {
                callback({ error: Error("Impossible to search for packages without knowing the package manager used"), data: [] });
            }
        }
        else {
            this.findPackageManager(function (found) {
                if (found.error === null) {
                    _this.searchPackage(packageName, callback);
                }
                else {
                    callback({ error: found.error, data: [] });
                }
            });
        }
    };
    PackageManager.prototype.ok = function () {
        return this.ready && this.error === null;
    };
    PackageManager.prototype.known = function () {
        return this.ok() && this.packageManagerName !== "unknown";
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
