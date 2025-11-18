import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Container } from './Container'

describe('Container', () => {
  it('renders with children', () => {
    render(<Container>Test Content</Container>)
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<Container className="custom-class" data-testid="container">Content</Container>)
    const container = screen.getByTestId('container')
    expect(container).toHaveClass('custom-class')
  })

  it('renders as div element', () => {
    const { container } = render(<Container>Content</Container>)
    expect(container.firstChild?.nodeName).toBe('DIV')
  })

  it('passes through additional props', () => {
    render(<Container data-testid="test-container">Content</Container>)
    expect(screen.getByTestId('test-container')).toBeInTheDocument()
  })
})
