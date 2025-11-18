import type { ReactElement } from 'react'
import { render } from '@testing-library/react'
import type { RenderOptions } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialEntries?: string[]
}

export function renderWithRouter(
  ui: ReactElement,
  { initialEntries = ['/'], ...options }: CustomRenderOptions = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <BrowserRouter>{children}</BrowserRouter>
  }

  return render(ui, { wrapper: Wrapper, ...options })
}

// Re-export everything from @testing-library/react
export * from '@testing-library/react'
export { renderWithRouter as render }
