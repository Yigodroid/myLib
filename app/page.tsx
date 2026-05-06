'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import FormCrearLibro from '@/components/FormCrearLibro'
import FormEditarLibro from '@/components/FormEditarLibro'
import ListaLibros from '@/components/ListaLibros'
import Dashboard from '@/components/Dashboard'

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

export default function Home() {
  const [libros, setLibros] = useState<Libro[]>([])
  const [librosFiltrados, setLibrosFiltrados] = useState<Libro[]>([])
  const [cargando, setCargando] = useState(true)
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [libroEditando, setLibroEditando] = useState<Libro | null>(null)
  const [filtroActual, setFiltroActual] = useState<string | null>(null)
  const [mostrarModalLimpiarFlags, setMostrarModalLimpiarFlags] = useState(false)
  const [limpiarFlagsCargando, setLimpiarFlagsCargando] = useState(false)
  const [mostrarModalBuscarPortada, setMostrarModalBuscarPortada] = useState(false)
  const [isbnPortada, setIsbnPortada] = useState('')
  const [modalErrorISBN, setModalErrorISBN] = useState<string | null>(null)

  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    cargarLibros()
  }, [])

  useEffect(() => {
    // Verificar si hay parámetro de autor en la URL
    const autorParam = searchParams.get('autor')
    if (autorParam) {
      setFiltroActual(autorParam)
    }
  }, [searchParams])

  useEffect(() => {
    // Aplicar filtro cuando cambian los libros o el filtro
    if (filtroActual === null) {
      setLibrosFiltrados(libros)
    } else if (filtroActual === 'FILTER_FLAG') {
      // Filtro especial para libros con flag
      const filtrados = libros.filter(libro => libro.flag)
      setLibrosFiltrados(filtrados)
    } else {
      const filtrados = libros.filter(libro =>
        libro.tematica1 === filtroActual ||
        libro.tematica2 === filtroActual ||
        libro.autor === filtroActual
      )
      setLibrosFiltrados(filtrados)
    }
  }, [libros, filtroActual])

  const cargarLibros = async () => {
    try {
      setCargando(true)
      const respuesta = await fetch('/api/libros')
      if (respuesta.ok) {
        const datos = await respuesta.json()
        setLibros(datos)
      }
    } catch (error) {
      console.error('Error al cargar libros:', error)
    } finally {
      setCargando(false)
    }
  }

  const manejarLibroCreado = () => {
    setMostrarFormulario(false)
    cargarLibros()
  }

  const manejarEditarLibro = (libro: Libro) => {
    setLibroEditando(libro)
    setMostrarFormulario(false) // Cerrar formulario de creación si está abierto
  }

  const manejarLibroEditado = () => {
    setLibroEditando(null)
    cargarLibros()
  }

  const manejarCancelarEdicion = () => {
    setLibroEditando(null)
  }

  const manejarFiltrar = (filtro: string | null) => {
    setFiltroActual(filtro)
    if (filtro === null) {
      // Limpiar el parámetro de la URL cuando se quita el filtro
      router.push('/', { scroll: false })
    }
  }

  const abrirModalLimpiarFlags = () => {
    setMostrarModalLimpiarFlags(true)
  }

  const cerrarModalLimpiarFlags = () => {
    setMostrarModalLimpiarFlags(false)
  }

  const abrirModalBuscarPortada = () => {
    setIsbnPortada('')
    setModalErrorISBN(null)
    setMostrarModalBuscarPortada(true)
  }

  const cerrarModalBuscarPortada = () => {
    setMostrarModalBuscarPortada(false)
  }

  const manejarBuscarPortada = () => {
    const isbn = isbnPortada.trim()
    if (!isbn) {
      setModalErrorISBN('Ingresa un código ISBN válido')
      return
    }

    const url = `https://covers.openlibrary.org/b/isbn/${encodeURIComponent(isbn)}-L.jpg`
    window.open(url, '_blank')
    setMostrarModalBuscarPortada(false)
  }

  const confirmarLimpiarFlags = async () => {
    setLimpiarFlagsCargando(true)
    try {
      const response = await fetch('/api/libros/clear-flags', {
        method: 'POST',
      })
      if (response.ok) {
        cargarLibros()
      } else {
        console.error('No se pudieron limpiar las marcas')
      }
    } catch (error) {
      console.error('Error limpiando marcas:', error)
    } finally {
      setLimpiarFlagsCargando(false)
      setMostrarModalLimpiarFlags(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Sección de bienvenida */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 sm:p-8 border border-blue-200">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Bienvenido a miBib</h2>
        <p className="text-gray-600 mb-6 text-sm sm:text-base">Organiza, gestiona y explora tu colección de libros favoritos en un solo lugar.</p>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <button
            onClick={() => setMostrarFormulario(!mostrarFormulario)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 sm:px-6 rounded-lg transition duration-200 text-sm sm:text-base w-full sm:w-auto"
          >
            {mostrarFormulario ? '✕ Cerrar' : '+ Agregar Libro'}
          </button>
          <button
            onClick={abrirModalBuscarPortada}
            className="bg-white border border-blue-300 text-blue-700 font-semibold py-2 px-4 sm:px-6 rounded-lg transition duration-200 text-sm sm:text-base w-full sm:w-auto hover:bg-blue-50"
          >
            Buscar Portada
          </button>
        </div>
      </section>

      {/* Dashboard */}
      {!cargando && (
        <Dashboard libros={libros} onFiltrar={manejarFiltrar} onLimpiarFlags={abrirModalLimpiarFlags} />
      )}

      {/* Formulario para crear libro */}
      {mostrarFormulario && (
        <div className="bg-white rounded-lg p-4 sm:p-8 border border-gray-200 shadow-md">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-6">Nuevo Libro</h3>
          <FormCrearLibro onLibroCreado={manejarLibroCreado} />
        </div>
      )}

      {/* Formulario para editar libro */}
      {libroEditando && (
        <div className="bg-white rounded-lg p-4 sm:p-8 border border-gray-200 shadow-md">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-6">Editar Libro</h3>
          <FormEditarLibro
            libro={libroEditando}
            onLibroEditado={manejarLibroEditado}
            onCancelar={manejarCancelarEdicion}
          />
        </div>
      )}

      {/* Sección de libros */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            {filtroActual === 'FILTER_FLAG'
              ? '⭐ Libros Marcados'
              : filtroActual
              ? `Libros de ${filtroActual}`
              : 'Mi Biblioteca'}
          </h2>
          {filtroActual && (
            <button
              onClick={() => manejarFiltrar(null)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium self-start sm:self-auto"
            >
              ← Ver todos los libros
            </button>
          )}
        </div>

        {cargando ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 mt-4">Cargando libros...</p>
          </div>
        ) : librosFiltrados.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <div className="text-4xl mb-4">📚</div>
            <p className="text-gray-600 text-lg">
              {filtroActual
                ? `No hay libros en la temática "${filtroActual}".`
                : 'No hay libros registrados aún.'
              }
            </p>
            <p className="text-gray-500 text-sm mt-2">
              {filtroActual
                ? 'Prueba con otra temática.'
                : 'Comienza agregando tu primer libro.'
              }
            </p>
          </div>
        ) : (
          <ListaLibros libros={librosFiltrados} onActualizar={cargarLibros} onEditarLibro={manejarEditarLibro} />
        )}
      </section>

      {mostrarModalLimpiarFlags && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
          <div className="max-w-sm sm:max-w-lg w-full bg-white rounded-3xl border border-gray-200 p-4 sm:p-6 shadow-xl">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Confirmar limpieza de marcas</h3>
            <p className="text-gray-600 mb-6 text-sm sm:text-base">
              ¿Estás seguro de que deseas quitar la marca favorito de todos los libros?
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={cerrarModalLimpiarFlags}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 order-2 sm:order-1"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmarLimpiarFlags}
                disabled={limpiarFlagsCargando}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50 order-1 sm:order-2"
              >
                {limpiarFlagsCargando ? 'Limpiando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {mostrarModalBuscarPortada && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
          <div className="max-w-sm w-full bg-white rounded-3xl border border-gray-200 p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Buscar portada por ISBN</h3>
            <p className="text-gray-600 mb-4 text-sm">Ingresa el código ISBN y presiona Aceptar para abrir la portada en Open Library.</p>
            {modalErrorISBN && (
              <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {modalErrorISBN}
              </div>
            )}
            <input
              type="text"
              value={isbnPortada}
              onChange={(e) => {
                setIsbnPortada(e.target.value)
                setModalErrorISBN(null)
              }}
              placeholder="Ej: 9788408233114"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={cerrarModalBuscarPortada}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={manejarBuscarPortada}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
