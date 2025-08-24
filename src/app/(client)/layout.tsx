import { Metadata } from 'next'
import { ClientSidebar } from '@/components/layout/ClientSidebar'

export const metadata: Metadata = {
  title: 'Client Dashboard | UAE Home Services',
  description: 'Manage your home service bookings and find trusted providers'
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <ClientSidebar />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-auto">
            <div className="p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}