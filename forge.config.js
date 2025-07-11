module.exports = {
  packagerConfig: {
    asar: true,
    icon: './assets/icon.ico',
    name: 'Garden Stock',
    productName: 'Garden Stock'
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        authors: 'Anjinho Ruindade Pura',
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
};
