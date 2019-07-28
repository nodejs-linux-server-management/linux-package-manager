import { PackageManager, UpgradablePackage } from "./PackageManager";
import { rejects } from "assert";

export function packageManager(): PackageManager {
	try {
		return new PackageManager();
	} catch (e) {
		throw e;
	}
}

export function packageManagerName(): Promise<string>
export function packageManagerName(callback: (name: string) => void): void;
export function packageManagerName(callback?: (name: string) => void): Promise<string> | void {
	if (typeof callback === 'undefined') {
		try {
			let pm = packageManager();
			return new Promise((resolve, reject) => {
				pm.findPackageManager().then(() => {
					resolve(pm.packageManagerName);
				}).catch((e) => {
					reject(e);
				});
			});
		} catch (e) {
			rejects(e);
		}
	} else {
		try {
			let pm = packageManager();
			pm.findPackageManager(() => {
				callback(pm.packageManagerName);
			});
		} catch (e) {
			throw e;
		}
	}
}

export function updateDatabase(): Promise<void>;
export function updateDatabase(callback: () => void): void;
export function updateDatabase(callback?: () => void): Promise<void> | void {
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
			throw e;
		}
	}
}

export function listUpgradablePackages(): Promise<UpgradablePackage[]>;
export function listUpgradablePackages(callback: (upgradablePackages: UpgradablePackage[]) => void): void
export function listUpgradablePackages(callback?: (upgradablePackages: UpgradablePackage[]) => void): Promise<UpgradablePackage[]> | void {
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
			throw e;
		}
	}
}

export function upgradePackages(): Promise<void>;
export function upgradePackages(callback: () => void): void;
export function upgradePackages(callback?: () => void): Promise<void> | void {
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
			throw e;
		}
	}
}

export function doesPackageExists(packageName: string): Promise<boolean>;
export function doesPackageExists(packageName: string, callback: (exists: boolean) => void): void
export function doesPackageExists(packageName: string, callback?: (exists: boolean) => void): Promise<boolean> | void {
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
			throw e;
		}
	}
}

export function isPackageInstalled(packageName: string): Promise<boolean>;
export function isPackageInstalled(packageName: string, callback: (installed: boolean) => void): void;
export function isPackageInstalled(packageName: string, callback?: (installed: boolean) => void): Promise<boolean> | void {
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
			throw e;
		}
	}
}

export function installPackage(packageName: string | string[]): Promise<void>;
export function installPackage(packageName: string | string[], callback: () => void): void;
export function installPackage(packageName: string | string[], callback?: () => void): Promise<void> | void {
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
			throw e;
		}
	}
}

export function uninstallPackage(packageName: string | string[]): Promise<void>;
export function uninstallPackage(packageName: string | string[], callback: () => void): void;
export function uninstallPackage(packageName: string | string[], callback?: () => void): Promise<void> | void {
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
			throw e;
		}
	}
}

export function searchPackage(packageName: string): Promise<string[]>;
export function searchPackage(packageName: string, callback: (packages: string[]) => void): void;
export function searchPackage(packageName: string, callback?: (packages: string[]) => void): Promise<string[]> | void {
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
			throw e;
		}
	}
}
