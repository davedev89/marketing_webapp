export function VerifyEmailTemplate({ name = "equipo" }: { name?: string }) {
  return `
Hola ${name},

Tu cuenta en mi_producto ya está casi lista.
Confirma tu email para seguir con la configuración y conectar Google Ads.
`;
}
