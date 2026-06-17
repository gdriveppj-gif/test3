const config = {
  appId: 'com.gudang.bongkarmuat',
  appName: 'Gudang Bongkar Muat',
  webDir: 'dist',
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#0D1F35',
      showSpinner: false,
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#0D1F35',
    }
  }
};

module.exports = config;
