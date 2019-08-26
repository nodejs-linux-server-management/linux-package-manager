import { PackageManager, UpgradablePackage } from "./PackageManager";
/**
 * @throws
 */
export declare function packageManager(): PackageManager;
export declare function packageManagerName(): Promise<string>;
export declare function packageManagerName(callback: (error: Error | null, name: string) => void): void;
export declare function updateDatabase(): Promise<void>;
export declare function updateDatabase(callback: (error: Error | null) => void): void;
export declare function listUpgradablePackages(): Promise<UpgradablePackage[]>;
export declare function listUpgradablePackages(callback: (error: Error | null, upgradablePackages: UpgradablePackage[]) => void): void;
export declare function upgradePackages(): Promise<void>;
export declare function upgradePackages(callback: (error: Error | null) => void): void;
export declare function doesPackageExists(packageName: string): Promise<boolean>;
export declare function doesPackageExists(packageName: string, callback: (error: Error | null, exists: boolean) => void): void;
export declare function isPackageInstalled(packageName: string): Promise<boolean>;
export declare function isPackageInstalled(packageName: string, callback: (error: Error | null, installed: boolean) => void): void;
export declare function installPackage(packageName: string | string[]): Promise<void>;
export declare function installPackage(packageName: string | string[], callback: (error: Error | null) => void): void;
export declare function uninstallPackage(packageName: string | string[]): Promise<void>;
export declare function uninstallPackage(packageName: string | string[], callback: (error: Error | null) => void): void;
export declare function searchPackage(packageName: string): Promise<string[]>;
export declare function searchPackage(packageName: string, callback: (error: Error | null, packages: string[]) => void): void;
