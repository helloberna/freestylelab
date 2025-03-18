export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-background text-white">
      <header className="bg-surface p-4">
        <h1 className="text-2xl font-bold text-primary">Freestyle Rap Practice</h1>
      </header>
      <main className="container mx-auto p-4">
        {children}
      </main>
    </div>
  )
}