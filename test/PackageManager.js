/* eslint-disable no-undef */
var platform = require('os').platform;
var assert = require('assert');
var PackageManager = require('../dist/PackageManager').PackageManager;

describe('#PackageManager Class (Promises)', function () {
	this.timeout(20000);
	if (platform() === 'linux') {
		it('#findPackageManager', (done) => {
			var pm = new PackageManager();
			if (pm.packageManagerName !== '') {
				done(Error('The package manager name should be empty after the object construction'));
			}
			pm.findPackageManager().then(() => {
				if (pm.packageManagerName !== '') {
					done();
				} else {
					done(Error('The package manager name shouldn\'t be empty after the findPackageManager method'));
				}
			}).catch((e) => {
				done(Error(`Shouldn't fail\n${e}`));
			});
		});
		it('#updateDatabase', (done) => {
			var pm = new PackageManager();
			pm.updateDatabase().then(() => {
				done();
			}).catch((e) => {
				done(Error(`Shouldn't fail\n${e}`));
			});
		});
		it('#listUpgradablePackages', (done) => {
			var pm = new PackageManager();
			pm.listUpgradablePackages().then(() => {
				done();
			}).catch((e) => {
				done(Error(`Shouldn't fail\n${e}`));
			});
		});
		it('#upgradePackages', (done) => {
			var pm = new PackageManager();
			pm.upgradePackages().then(() => {
				done();
			}).catch((e) => {
				done(Error(`Shouldn't fail\n${e}`));
			});
		});
		it('#doesPackageExists', (done) => {
			var pm = new PackageManager();
			pm.doesPackageExists('bash').then((exists) => {
				if (exists === true) {
					pm.doesPackageExists('fvreidfbeyvhifevbdfhvf').then((exists) => {
						if (exists === false) {
							done();
						} else {
							done(Error('The package "fvreidfbeyvhifevbdfhvf" shouldn\'t exists'));
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
			var pm = new PackageManager();
			pm.isPackageInstalled('bash').then((installed) => {
				if (installed === true) {
					pm.isPackageInstalled('fndoeugnufgodgufdgbf').then((installed) => {
						if (installed === false) {
							done();
						} else {
							done(Error('The package "fndoeugnufgodgufdgbf" shouldn\'t be installed'));
						}
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
			var pm = new PackageManager();
			pm.isPackageInstalled(packageName).then((installed) => {
				if (installed === false) {
					pm.installPackage(packageName).then(() => {
						pm.uninstallPackage(packageName).then(() => {
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
			assert.throws(() => new PackageManager(), 'Shouldn\'t work on this platform');
		});
	}
});

describe('#PackageManager Class (Callbacks)', function () {
	this.timeout(20000);
	if (platform() === 'linux') {
		it('#findPackageManager', (done) => {
			var pm = new PackageManager();
			if (pm.packageManagerName !== '') {
				done(Error('The package manager name should be empty after the object construction'));
			}
			try {
				pm.findPackageManager(() => {
					if (pm.packageManagerName !== '') {
						done();
					} else {
						done(Error('The package manager name shouldn\'t be empty after the findPackageManager method'));
					}
				});
			}catch(e){
				done(Error(`Shouldn't fail\n${e}`));
			}
		});
		it('#updateDatabase', (done) => {
			var pm = new PackageManager();
			try{
				pm.updateDatabase(()=>{
					done();
				});
			}catch(e){
				done(Error(`Shouldn't fail\n${e}`));
			}
		});
		it('#listUpgradablePackages', (done) => {
			var pm = new PackageManager();
			try{
				pm.listUpgradablePackages(()=>{
					done();
				});
			}catch(e){
				done(Error(`Shouldn't fail\n${e}`));
			}
		});
		it('#upgradePackages', (done) => {
			var pm = new PackageManager();
			try{
				pm.upgradePackages(()=>{
					done();
				});
			}catch(e){
				done(Error(`Shouldn't fail\n${e}`));
			}
		});
		it('#doesPackageExists', (done) => {
			var pm = new PackageManager();
			try{
				pm.doesPackageExists('bash', (exists)=>{
					if(exists === true){
						try{
							pm.doesPackageExists('fvreidfbeyvhifevbdfhvf', (exists)=>{
								if(exists === false){
									done();
								}else{
									done(Error('The package "fvreidfbeyvhifevbdfhvf" shouldn\'t exists'));
								}
							});
						}catch(e){
							done(Error(`Shouldn't fail\n${e}`));
						}
					}else{
						done(Error('The package "bash" should exists'));
					}
				});
			}catch(e){
				done(Error(`Shouldn't fail\n${e}`));
			}
		});
		it('#isPackageInstalled', (done) => {
			var pm = new PackageManager();
			try{
				pm.isPackageInstalled('bash', (installed)=>{
					if(installed === true){
						try{
							pm.isPackageInstalled('fndoeugnufgodgufdgbf', (installed)=>{
								if(installed === false){
									done();
								}else{
									done(Error('The package "fndoeugnufgodgufdgbf" shouldn\'t be installed'));
								}
							});
						}catch(e){
							done(Error(`Shouldn't fail\n${e}`));
						}
					}else{
						done(Error('The package "bash" should be installed'));
					}
				});
			}catch(e){
				done(Error(`Shouldn't fail\n${e}`));
			}
		});
		it('#(un)installPackage', (done) => {
			var packageName = 'tcsh';
			var pm = new PackageManager();
			try{
				pm.isPackageInstalled(packageName, (installed)=>{
					if(installed === false){
						try{
							pm.installPackage(packageName, ()=>{
								try{
									pm.uninstallPackage(packageName, ()=>{
										done();
									});
								}catch(e){
									done(Error(`Shouldn't fail\n${e}\n\nThe package ${packageName} hasn't been uninstalled, you'll have to uninstall it manually.`));
								}
							});
						}catch(e){
							done(Error(`Shouldn't fail\n${e}`));
						}
					}else{
						done(Error(`The package ${packageName} is already installed so if you want to test the install and uninstall package functions change the packageName variable.`));
					}
				});
			}catch(e){
				done(Error(`Shouldn't fail\n${e}`));
			}
		});
	} else {
		it('#Bad platform', () => {
			assert.throws(() => new PackageManager(), 'Shouldn\'t work on this platform');
		});
	}
});
