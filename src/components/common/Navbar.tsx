import { AnimatePresence,motion } from 'motion/react'
import { useState } from 'react'
import { Link, useLocation } from 'react-router'

import { Button } from '~/components/ui/button'
import { useMobile } from '~/hooks/common/useMobile'
import { cx } from '~/lib/cn'

const navItems = [
  { name: '首页', path: '/' },
  { name: '关于我们', path: '/about' },
  { name: '产品服务', path: '/products' },
  { name: '解决方案', path: '/solutions' },
  { name: '联系我们', path: '/contact' },
]

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  const isMobile = useMobile()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
              <i className="i-mingcute-cpu-line w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-text">TechCorp</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cx(
                  'text-sm font-medium transition-colors hover:text-accent',
                  location.pathname === item.path
                    ? 'text-accent'
                    : 'text-text-secondary',
                )}
              >
                {item.name}
              </Link>
            ))}
            <Button variant="primary" className="bg-accent hover:bg-accent/90">
              立即咨询
            </Button>
          </nav>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden p-2 rounded-md text-text-secondary hover:bg-fill"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <i
              className={cx(
                'w-6 h-6 transition-transform',
                isMenuOpen ? 'i-mingcute-close-line' : 'i-mingcute-menu-line',
              )}
            />
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-b border-border overflow-hidden"
          >
            <div className="px-4 py-3 space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={cx(
                    'block px-3 py-2 rounded-md text-base font-medium',
                    location.pathname === item.path
                      ? 'bg-fill text-accent'
                      : 'text-text-secondary hover:bg-fill hover:text-text',
                  )}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-2">
                <Button
                  variant="primary"
                  className="w-full bg-accent hover:bg-accent/90"
                >
                  立即咨询
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
