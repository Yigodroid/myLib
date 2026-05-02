import { NextResponse } from 'next/server'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { addTopics } from '../../../lib/topics'

const libraryPath = join(process.cwd(), 'library.json')

function readLibrary() {
  try {
    const data = readFileSync(libraryPath, 'utf-8')
    let libros = JSON.parse(data).libros
    libros = libros.sort((a: any, b: any) => a.titulo.localeCompare(b.titulo))
    return libros
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

export async function GET() {
  const libros = readLibrary()
  return NextResponse.json(libros)
}

export async function POST(request: Request) {
  try {
    const datos = await request.json()

    // Validación
    if (!datos.titulo) {
      return NextResponse.json(
        { error: 'El título es un campo requerido.' },
        { status: 400 }
      )
    }

    // Leer libros actuales
    const libros = readLibrary()

    // Crear nuevo libro
    const nuevoLibro = {
      id: libros.length > 0 ? Math.max(...libros.map((l: any) => Number(l.id) || 0), 0) + 1 : 1,
      titulo: datos.titulo,
      autorId: datos.autorId || 1,
      autor: datos.autor || 'Desconocido',
      ISBN: datos.ISBN || '',
      ISBN13: datos.ISBN13 || '',
      estado: datos.estado || 'disponible',
      tematica1: datos.tematica1 || '',
      tematica2: datos.tematica2 || '',
      imageURL: datos.imageURL || '',
      owner: datos.owner || 'Sin propietario',
      ubicacion: datos.ubicacion || 'casa',
      formato: datos.formato || 'fisico',
      leido: datos.leido || false,
      prestadoA: datos.prestadoA || '',
      rating: datos.rating || 0,
      flag: datos.flag || false,
    }

    // Agregar nuevo libro
    libros.push(nuevoLibro)

    // Actualizar temáticas si hay nuevas
    const nuevasTematicas = []
    if (datos.tematica1 && datos.tematica1.trim()) {
      nuevasTematicas.push(datos.tematica1.trim())
    }
    if (datos.tematica2 && datos.tematica2.trim()) {
      nuevasTematicas.push(datos.tematica2.trim())
    }
    if (nuevasTematicas.length > 0) {
      addTopics(nuevasTematicas)
    }

    // Guardar en archivo
    writeLibrary(libros)

    return NextResponse.json(nuevoLibro, { status: 201 })
  } catch (error) {
    console.error('Error en POST /api/libros:', error)
    return NextResponse.json(
      { error: 'Error al crear el libro' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const datos = await request.json()

    // Validación
    if (!datos.id) {
      return NextResponse.json(
        { error: 'El ID del libro es requerido para editar.' },
        { status: 400 }
      )
    }

    // Leer libros actuales
    const libros = readLibrary()

    // Encontrar el libro a editar
    const index = libros.findIndex((libro: any) => String(libro.id) === String(datos.id))
    if (index === -1) {
      return NextResponse.json(
        { error: 'Libro no encontrado.' },
        { status: 404 }
      )
    }

    // Validar título solo si se envía
    if (datos.titulo !== undefined && !datos.titulo) {
      return NextResponse.json(
        { error: 'El título no puede estar vacío.' },
        { status: 400 }
      )
    }

    // Actualizar libro
    const libroActualizado = {
      ...libros[index],
      titulo: datos.titulo !== undefined ? datos.titulo : libros[index].titulo,
      autorId: datos.autorId || libros[index].autorId,
      autor: datos.autor || libros[index].autor,
      ISBN: datos.ISBN || libros[index].ISBN,
      ISBN13: datos.ISBN13 || libros[index].ISBN13,
      estado: datos.estado || libros[index].estado,
      tematica1: datos.tematica1 || libros[index].tematica1,
      tematica2: datos.tematica2 || libros[index].tematica2,
      imageURL: datos.imageURL || libros[index].imageURL,
      owner: datos.owner || libros[index].owner,
      ubicacion: datos.ubicacion || libros[index].ubicacion,
      formato: datos.formato || libros[index].formato,
      leido: datos.leido !== undefined ? datos.leido : libros[index].leido,
      prestadoA: datos.prestadoA || libros[index].prestadoA,
      rating: datos.rating !== undefined ? datos.rating : libros[index].rating,
      flag: datos.flag !== undefined ? datos.flag : libros[index].flag,
    }

    libros[index] = libroActualizado

    // Actualizar temáticas si hay nuevas
    const nuevasTematicas = []
    if (datos.tematica1 && datos.tematica1.trim()) {
      nuevasTematicas.push(datos.tematica1.trim())
    }
    if (datos.tematica2 && datos.tematica2.trim()) {
      nuevasTematicas.push(datos.tematica2.trim())
    }
    if (nuevasTematicas.length > 0) {
      addTopics(nuevasTematicas)
    }

    // Guardar en archivo
    writeLibrary(libros)

    return NextResponse.json(libroActualizado)
  } catch (error) {
    console.error('Error en PUT /api/libros:', error)
    return NextResponse.json(
      { error: 'Error al editar el libro' },
      { status: 500 }
    )
  }
}
