import { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'life.thegenie.app',
  appName: 'The Genie',
  webDir: 'out',
  server: {
    androidScheme: 'https'
  }
}

export default config
