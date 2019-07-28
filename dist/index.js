"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PackageManager_1 = require("./PackageManager");
var assert_1 = require("assert");
function packageManager() {
    try {
        return new PackageManager_1.PackageManager();
    }
    catch (e) {
        throw e;
    }
}
exports.packageManager = packageManager;
function packageManagerName(callback) {
    if (typeof callback === 'undefined') {
        try {
            var pm_1 = packageManager();
            return new Promise(function (resolve, reject) {
                pm_1.findPackageManager().then(function () {
                    resolve(pm_1.packageManagerName);
                }).catch(function (e) {
                    reject(e);
                });
            });
        }
        catch (e) {
            assert_1.rejects(e);
        }
    }
    else {
        try {
            var pm_2 = packageManager();
            pm_2.findPackageManager(function () {
                callback(pm_2.packageManagerName);
            });
        }
        catch (e) {
            throw e;
        }
    }
}
exports.packageManagerName = packageManagerName;
function updateDatabase(callback) {
    if (typeof callback === 'undefined') {
        try {
            return packageManager().updateDatabase();
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
    else {
        try {
            packageManager().updateDatabase(callback);
        }
        catch (e) {
            throw e;
        }
    }
}
exports.updateDatabase = updateDatabase;
function listUpgradablePackages(callback) {
    if (typeof callback === 'undefined') {
        try {
            return packageManager().listUpgradablePackages();
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
    else {
        try {
            packageManager().listUpgradablePackages(callback);
        }
        catch (e) {
            throw e;
        }
    }
}
exports.listUpgradablePackages = listUpgradablePackages;
function upgradePackages(callback) {
    if (typeof callback === 'undefined') {
        try {
            return packageManager().upgradePackages();
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
    else {
        try {
            packageManager().upgradePackages(callback);
        }
        catch (e) {
            throw e;
        }
    }
}
exports.upgradePackages = upgradePackages;
function doesPackageExists(packageName, callback) {
    if (typeof callback === 'undefined') {
        try {
            return packageManager().doesPackageExists(packageName);
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
    else {
        try {
            packageManager().doesPackageExists(packageName, callback);
        }
        catch (e) {
            throw e;
        }
    }
}
exports.doesPackageExists = doesPackageExists;
function isPackageInstalled(packageName, callback) {
    if (typeof callback === 'undefined') {
        try {
            return packageManager().isPackageInstalled(packageName);
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
    else {
        try {
            packageManager().isPackageInstalled(packageName, callback);
        }
        catch (e) {
            throw e;
        }
    }
}
exports.isPackageInstalled = isPackageInstalled;
function installPackage(packageName, callback) {
    if (typeof callback === 'undefined') {
        try {
            return packageManager().installPackage(packageName);
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
    else {
        try {
            packageManager().installPackage(packageName, callback);
        }
        catch (e) {
            throw e;
        }
    }
}
exports.installPackage = installPackage;
function uninstallPackage(packageName, callback) {
    if (typeof callback === 'undefined') {
        try {
            return packageManager().uninstallPackage(packageName);
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
    else {
        try {
            packageManager().uninstallPackage(packageName, callback);
        }
        catch (e) {
            throw e;
        }
    }
}
exports.uninstallPackage = uninstallPackage;
function searchPackage(packageName, callback) {
    if (typeof callback === 'undefined') {
        try {
            return packageManager().searchPackage(packageName);
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
    else {
        try {
            packageManager().searchPackage(packageName, callback);
        }
        catch (e) {
            throw e;
        }
    }
}
exports.searchPackage = searchPackage;
