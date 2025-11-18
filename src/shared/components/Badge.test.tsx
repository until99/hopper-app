import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Badge } from './Badge'

describe('Badge', () => {
  it('renders with children', () => {
    render(<Badge>New</Badge>)
    expect(screen.getByText('New')).toBeInTheDocument()
  })

  it('applies default variant by default', () => {
    render(<Badge>Default</Badge>)
    const badge = screen.getByText('Default')
    expect(badge).toHaveClass('bg-gray-100', 'text-gray-800')
  })

  it('applies primary variant', () => {
    render(<Badge variant="primary">Primary</Badge>)
    const badge = screen.getByText('Primary')
    expect(badge).toHaveClass('bg-primary-100', 'text-primary-800')
  })

  it('applies success variant', () => {
    render(<Badge variant="success">Success</Badge>)
    const badge = screen.getByText('Success')
    expect(badge).toHaveClass('bg-green-100', 'text-green-800')
  })

  it('applies warning variant', () => {
    render(<Badge variant="warning">Warning</Badge>)
    const badge = screen.getByText('Warning')
    expect(badge).toHaveClass('bg-yellow-100', 'text-yellow-800')
  })

  it('applies danger variant', () => {
    render(<Badge variant="danger">Danger</Badge>)
    const badge = screen.getByText('Danger')
    expect(badge).toHaveClass('bg-red-100', 'text-red-800')
  })

  it('applies info variant', () => {
    render(<Badge variant="info">Info</Badge>)
    const badge = screen.getByText('Info')
    expect(badge).toHaveClass('bg-blue-100', 'text-blue-800')
  })

  it('applies small size', () => {
    render(<Badge size="sm">Small</Badge>)
    const badge = screen.getByText('Small')
    expect(badge).toHaveClass('px-2', 'py-0.5', 'text-xs')
  })

  it('applies medium size by default', () => {
    render(<Badge>Medium</Badge>)
    const badge = screen.getByText('Medium')
    expect(badge).toHaveClass('px-2.5', 'py-1', 'text-sm')
  })

  it('applies large size', () => {
    render(<Badge size="lg">Large</Badge>)
    const badge = screen.getByText('Large')
    expect(badge).toHaveClass('px-3', 'py-1.5', 'text-base')
  })

  it('applies custom className', () => {
    render(<Badge className="custom-class">Custom</Badge>)
    const badge = screen.getByText('Custom')
    expect(badge).toHaveClass('custom-class')
  })

  it('passes through additional span props', () => {
    render(<Badge data-testid="badge-test" title="Badge title">Test</Badge>)
    const badge = screen.getByTestId('badge-test')
    expect(badge).toHaveAttribute('title', 'Badge title')
  })

  it('renders as span element', () => {
    render(<Badge>Span Badge</Badge>)
    const badge = screen.getByText('Span Badge')
    expect(badge.tagName).toBe('SPAN')
  })

  it('combines multiple props correctly', () => {
    render(
      <Badge variant="success" size="lg" className="extra-class">
        Complete
      </Badge>
    )
    const badge = screen.getByText('Complete')
    expect(badge).toHaveClass('bg-green-100', 'text-green-800', 'px-3', 'py-1.5', 'text-base', 'extra-class')
  })
})
