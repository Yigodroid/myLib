import { NextResponse } from 'next/server'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const libraryPath = join(process.cwd(), 'library.json')

function readLibrary() {
  try {
    const data = readFileSync(libraryPath, 'utf-8')
    return JSON.parse(data).libros
  } catch (error) {
    console.error('Error leyendo library.json:', error)
    return []
  }
}

function writeLibrary(libros: any[]) {
  try {
    writeFileSync(libraryPath, JSON.stringify({ libros }, null, 2))
  } catch (error) {
    console.error('Error escribiendo library.json:', error)
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
    console.log('data: ', request.json);
  try {
    const libroId = parseInt(params.id)
    const datosActualizacion = await request.json()

    // Leer libros actuales
    const libros = readLibrary()

    // Encontrar el libro por ID
    const indiceLibro = libros.findIndex((libro: any) => libro.id === libroId)

    if (indiceLibro === -1) {
      return NextResponse.json(
        { error: 'Libro no encontrado' },
        { status: 404 }
      )
    }

    // Actualizar el libro
    libros[indiceLibro] = { ...libros[indiceLibro], ...datosActualizacion }

    // Guardar en archivo
    writeLibrary(libros)

    return NextResponse.json(libros[indiceLibro])
  } catch (error) {
    console.error('Error en PATCH /api/libros/[id]:', error)
    return NextResponse.json(
      { error: 'Error al actualizar el libro' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const libroId = parseInt(params.id)
    const libros = readLibrary()
    const librosFiltrados = libros.filter((libro: any) => libro.id !== libroId)

    if (librosFiltrados.length === libros.length) {
      return NextResponse.json(
        { error: 'Libro no encontrado' },
        { status: 404 }
      )
    }

    writeLibrary(librosFiltrados)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error en DELETE /api/libros/[id]:', error)
    return NextResponse.json(
      { error: 'Error al eliminar el libro' },
      { status: 500 }
    )
  }
}
