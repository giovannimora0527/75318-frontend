import packageInfo from '../../package.json';

export const environment = {
  appVersion: packageInfo.version,
  production: false,  
  apiUrl: 'http://localhost:8000/clinica/v1'
  ,
  // Habilitar mocks para desarrollo (frontend sin backend)
  useMocks: false
};