const fs = require('fs');
const path = require('path');
const walk = require('walk');

const introAssetsRules = [
  'bg_main',
  'port_hole',
  'loading_screen',
  'back_loading_screen',
  'bebas',
  'logo',
  'compass_scale'
];

const fileIsIgnored = n => [/^\./, /^Icon\r$/].some(r => r.test(n));

const clearAdditionalAssets = assets => {
    const baseAssetsExtensions = ['.json', '.xml']; 
    const baseAssets = assets.filter(({srcs}) => baseAssetsExtensions.some(ext => ext === path.extname(srcs).replaceAll(/\?[\S\s\d\D]*/gi, '')));
    const copyAssets = [...assets];
    for (let i = 0; i < baseAssets.length; i++) {
        const baseAsset = baseAssets[i];
        for (let j = 0; j < copyAssets.length; j++) {
            const additionalAsset = copyAssets[j];
            if (baseAsset.name === additionalAsset.name && baseAsset !== additionalAsset) {
                assets.splice(assets.indexOf(additionalAsset), 1);
            }
        }
    }
    return assets;
};

const excludeAssets = (mainBundle, rules) => {
    const assets = [...mainBundle.assets];
    const excludedAssets = [];
  
    for (let i = 0; i < assets.length; i++) {
        if (rules.some(name => name === assets[i].name)) {
            const index = mainBundle.assets.indexOf(assets[i]);
            excludedAssets.push(...mainBundle.assets.splice(index, 1));
        }
    }
    
    return excludedAssets;
};

exports.manifestPlugin = () => {
  const introBundle = {
    name: 'intro',
    assets: []
  };

  const mainBundle = {
    name: 'main',
    assets: []
  };

  walk.walkSync('./src/assets', {
    listeners: {
        file: (_root, fileStats, next) => {
          if (fileIsIgnored(fileStats.name)) return;

          mainBundle.assets.push({
              name: fileStats.name.split('.')[0],
              srcs: _root.replaceAll(/\.\/src\//g, '') + '/' + fileStats.name,
          });

          next();
        },
        end: () => {
          mainBundle.assets = clearAdditionalAssets(mainBundle.assets);
          introBundle.assets = excludeAssets(mainBundle, introAssetsRules);
          
          const manifest = {};
          manifest.bundles = [introBundle, mainBundle];

          fs.writeFileSync(
              path.join('./', 'manifest.json'),
              JSON.stringify(manifest, null, 2)
          );
        }
    }
  });
};

