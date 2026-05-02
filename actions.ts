'use server'

import { revalidatePath } from 'next/cache'

export async function crearLibro(formData: FormData) {
  const datos = {
    titulo: formData.get('titulo'),
    autor: formData.get('autor'),
    autorId: Number(formData.get('autorId')) || 1,
    estado: formData.get('estado') || 'disponible',
  }

  // Validación básica
  if (!datos.titulo) {
    throw new Error('El título es un campo requerido.')
  }

  try {
    const response = await fetch('http://localhost:3000/api/libros', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(datos),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Error al crear el libro')
    }

    // Revalida la página principal para mostrar el nuevo libro
    revalidatePath('/')
    
    return await response.json()
  } catch (error) {
    throw error
  }
}
