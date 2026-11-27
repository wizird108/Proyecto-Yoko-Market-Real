// Convierte la calificación numérica del formulario en estrellas visibles.
export function textoEstrellas(cantidad: number): string {
  return "★".repeat(cantidad) + "☆".repeat(5 - cantidad);
}
