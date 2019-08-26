import { platform } from "os";
import { EventEmitter } from "events";
import { commandExists } from "linux-command-exists";
import { shellCommand, execute } from "linux-shell-command";
import { ShellCommandEvents, ShellCommand } from "linux-shell-command/dist/ShellCommand";

export type packageManagerInformations = {
	name: string;
	commands: {
		update: string;
		upgrade: string;
		install: string;
		uninstall: string;
		exists: string;
		upgradable: string;
		isInstalled: string;
		search: string;
	}
}

export class PackageManager {

	packageManagerName: string;
	error: Error | null;
	ready: boolean;
	events: ShellCommandEvents;
	static knownPackageManagers: { [key: string]: packageManagerInformations } = {
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

	/**
	 * @throws
	 */
	constructor() {
		if (platform() !== 'linux') {
			throw new Error("This module only runs on linux");
		}
		this.packageManagerName = '';
		this.error = null;
		this.ready = false;
		this.events = new EventEmitter();
	}

	public findPackageManager(): Promise<void>
	public findPackageManager(callback: (error: Error | null) => void): void;
	public findPackageManager(callback?: (error: Error | null) => void): Promise<void> | void {
		var result: Promise<void> = new Promise((resolve, reject) => {
			var kpms = Object.keys(PackageManager.knownPackageManagers);
			var p = [];
			for (let i = 0; i < kpms.length; i++) {
				if (kpms[i] !== 'unknown') {
					p.push(new Promise((resolve, reject) => {
						commandExists(kpms[i]).then((exists) => {
							resolve(exists === true);
						}).catch((e) => {
							reject(e);
						});
					}));
				}
			}
			Promise.all(p).then((results) => {
				for (let i = 0; i < results.length; i++) {
					if (results[i] === true) {
						this.error = null;
						this.ready = true;
						this.packageManagerName = kpms[i];
						resolve();
						return;
					}
				}
				this.error = null;
				this.ready = true;
				this.packageManagerName = "unknown";
				resolve();
			}).catch((e: Error) => {
				this.error = e;
				this.ready = true;
				this.packageManagerName = "unknown";
				reject(e);
			});
		});

		if (typeof callback === "undefined") {
			return result;
		} else {
			result.then(() => {
				callback(null);
			}).catch((e) => {
				callback(e);
			});
		}
	}

	public updateDatabase(): Promise<void>;
	public updateDatabase(callback: (error: Error | null) => void): void;
	public updateDatabase(callback?: (error: Error | null) => void): Promise<void> | void {
		var result: Promise<void> = new Promise((resolve, reject) => {
			if (this.ok()) {
				if (this.known()) {
					try {
						var update = shellCommand(PackageManager.knownPackageManagers[this.packageManagerName].commands.update, [], undefined);
						update.events.on('pid', (pid) => {
							this.events.emit('pid', pid);
						}).on('stdout', (stdout) => {
							this.events.emit('stdout', stdout);
						}).on('stderr', (stderr) => {
							this.events.emit('stderr', stderr);
						}).on('exit', (code) => {
							this.events.emit('exit', code)
						}).on('error', (error) => {
							this.events.emit('error', error);
						});
						update.execute().then((success) => {
							if(success === true){
								resolve();
							}else{
								reject(update.error);
							}
						}).catch((e) => {
							reject(e);
						});
					} catch (e) {
						reject(e);
					}
				} else {
					reject(new Error("Impossible to update packages database without knowing the package manager used"));
				}
			} else {
				this.findPackageManager().then(() => {
					if (typeof callback === "undefined") {
						this.updateDatabase().then((r) => {
							resolve(r);
						}).catch((e) => {
							reject(e);
						});
					} else {
						this.updateDatabase(callback);
					}
				}).catch((e) => {
					reject(e);
				});
			}
		});

		if (typeof callback === "undefined") {
			return result;
		} else {
			result.then(() => {
				callback(null);
			}).catch((e) => {
				callback(e);
			});
		}
	}

	public listUpgradablePackages(): Promise<UpgradablePackage[]>;
	public listUpgradablePackages(callback: (error: Error | null, upgradablePackages: UpgradablePackage[]) => void): void
	public listUpgradablePackages(callback?: (error: Error | null, upgradablePackages: UpgradablePackage[]) => void): Promise<UpgradablePackage[]> | void {
		var result: Promise<UpgradablePackage[]> = new Promise((resolve, reject) => {
			if (this.ok()) {
				if (this.known()) {
					execute(PackageManager.knownPackageManagers[this.packageManagerName].commands.upgradable, []).then(({ shellCommand: sc, success: success }) => {
						if (success === true) {
							let packages: UpgradablePackage[] = [];
							let buf = sc.stdout.split('\n');
							for (let i = 0; i < buf.length; i++) {
								let packageInformations: string[] = buf[i].split(' ');
								let p: UpgradablePackage = {
									name: packageInformations[0],
									currentVersion: packageInformations[1],
									lastVersion: packageInformations[2]
								};
								packages.push(p);
							}
							resolve(packages);
						} else {
							reject(sc.error)
						}
					})
				} else {
					reject(new Error("Impossible to list upgradable packages without knowing the package manager used"));
				}
			} else {
				this.findPackageManager().then(() => {
					if (typeof callback === "undefined") {
						this.listUpgradablePackages().then((r) => {
							resolve(r);
						}).catch((e) => {
							reject(e);
						});
					} else {
						this.listUpgradablePackages(callback);
					}
				}).catch((e) => {
					reject(e);
				});
			}
		});

		if (typeof callback === "undefined") {
			return result;
		} else {
			result.then((r) => {
				callback(null, r);
			}).catch((e) => {
				//@ts-ignore
				callback(null, undefined);
			});
		}
	}

	public upgradePackages(): Promise<void>;
	public upgradePackages(callback: (error: Error | null) => void): void;
	public upgradePackages(callback?: (error: Error | null) => void): Promise<void> | void {
		var result: Promise<void> = new Promise((resolve, reject) => {
			if (this.ok()) {
				if (this.known()) {
					try {
						var upgrade = shellCommand(PackageManager.knownPackageManagers[this.packageManagerName].commands.upgrade, []);
						upgrade.events.on('pid', (pid) => {
							this.events.emit('pid', pid);
						}).on('stdout', (stdout) => {
							this.events.emit('stdout', stdout);
						}).on('stderr', (stderr) => {
							this.events.emit('stderr', stderr);
						}).on('exit', (code) => {
							this.events.emit('exit', code)
						}).on('error', (error) => {
							this.events.emit('error', error);
						});
						this.updateDatabase().then(() => {
							upgrade.execute().then((success) => {
								if(success === true){
									resolve();
								}else{
									reject(upgrade.error);
								}
							}).catch((e) => {
								reject(e);
							});
						}).catch((e) => {
							reject(e);
						});
					} catch (e) {
						reject(e);
					}
				} else {
					reject(new Error("Impossible to upgrade packages without knowing the package manager used"));
				}
			} else {
				this.findPackageManager().then(() => {
					if (typeof callback === "undefined") {
						this.upgradePackages().then((r) => {
							resolve(r);
						}).catch((e) => {
							reject(e);
						});
					} else {
						this.upgradePackages(callback);
					}
				}).catch((e) => {
					reject(e);
				});
			}
		});

		if (typeof callback === "undefined") {
			return result;
		} else {
			result.then(() => {
				callback(null);
			}).catch((e) => {
				callback(e);
			});
		}
	}

	public doesPackageExists(packageName: string): Promise<boolean>;
	public doesPackageExists(packageName: string, callback: (error: Error | null, exists: boolean) => void): void
	public doesPackageExists(packageName: string, callback?: (error: Error | null, exists: boolean) => void): Promise<boolean> | void {
		var result: Promise<boolean> = new Promise((resolve, reject) => {
			if (this.ok()) {
				if (this.known()) {
					execute(PackageManager.knownPackageManagers[this.packageManagerName].commands.exists, [packageName]).then(({ success: success }) => {
						resolve(success);
					}).catch((e) => {
						reject(e);
					});
				} else {
					reject(new Error("Impossible to check if a package exists without knowing the package manager used"));
				}
			} else {
				this.findPackageManager().then(() => {
					if (typeof callback === "undefined") {
						this.doesPackageExists(packageName).then((r) => {
							resolve(r);
						}).catch((e) => {
							reject(e);
						});
					} else {
						this.doesPackageExists(packageName, callback);
					}
				}).catch((e) => {
					reject(e);
				});
			}
		});

		if (typeof callback === "undefined") {
			return result;
		} else {
			result.then((r) => {
				callback(null, r);
			}).catch((e) => {
				//@ts-ignore
				callback(e, undefined);
			});
		}
	}

	public isPackageInstalled(packageName: string): Promise<boolean>;
	public isPackageInstalled(packageName: string, callback: (error: Error | null, installed: boolean) => void): void;
	public isPackageInstalled(packageName: string, callback?: (error: Error | null, installed: boolean) => void): Promise<boolean> | void {
		var result: Promise<boolean> = new Promise((resolve, reject) => {
			if (this.ok()) {
				if (this.known()) {
					execute(PackageManager.knownPackageManagers[this.packageManagerName].commands.isInstalled, [packageName]).then(({ success: success }) => {
						resolve(success);
					}).catch((e) => {
						reject(e);
					});
				} else {
					reject(new Error("Impossible to check if a package is installed without knowing the package manager used"));
				}
			} else {
				this.findPackageManager().then(() => {
					if (typeof callback === "undefined") {
						this.isPackageInstalled(packageName).then((r) => {
							resolve(r);
						}).catch((e) => {
							reject(e);
						});
					} else {
						this.isPackageInstalled(packageName, callback);
					}
				}).catch((e) => {
					reject(e);
				});
			}
		});

		if (typeof callback === "undefined") {
			return result;
		} else {
			result.then((r) => {
				callback(null, r);
			}).catch((e) => {
				//@ts-ignore
				callback(e, undefined);
			});
		}
	}

	public installPackage(packageName: string | string[]): Promise<void>;
	public installPackage(packageName: string | string[], callback: (error: Error | null) => void): void;
	public installPackage(packageName: string | string[], callback?: (error: Error | null) => void): Promise<void> | void {
		var result: Promise<void> = new Promise((resolve, reject) => {
			if (this.ok()) {
				if (this.known()) {
					let packages: string[];
					let command: string = PackageManager.knownPackageManagers[this.packageManagerName].commands.install;
					if (typeof packageName === 'string') {
						packages = [packageName];
					} else {
						packages = packageName;
						command = command.replace(/'\!\?\!'/, new Array(packageName.length).fill("'!?!'").join(' '));
					}
					this.updateDatabase().then(() => {
						var install = shellCommand(command, packages);
						install.events.on('pid', (pid) => {
							this.events.emit('pid', pid);
						}).on('stdout', (stdout) => {
							this.events.emit('stdout', stdout);
						}).on('stderr', (stderr) => {
							this.events.emit('stderr', stderr);
						}).on('exit', (code) => {
							this.events.emit('exit', code)
						}).on('error', (error) => {
							this.events.emit('error', error);
						});
						install.execute().then((success) => {
							if(success === true){
								resolve();
							}else{
								reject(install.error);
							}
						}).catch((e) => {
							reject(e);
						});
					}).catch((e) => {
						reject(e);
					});
				} else {
					reject(new Error("Impossible to install a package without knowing the package manager used"));
				}
			} else {
				this.findPackageManager().then(() => {
					if (typeof callback === "undefined") {
						this.installPackage(packageName).then(() => {
							resolve();
						}).catch((e) => {
							reject(e);
						});
					} else {
						this.installPackage(packageName, callback);
					}
				}).catch((e) => {
					reject(e);
				});
			}
		});

		if (typeof callback === "undefined") {
			return result;
		} else {
			result.then(() => {
				callback(null);
			}).catch((e) => {
				callback(e);
			});
		}
	}

	public uninstallPackage(packageName: string | string[]): Promise<void>;
	public uninstallPackage(packageName: string | string[], callback: (error: Error | null) => void): void;
	public uninstallPackage(packageName: string | string[], callback?: (error: Error | null) => void): Promise<void> | void {
		var result: Promise<void> = new Promise((resolve, reject) => {
			if (this.ok()) {
				if (this.known()) {
					let packages: string[];
					let command: string = PackageManager.knownPackageManagers[this.packageManagerName].commands.uninstall;
					if (typeof packageName === 'string') {
						packages = [packageName];
					} else {
						packages = packageName;
						command = command.replace(/'\!\?\!'/, new Array(packageName.length).fill("'!?!'").join(' '));
					}
					var uninstall = shellCommand(command, packages);
					uninstall.events.on('pid', (pid) => {
						this.events.emit('pid', pid);
					}).on('stdout', (stdout) => {
						this.events.emit('stdout', stdout);
					}).on('stderr', (stderr) => {
						this.events.emit('stderr', stderr);
					}).on('exit', (code) => {
						this.events.emit('exit', code)
					}).on('error', (error) => {
						this.events.emit('error', error);
					});
					uninstall.execute().then((success) => {
						if(success === true){
							resolve();
						}else{
							reject(uninstall.error);
						}
					}).catch((e) => {
						reject(e);
					});
				} else {
					reject(new Error("Impossible to uninstall a package without knowing the package manager used"));
				}
			} else {
				this.findPackageManager().then(() => {
					if (typeof callback === "undefined") {
						this.uninstallPackage(packageName).then(() => {
							resolve();
						}).catch((e) => {
							reject(e);
						});
					} else {
						this.uninstallPackage(packageName, callback);
					}
				}).catch((e) => {
					reject(e);
				});
			}
		});

		if (typeof callback === "undefined") {
			return result;
		} else {
			result.then(() => {
				callback(null);
			}).catch((e) => {
				callback(e);
			});
		}
	}

	public searchPackage(packageName: string): Promise<string[]>;
	public searchPackage(packageName: string, callback: (error: Error | null, packages: string[]) => void): void;
	public searchPackage(packageName: string, callback?: (error: Error | null, packages: string[]) => void): Promise<string[]> | void {
		var result: Promise<string[]> = new Promise((resolve, reject) => {
			if (this.ok()) {
				if (this.known()) {
					execute(PackageManager.knownPackageManagers[this.packageManagerName].commands.search, [packageName]).then(({ shellCommand: sc, success: success }) => {
						if (success === true) {
							resolve(sc.stdout.split('\n'));
						} else {
							reject(sc.error);
						}
					});
				} else {
					reject(new Error("Impossible to search for packages without knowing the package manager used"));
				}
			} else {
				this.findPackageManager().then(() => {
					if (typeof callback === "undefined") {
						this.searchPackage(packageName).then((r) => {
							resolve(r);
						}).catch((e) => {
							reject(e);
						});
					} else {
						this.searchPackage(packageName, callback);
					}
				}).catch((e) => {
					reject(e);
				});
			}
		});

		if (typeof callback === "undefined") {
			return result;
		} else {
			result.then((r) => {
				callback(null, r);
			}).catch((e) => {
				//@ts-ignore
				callback(e, undefined);
			});
		}
	}

	public ok(): boolean {
		return this.ready && this.error === null && this.packageManagerName !== '';
	}

	public known(): boolean {
		return this.ok() && this.packageManagerName !== '' && this.packageManagerName !== 'unknown';
	}
}

export type UpgradablePackage = {
	name: string;
	currentVersion: string;
	lastVersion: string;
}
