# linux-package-manager

Linux package manager wrapper.

## Supported package managers

- ArchLinux: pacman
- Debian: apt

## Availabe functions

### packageManager

Returns a packageManager object.

```javascript
var packageManager = require("linux-package-manager").packageManager;

var pm = packageManager();
```

### packageManagerName

Retrieves the package manager name.

```javascript
var packageManagerName = require("linux-package-manager").packageManagerName;

packageManagerName()
  .then(name => {
    console.log(name);
  })
  .catch(e => {
    console.error(e);
  });

packageManagerName((error, name) => {
  if (error) {
    console.error(error);
  } else {
    console.log(name);
  }
});
```

### updateDatabase

Update the package database. **(require root/sudo)**

```javascript
var updateDatabase = require("linux-package-manager").updateDatabase;

updateDatabase()
  .then(() => {
    console.log("database updated");
  })
  .catch(e => {
    console.error(e);
  });

updateDatabase(error => {
  if (error) {
    console.error(error);
  } else {
    console.log("database updated");
  }
});
```

### listUpgradablePackages

Retrieves the list of upgradable packages with their names, current version and last version.

```javascript
var listUpgradablePackages = require("linux-package-manager")
  .listUpgradablePackages;

listUpgradablePackages()
  .then(upgradablePackages => {
    for (var i = 0; i < upgradablePackages.length; i++) {
      var package = upgradablePackage[i];
      console.log(
        `name: ${package.name}\ncurrent version: ${package.currentVersion}\nlast version: ${package.lastVersion}`
      );
    }
  })
  .catch(e => {
    console.error(e);
  });

listUpgradablePackages((error, upgradablePackages) => {
  if (error) {
    console.error(error);
  } else {
    for (var i = 0; i < upgradablePackages.length; i++) {
      var package = upgradablePackage[i];
      console.log(
        `name: ${package.name}\ncurrent version: ${package.currentVersion}\nlast version: ${package.lastVersion}`
      );
    }
  }
});
```

### upgradePackages

Upgrade packages. **(require root/sudo)**

```javascript
var upgradePackages = require("linux-package-manager").upgradePackages;

upgradePackages()
  .then(() => {
    console.log("packages upgraded");
  })
  .catch(e => {
    console.error(e);
  });

upgradePackages(error => {
  if (error) {
    console.error(error);
  } else {
    console.log("packages upgraded");
  }
});
```

### doesPackageExists

Checks if a package exists.

```javascript
var doesPackageExists = require("linux-package-manager").doesPackageExists;

doesPackageExists("bash")
  .then(exists => {
    if (exists) {
      console.log("The package bash exists");
    } else {
      console.log("The package bash doesn't exists");
    }
  })
  .catch(e => {
    console.error(e);
  });

doesPackageExists("bash", (error, exists) => {
  if (error) {
    console.error(error);
  } else {
    if (exists) {
      console.log("The package bash exists");
    } else {
      console.log("The package bash doesn't exists");
    }
  }
});
```

### isPackageInstalled

Checks if a package is installed.

```javascript
var isPackageInstalled = require("linux-package-manager").isPackageInstalled;

isPackageInstalled("bash")
  .then(installed => {
    if (installed) {
      console.log("The package bash is installed");
    } else {
      console.log("The package basi isn't installed");
    }
  })
  .catch(e => {
    console.error(e);
  });

isPackageInstalled("bash", (error, installed) => {
  if (error) {
    console.error(error);
  } else {
    if (installed) {
      console.log("The package bash is installed");
    } else {
      console.log("The package basi isn't installed");
    }
  }
});
```

### installPackage

Install a package. **(require root/sudo)**

```javascript
var installPackage = require("linux-package-manager").installPackage;

installPackage("ssh")
  .then(() => {
    console.log("ssh installed");
  })
  .catch(e => {
    console.error(e);
  });

installPackage("ssh", error => {
  if (error) {
    console.error(error);
  } else {
    console.log("ssh installed");
  }
});
```

### uninstallPackage

Uninstall a package. **(require root/sudo)**

```javascript
var uninstallPackage = require("linux-package-manager").uninstallPackage;

uninstallPackage("ssh")
  .then(() => {
    console.log("ssh uninstalled");
  })
  .catch(e => {
    console.error(e);
  });

uninstallPackage("ssh", error => {
  if (error) {
    console.error(error);
  } else {
    console.log("ssh uninstalled");
  }
});
```

### searchPackage

Retrieves a list of package corresponding to the given string.

```javascript
var searchPackage = require("linux-package-manager").searchPackage;

searchPackage("ngin")
  .then(packages => {
    for (var i = 0; i < packages.length; i++) {
      console.log(packages[i]);
    }
  })
  .catch(e => {
    console.error(e);
  });

searchPackage("ngin", (error, packages) => {
  if (error) {
    console.error(error);
  } else {
    for (var i = 0; i < packages.length; i++) {
      console.log(packages[i]);
    }
  }
});
```
