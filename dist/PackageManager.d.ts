import { ShellCommandEvents } from "linux-shell-command/dist/ShellCommand";
export declare type packageManagerInformations = {
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
    };
};
export declare class PackageManager {
    packageManagerName: string;
    error: Error | null;
    ready: boolean;
    events: ShellCommandEvents;
    static knownPackageManagers: {
        [key: string]: packageManagerInformations;
    };
    /**
     * @throws
     */
    constructor();
    findPackageManager(): Promise<void>;
    findPackageManager(callback: (error: Error | null) => void): void;
    updateDatabase(): Promise<void>;
    updateDatabase(callback: (error: Error | null) => void): void;
    listUpgradablePackages(): Promise<UpgradablePackage[]>;
    listUpgradablePackages(callback: (error: Error | null, upgradablePackages: UpgradablePackage[]) => void): void;
    upgradePackages(): Promise<void>;
    upgradePackages(callback: (error: Error | null) => void): void;
    doesPackageExists(packageName: string): Promise<boolean>;
    doesPackageExists(packageName: string, callback: (error: Error | null, exists: boolean) => void): void;
    isPackageInstalled(packageName: string): Promise<boolean>;
    isPackageInstalled(packageName: string, callback: (error: Error | null, installed: boolean) => void): void;
    installPackage(packageName: string | string[]): Promise<void>;
    installPackage(packageName: string | string[], callback: (error: Error | null) => void): void;
    uninstallPackage(packageName: string | string[]): Promise<void>;
    uninstallPackage(packageName: string | string[], callback: (error: Error | null) => void): void;
    searchPackage(packageName: string): Promise<string[]>;
    searchPackage(packageName: string, callback: (error: Error | null, packages: string[]) => void): void;
    ok(): boolean;
    known(): boolean;
}
export declare type UpgradablePackage = {
    name: string;
    currentVersion: string;
    lastVersion: string;
};
