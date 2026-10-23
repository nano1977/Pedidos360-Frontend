export const environment = {
  production: false,
  azure: {
    // Tenant "Directorio predeterminado" donde está registrada la app Pedidos360-Frontend
    tenantId: 'bb5324af-c266-41ed-b36c-a971641c7af2',
    clientId: 'c926387b-811c-4ffb-a71a-53ff3beaedac',
    redirectUri: 'http://localhost:4200'
  },
  api: {
    // URL pública del AWS API Gateway (API Manager)
    baseUrl: 'https://esqclflrwc.execute-api.us-east-1.amazonaws.com',
    // Scope para pedir un access token cuyo destinatario es la propia aplicación
    scope: 'c926387b-811c-4ffb-a71a-53ff3beaedac/.default'
  }
};
