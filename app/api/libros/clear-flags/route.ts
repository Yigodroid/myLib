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

export async function POST() {
  try {
    const libros = readLibrary()
    const librosActualizados = libros.map((libro: any) => ({ ...libro, flag: false }))
    writeLibrary(librosActualizados)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error en POST /api/libros/clear-flags:', error)
    return NextResponse.json(
      { error: 'Error al limpiar las marcas' },
      { status: 500 }
    )
  }
}
