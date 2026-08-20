
import { createRoot } from 'react-dom/client'
import './index.css'

import { RouterProvider } from 'react-router-dom'
import routes from './const/routes.tsx'
import { AdminProvider } from './pages/admin/AdminContext'

createRoot(document.getElementById('root')!).render(
  <AdminProvider>
    <RouterProvider router={routes} />
  </AdminProvider>
)
