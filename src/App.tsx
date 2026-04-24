import type { FC } from 'react'
import { Outlet } from 'react-router'

import { Footer } from './components/common/Footer'
import { Navbar } from './components/common/Navbar'
import { RootProviders } from './providers/root-providers'

export const App: FC = () => {
  return (
    <RootProviders>
      <Navbar />
      <div className="pt-16">
        <AppLayer />
      </div>
      <Footer />
    </RootProviders>
  )
}

const AppLayer = () => {
  const appIsReady = true
  return appIsReady ? <Outlet /> : <AppSkeleton />
}

const AppSkeleton = () => {
  return null
}
export default App
