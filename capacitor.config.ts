import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.b829183d46674380847650341f824d9c',
  appName: 'babes-habit-alert',
  webDir: 'dist',
  server: {
    url: 'https://b829183d-4667-4380-8476-50341f824d9c.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#488AFF",
      sound: "beep.wav",
    },
  },
};

export default config;