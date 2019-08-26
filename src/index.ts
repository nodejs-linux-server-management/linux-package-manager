import { PackageManager, UpgradablePackage } from "./PackageManager";

/**
 * @throws
 */
export function packageManager(): PackageManager {
	try {
		return new PackageManager();
	} catch (e) {
		throw e;
	}
}

export function packageManagerName(): Promise<string>
export function packageManagerName(callback: (error: Error | null, name: string) => void): void;
export function packageManagerName(callback?: (error: Error | null, name: string) => void): Promise<string> | void {
	if (typeof callback === 'undefined') {
		return new Promise<string>((resolve, reject) => {
			try {
				let pm = packageManager();
				pm.findPackageManager().then(() => {
					resolve(pm.packageManagerName);
				}).catch((e)=>{
					reject(e);
				});
			} catch (e) {
				reject(e);
			}
		});
	} else {
		try {
			let pm = packageManager();
			pm.findPackageManager((error) => {
				if (error) {
					//@ts-ignore;
					callback(error);
				} else {
					callback(error, pm.packageManagerName);
				}
			});
		} catch (e) {
			//@ts-ignore
			callback(e);
		}
	}
}

export function updateDatabase(): Promise<void>;
export function updateDatabase(callback: (error: Error | null) => void): void;
export function updateDatabase(callback?: (error: Error | null) => void): Promise<void> | void {
	if (typeof callback === 'undefined') {
		try {
			return packageManager().updateDatabase();
		} catch (e) {
			return Promise.reject(e);
		}
	} else {
		try {
			packageManager().updateDatabase(callback);
		} catch (e) {
			callback(e);
		}
	}
}

export function listUpgradablePackages(): Promise<UpgradablePackage[]>;
export function listUpgradablePackages(callback: (error: Error | null, upgradablePackages: UpgradablePackage[]) => void): void
export function listUpgradablePackages(callback?: (error: Error | null, upgradablePackages: UpgradablePackage[]) => void): Promise<UpgradablePackage[]> | void {
	if (typeof callback === 'undefined') {
		try {
			return packageManager().listUpgradablePackages();
		} catch (e) {
			return Promise.reject(e);
		}
	} else {
		try {
			packageManager().listUpgradablePackages(callback);
		} catch (e) {
			//@ts-ignore
			callback(e);
		}
	}
}

export function upgradePackages(): Promise<void>;
export function upgradePackages(callback: (error: Error | null) => void): void;
export function upgradePackages(callback?: (error: Error | null) => void): Promise<void> | void {
	if (typeof callback === 'undefined') {
		try {
			return packageManager().upgradePackages();
		} catch (e) {
			return Promise.reject(e);
		}
	} else {
		try {
			packageManager().upgradePackages(callback);
		} catch (e) {
			callback(e);
		}
	}
}

export function doesPackageExists(packageName: string): Promise<boolean>;
export function doesPackageExists(packageName: string, callback: (error: Error | null, exists: boolean) => void): void
export function doesPackageExists(packageName: string, callback?: (error: Error | null, exists: boolean) => void): Promise<boolean> | void {
	if (typeof callback === 'undefined') {
		try {
			return packageManager().doesPackageExists(packageName);
		} catch (e) {
			return Promise.reject(e);
		}
	} else {
		try {
			packageManager().doesPackageExists(packageName, callback);
		} catch (e) {
			//@ts-ignore
			callback(e);
		}
	}
}

export function isPackageInstalled(packageName: string): Promise<boolean>;
export function isPackageInstalled(packageName: string, callback: (error: Error | null, installed: boolean) => void): void;
export function isPackageInstalled(packageName: string, callback?: (error: Error | null, installed: boolean) => void): Promise<boolean> | void {
	if (typeof callback === 'undefined') {
		try {
			return packageManager().isPackageInstalled(packageName);
		} catch (e) {
			return Promise.reject(e);
		}
	} else {
		try {
			packageManager().isPackageInstalled(packageName, callback);
		} catch (e) {
			//@ts-ignore
			callback(e);
		}
	}
}

export function installPackage(packageName: string | string[]): Promise<void>;
export function installPackage(packageName: string | string[], callback: (error: Error | null) => void): void;
export function installPackage(packageName: string | string[], callback?: (error: Error | null) => void): Promise<void> | void {
	if (typeof callback === 'undefined') {
		try {
			return packageManager().installPackage(packageName);
		} catch (e) {
			return Promise.reject(e);
		}
	} else {
		try {
			packageManager().installPackage(packageName, callback);
		} catch (e) {
			callback(e);
		}
	}
}

export function uninstallPackage(packageName: string | string[]): Promise<void>;
export function uninstallPackage(packageName: string | string[], callback: (error: Error | null) => void): void;
export function uninstallPackage(packageName: string | string[], callback?: (error: Error | null) => void): Promise<void> | void {
	if (typeof callback === 'undefined') {
		try {
			return packageManager().uninstallPackage(packageName);
		} catch (e) {
			return Promise.reject(e);
		}
	} else {
		try {
			packageManager().uninstallPackage(packageName, callback);
		} catch (e) {
			callback(e);
		}
	}
}

export function searchPackage(packageName: string): Promise<string[]>;
export function searchPackage(packageName: string, callback: (error: Error | null, packages: string[]) => void): void;
export function searchPackage(packageName: string, callback?: (error: Error | null, packages: string[]) => void): Promise<string[]> | void {
	if (typeof callback === 'undefined') {
		try {
			return packageManager().searchPackage(packageName);
		} catch (e) {
			return Promise.reject(e);
		}
	} else {
		try {
			packageManager().searchPackage(packageName, callback);
		} catch (e) {
			//@ts-ignore
			callback(e);
		}
	}
}
