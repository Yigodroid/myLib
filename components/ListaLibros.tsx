'use client'

import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import StarRating from './StarRating'

interface Libro {
  id: number
  titulo: string
  autor: string
  ISBN: string
  ISBN13: string
  estado: string
  tematica1: string
  tematica2: string
  imageURL: string
  owner: string
  ubicacion: string
  formato: string
  leido: boolean
  prestadoA: string
  rating: number
  flag: boolean
}

interface ListaLibrosProps {
  libros: Libro[]
  onActualizar: () => void
  onEditarLibro?: (libro: Libro) => void
}

export default function ListaLibros({ libros, onActualizar, onEditarLibro }: ListaLibrosProps) {
  const [librosConImagenes, setLibrosConImagenes] = useState<Libro[]>([])
  const [erroresImagen, setErroresImagen] = useState<Record<number, boolean>>({})
  const [libroAEliminar, setLibroAEliminar] = useState<Libro | null>(null)
  const [eliminando, setEliminando] = useState(false)
  const router = useRouter()

  const autorCounts = useMemo(() => {
    return libros.reduce((acc, libro) => {
      const autor = libro.autor || 'Desconocido'
      acc[autor] = (acc[autor] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  }, [libros])

  const estadoColores: Record<string, string> = {
    disponible: 'bg-green-100 text-green-800',
    prestado: 'bg-yellow-100 text-yellow-800',
    'en-lectura': 'bg-blue-100 text-blue-800',
    leido: 'bg-gray-100 text-gray-800',
  }

  // Función para generar URL de OpenLibrary
  const generarUrlOpenLibrary = (isbn13: string) => {
    if (!isbn13) return ''
    // Limpiar ISBN13 (remover guiones y espacios)
    const isbnLimpio = isbn13.replace(/[-\s]/g, '')
    return `https://covers.openlibrary.org/b/isbn/${isbnLimpio}-L.jpg`
  }

  // Función para manejar click en autor
  const handleAutorClick = (autor: string) => {
    if (autor && autor !== 'Desconocido') {
      router.push(`/?autor=${encodeURIComponent(autor)}`)
    }
  }

  // Función para actualizar rating
  const actualizarRating = async (libroId: number, nuevoRating: number) => {
    try {
      const response = await fetch('/api/libros', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: libroId,
          rating: nuevoRating,
        }),
      })

      if (response.ok) {
        // Actualizar el estado local
        setLibrosConImagenes(prevLibros =>
          prevLibros.map(libro =>
            libro.id === libroId ? { ...libro, rating: nuevoRating } : libro
          )
        )
        onActualizar() // Refrescar datos del padre
      }
    } catch (error) {
      console.error('Error al actualizar rating:', error)
    }
  }

  // Función para actualizar flag
  const actualizarFlag = async (libroId: number, nuevoFlag: boolean) => {
    try {
      const response = await fetch('/api/libros', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: libroId,
          flag: nuevoFlag,
        }),
      })

      if (response.ok) {
        // Actualizar el estado local
        setLibrosConImagenes(prevLibros =>
          prevLibros.map(libro =>
            libro.id === libroId ? { ...libro, flag: nuevoFlag } : libro
          )
        )
        onActualizar() // Refrescar datos del padre
      }
    } catch (error) {
      console.error('Error al actualizar flag:', error)
    }
  }

  const solicitarEliminarLibro = (libro: Libro) => {
    setLibroAEliminar(libro)
  }

  const cancelarEliminarLibro = () => {
    setLibroAEliminar(null)
  }

  const confirmarEliminarLibro = async () => {
    if (!libroAEliminar) return
    setEliminando(true)

    try {
      const response = await fetch(`/api/libros/${libroAEliminar.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        onActualizar()
        setLibroAEliminar(null)
      } else {
        console.error('Error al eliminar el libro')
      }
    } catch (error) {
      console.error('Error al eliminar libro:', error)
    } finally {
      setEliminando(false)
    }
  }

  // Procesar libros y generar URLs de imágenes
  useEffect(() => {
    const procesarLibros = async () => {
      const librosProcesados = await Promise.all(
        libros.map(async (libro) => {
          let imageURL = libro.imageURL

          // Si no tiene imageURL pero tiene ISBN13, generar URL de OpenLibrary
          if ((!imageURL || imageURL === '0' || imageURL === '') && libro.ISBN13) {
            const urlGenerada = generarUrlOpenLibrary(libro.ISBN13)
            if (urlGenerada) {
              imageURL = urlGenerada
              // TODO: Implementar actualización automática de imageURL en la base de datos
              // await actualizarImageURL(libro.id, urlGenerada)
            }
          }

          return { ...libro, imageURL }
        })
      )

      setLibrosConImagenes(librosProcesados)
    }

    if (libros.length > 0) {
      procesarLibros()
    } else {
      setLibrosConImagenes([])
    }
  }, [libros])

  if (libros.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
        <div className="text-4xl mb-4">📚</div>
        <p className="text-gray-600 text-lg">No hay libros registrados aún.</p>
        <p className="text-gray-500 text-sm mt-2">Comienza agregando tu primer libro.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {librosConImagenes.map((libro) => (
        <div
          key={libro.id}
          className="relative bg-white rounded-lg border border-gray-200 shadow-md hover:shadow-xl transition duration-300 overflow-hidden"
        >
          <button
            type="button"
            onClick={() => solicitarEliminarLibro(libro)}
            className="absolute right-3 top-3 z-10 rounded-full bg-white p-2 text-red-600 shadow-sm hover:bg-red-50 focus:outline-none"
            aria-label="Eliminar libro"
          >
            🗑️
          </button>
          {/* Imagen de portada */}
          <div className="h-48 sm:h-64 bg-white overflow-hidden flex items-center justify-center border-b border-gray-200">
            {libro.imageURL && libro.imageURL !== '0' && libro.imageURL !== '' && !erroresImagen[libro.id] ? (
              <Image
                src={libro.imageURL}
                alt={libro.titulo}
                width={256}
                height={384}
                className="h-full w-auto object-contain hover:scale-110 transition duration-300"
                unoptimized
                onError={() => setErroresImagen(prev => ({ ...prev, [libro.id]: true }))}
              />
            ) : (
              <div className="text-4xl sm:text-5xl">📖</div>
            )}
          </div>

          {/* Contenido */}
          <div className="p-3 sm:p-4">
            {/* ID */}
            <p className="text-xs text-gray-500 mb-3">
              <span className="font-semibold">ID:</span> {libro.id || '0'}
            </p>

            {/* Título */}
            <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2 line-clamp-2">
              {libro.titulo}
            </h3>

            {/* Autor */}
            <p className="text-sm text-gray-600 mb-3">
              <span className="font-semibold">Autor:</span>{' '}
              {libro.autor && libro.autor !== 'Desconocido' ? (
                <>
                  <button
                    onClick={() => handleAutorClick(libro.autor)}
                    className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                  >
                    {libro.autor}
                  </button>{' '}
                  ({autorCounts[libro.autor]})
                </>
              ) : (
                'Desconocido'
              )}
            </p>

            {/* Propietario */}
            <p className="text-xs text-gray-500 mb-3">
              <span className="font-semibold">Propietario:</span> {libro.owner || 'Sin asignar'}
            </p>

            {/* Temáticas */}
            <div className="flex gap-2 mb-3 flex-wrap">
              {libro.tematica1 && (
                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                  {libro.tematica1}
                </span>
              )}
              {libro.tematica2 && (
                <span className="text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded-full">
                  {libro.tematica2}
                </span>
              )}
            </div>

            {/* ISBN */}
            {(libro.ISBN || libro.ISBN13) && (
              <div className="text-xs text-gray-500 mb-3 space-y-1">
                {libro.ISBN && <p><span className="font-semibold">ISBN:</span> {libro.ISBN}</p>}
                {libro.ISBN13 && <p><span className="font-semibold">ISBN-13:</span> {libro.ISBN13}</p>}
              </div>
            )}

            {/* Rating y Flag */}
            <div className="mb-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Rating:</span>
                <StarRating
                  rating={libro.rating || 0}
                  onRatingChange={(nuevoRating) => actualizarRating(libro.id, nuevoRating)}
                  size="sm"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id={`flag-${libro.id}`}
                  checked={libro.flag || false}
                  onChange={() => actualizarFlag(libro.id, !libro.flag)}
                  className="h-3 w-3 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <label
                  htmlFor={`flag-${libro.id}`}
                  className="ml-2 text-xs text-gray-600 cursor-pointer"
                >
                  Marcar
                </label>
              </div>
            </div>

            {/* Estado y pie */}
            <div className="pt-3 border-t border-gray-200 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <span className={`inline-block text-xs font-semibold px-2 sm:px-3 py-1 rounded-full ${estadoColores[libro.estado] || 'bg-gray-100 text-gray-800'}`}>
                {libro.estado}
              </span>
              {onEditarLibro && (
                <button
                  onClick={() => onEditarLibro(libro)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium self-start sm:self-auto"
                >
                  Editar
                </button>
              )}
            </div>
          </div>
        </div>
      ))}

      {libroAEliminar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
          <div className="max-w-sm sm:max-w-md w-full rounded-3xl bg-white p-4 sm:p-6 shadow-xl border border-gray-200">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Confirmar eliminación</h3>
            <p className="text-gray-600 mb-6 text-sm sm:text-base">
              ¿Estás seguro de que deseas eliminar «{libroAEliminar.titulo}»?
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={cancelarEliminarLibro}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 order-2 sm:order-1"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmarEliminarLibro}
                disabled={eliminando}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50 order-1 sm:order-2"
              >
                {eliminando ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
