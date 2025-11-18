import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Loading } from './Loading'

describe('Loading', () => {
  it('renders loading spinner', () => {
    const { container } = render(<Loading />)
    const spinner = container.querySelector('.animate-spin')
    expect(spinner).toBeInTheDocument()
  })

  it('displays default loading text', () => {
    render(<Loading />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('displays custom message when provided', () => {
    render(<Loading message="Loading data..." />)
    expect(screen.getByText('Loading data...')).toBeInTheDocument()
  })

  it('applies default size', () => {
    const { container } = render(<Loading />)
    const spinner = container.querySelector('.animate-spin')
    expect(spinner).toHaveClass('w-12', 'h-12')
  })

  it('applies small size', () => {
    const { container } = render(<Loading size="sm" />)
    const spinner = container.querySelector('.animate-spin')
    expect(spinner).toHaveClass('w-6', 'h-6')
  })

  it('applies large size', () => {
    const { container } = render(<Loading size="lg" />)
    const spinner = container.querySelector('.animate-spin')
    expect(spinner).toHaveClass('w-16', 'h-16')
  })

  it('centers content by default', () => {
    const { container } = render(<Loading />)
    const wrapper = container.firstChild
    expect(wrapper).toHaveClass('flex', 'justify-center', 'items-center')
  })
})
