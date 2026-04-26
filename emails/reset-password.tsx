export function ResetPasswordTemplate({ name = "equipo" }: { name?: string }) {
  return `
Hola ${name},

Recibimos un pedido para restablecer tu contraseña en mi_producto.
Si fuiste tú, usa el enlace de recuperación que enviamos.
`;
}
