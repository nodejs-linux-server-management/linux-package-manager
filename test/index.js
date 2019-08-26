/* eslint-disable no-undef */
var platform = require('os').platform;
var assert = require('assert');
var index = require('../dist/index');

describe('#PackageManager Index (Promises)', function () {
	this.timeout(20000);
	if (platform() === 'linux') {
		it('#new PackageManager', () => {
			assert.doesNotThrow(() => index.packageManager());
		});
		it('#PackageManagerName', (done) => {
			if (index.packageManager().packageManagerName === '') {
				index.packageManagerName().then((name) => {
					if (name === '') {
						done(Error('The package manager name shouldn\'t be empty'));
					} else {
						done();
					}
				}).catch((e) => {
					done(Error(`Shouldn't fail\n${e}`));
				});
			} else {
				done(Error('The package manager name should be empty after the object construction'));
			}
		});
		it('#UpdateDatabase', (done) => {
			index.updateDatabase().then(() => {
				done();
			}).catch((e) => {
				done(Error(`Shouldn't fail\n${e}`));
			});
		});
		it('#ListUpgradablePackages', (done) => {
			index.listUpgradablePackages().then(() => {
				done();
			}).catch((e) => {
				done(Error(`Shouldn't fail\n${e}`));
			});
		});
		it('#UpgradePackages', (done) => {
			index.upgradePackages().then(() => {
				done();
			}).catch((e) => {
				done(Error(`Shouldn't fail\n${e}`));
			});
		});
		it('#doesPackageExists', (done) => {
			index.doesPackageExists('bash').then((exists) => {
				if (exists === true) {
					index.doesPackageExists('fndejidgnbfudbgfeuyovbu').then((exists) => {
						if (exists === false) {
							done();
						} else {
							done(Error('The package "fndejidgnbfudbgfeuyovbu" shouldn\'t exists'));
						}
					}).catch((e) => {
						done(Error(`Shouldn't fail\n${e}`));
					});
				} else {
					done(Error('The package "bash" should exists'));
				}
			}).catch((e) => {
				done(Error(`Shouldn't fail\n${e}`));
			});
		});
		it('#isPackageInstalled', (done) => {
			index.isPackageInstalled('bash').then((installed) => {
				if (installed === true) {
					index.isPackageInstalled('fndejidgnbfudbgfeuyovbu').then((installed) => {
						if (installed === false) {
							done();
						} else {
							done(Error('The package "fndejidgnbfudbgfeuyovbu" shouldn\'t be installed'));
						}
					}).catch((e) => {
						done(Error(`Shouldn't fail\n${e}`));
					});
				} else {
					done(Error('The package "bash" should be installed'));
				}
			}).catch((e) => {
				done(Error(`Shouldn't fail\n${e}`));
			});
		});
		it('#(un)installPackage', (done) => {
			var packageName = 'tcsh';
			index.isPackageInstalled(packageName).then((installed) => {
				if (installed === false) {
					index.installPackage(packageName).then(() => {
						index.uninstallPackage(packageName).then(() => {
							done();
						}).catch((e) => {
							done(Error(`Shouldn't fail\n${e}\n\nThe package ${packageName} hasn't been uninstalled, you'll have to uninstall it manually.`));
						});
					}).catch((e) => {
						done(Error(`Shouldn't fail\n${e}`));
					});
				} else {
					done(Error(`The package ${packageName} is already installed so if you want to test the install and uninstall package functions change the packageName variable.`));
				}
			}).catch((e) => {
				done(Error(`Shouldn't fail\n${e}`));
			});
		});
	} else {
		it('#Bad platform', () => {
			assert.throws(() => index.packageManager(), 'Shouldn\'t work on this platform');
		});
	}
});

describe('#PackageManager Index (Callbacks)', function () {
	this.timeout(20000);
	if (platform() === 'linux') {
		it('#PackageManagerName', (done) => {
			if (index.packageManager().packageManagerName === '') {
				index.packageManagerName((error, name) => {
					if (error) {
						done(Error(`Shouldn't fail\n${error}`));
					} else {
						if (name === '') {
							done(Error('The package manager name shouldn\'t be empty'));
						} else {
							done();
						}
					}
				});
			} else {
				done(Error('The package manager name should be empty after the object construction'));
			}
		});
		it('#UpdateDatabase', (done) => {
			index.updateDatabase((error) => {
				if (error) {
					done(Error(`Shouldn't fail\n${error}`));
				} else {
					done();
				}
			});
		});
		it('#ListUpgradablePackages', (done) => {
			index.listUpgradablePackages((error) => {
				if (error) {
					done(Error(`Shouldn't fail\n${error}`));
				} else {
					done();
				}
			});
		});
		it('#UpgradePackages', (done) => {
			index.upgradePackages((error) => {
				if (error) {
					done(Error(`Shouldn't fail\n${error}`));
				} else {
					done();
				}
			});
		});
		it('#doesPackageExists', (done) => {
			index.doesPackageExists('bash', (error, exists) => {
				if (error) {
					done(Error(`Shouldn't fail\n${error}`));
				} else {
					if (exists === true) {
						index.doesPackageExists('fndejidgnbfudbgfeuyovbu', (error, exists) => {
							if (error) {
								done(Error(`Shouldn't fail\n${error}`));
							} else {
								if (exists === false) {
									done();
								} else {
									done(Error('The package "fndejidgnbfudbgfeuyovbu" shouldn\'t exists'));
								}
							}
						});
					} else {
						done(Error('The package "bash" should exists'));
					}
				}
			});
		});
		it('#isPackageInstalled', (done) => {
			index.isPackageInstalled('bash', (error, installed) => {
				if (error) {
					done(Error(`Shouldn't fail\n${error}`));
				} else {
					if (installed === true) {
						index.isPackageInstalled('fndejidgnbfudbgfeuyovbu', (error, installed) => {
							if (error) {
								done(Error(`Shouldn't fail\n${error}`));
							} else {
								if (installed === false) {
									done();
								} else {
									done(Error('The package "fndejidgnbfudbgfeuyovbu" shouldn\'t be installed'));
								}
							}
						});
					} else {
						done(Error('The package "bash" should be installed'));
					}
				}
			});
		});
		it('#(un)installPackage', (done) => {
			var packageName = 'tcsh';
			index.isPackageInstalled(packageName, (error, installed) => {
				if (error) {
					done(Error(`Shouldn't fail\n${error}`));
				} else {
					if (installed === false) {
						index.installPackage(packageName, (error) => {
							if (error) {
								done(Error(`Shouldn't fail\n${error}`));
							} else {
								index.uninstallPackage(packageName, (error) => {
									if (error) {
										done(Error(`Shouldn't fail\n${error}\n\nThe package ${packageName} hasn't been uninstalled, you'll have to uninstall it manually.`));
									} else {
										done();
									}
								});
							}
						});
					} else {
						done(Error(`The package ${packageName} is already installed so if you want to test the install and uninstall package functions change the packageName variable.`));
					}
				}
			});
		});
	} else {
		it('#Bad platform', () => {
			assert.throws(() => index.packageManager(), 'Shouldn\'t work on this platform');
		});
	}
});
