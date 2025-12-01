import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'ChambaNow',
  webDir: 'www',
  server: {
    // ESTO ES LO NUEVO:
    // Cambiamos el esquema a 'http' para evitar el error "Mixed Content"
    // al conectarnos a un backend local que no tiene certificado SSL.
    androidScheme: 'http',
    cleartext: true,
    // Opcional: permitir navegación explícita a tu IP
    allowNavigation: ['192.168.1.111']
  }
};

export default config;