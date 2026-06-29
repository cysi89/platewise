import { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'life.thegenie.app',
  appName: 'The Genie',
  webDir: 'out',
  server: {
    url: 'https://thegenie.life',
    cleartext: true
  }
}

export default config
