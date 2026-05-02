import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'miBib - Gestión de Biblioteca',
  description: 'Aplicación para gestionar tu biblioteca de libros',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="antialiased">
        <header className="bg-blue-600 text-white p-4 shadow-lg">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold">📚 miBib</h1>
            <p className="text-blue-100">Tu biblioteca personal en línea</p>
          </div>
        </header>
        <main className="max-w-6xl mx-auto p-4">
          {children}
        </main>
      </body>
    </html>
  )
}
