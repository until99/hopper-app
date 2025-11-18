import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './Button'

describe('Button', () => {
  it('renders with children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('applies primary variant by default', () => {
    render(<Button>Primary</Button>)
    const button = screen.getByText('Primary')
    expect(button).toHaveClass('bg-primary-600')
  })

  it('applies secondary variant when specified', () => {
    render(<Button variant="secondary">Secondary</Button>)
    const button = screen.getByText('Secondary')
    expect(button).toHaveClass('bg-gray-200')
  })

  it('applies danger variant when specified', () => {
    render(<Button variant="danger">Delete</Button>)
    const button = screen.getByText('Delete')
    expect(button).toHaveClass('bg-red-600')
  })

  it('applies ghost variant when specified', () => {
    render(<Button variant="ghost">Ghost</Button>)
    const button = screen.getByText('Ghost')
    expect(button).toHaveClass('bg-transparent')
  })

  it('applies outline variant when specified', () => {
    render(<Button variant="outline">Outline</Button>)
    const button = screen.getByText('Outline')
    expect(button).toHaveClass('border-2')
  })

  it('applies small size', () => {
    render(<Button size="sm">Small</Button>)
    const button = screen.getByText('Small')
    expect(button).toHaveClass('px-3', 'py-1.5', 'text-sm')
  })

  it('applies medium size by default', () => {
    render(<Button>Medium</Button>)
    const button = screen.getByText('Medium')
    expect(button).toHaveClass('px-4', 'py-2', 'text-base')
  })

  it('applies large size', () => {
    render(<Button size="lg">Large</Button>)
    const button = screen.getByText('Large')
    expect(button).toHaveClass('px-6', 'py-3', 'text-lg')
  })

  it('handles click events', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    await user.click(screen.getByText('Click me'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>)
    const button = screen.getByText('Disabled')
    expect(button).toBeDisabled()
  })

  it('shows loading spinner when isLoading is true', () => {
    render(<Button isLoading>Loading</Button>)
    const button = screen.getByText('Loading')
    expect(button).toBeDisabled()
    expect(button.querySelector('svg')).toBeInTheDocument()
  })

  it('does not call onClick when disabled', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(<Button disabled onClick={handleClick}>Disabled</Button>)
    
    await user.click(screen.getByText('Disabled'))
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('does not call onClick when loading', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(<Button isLoading onClick={handleClick}>Loading</Button>)
    
    await user.click(screen.getByText('Loading'))
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('applies custom className', () => {
    render(<Button className="custom-class">Custom</Button>)
    const button = screen.getByText('Custom')
    expect(button).toHaveClass('custom-class')
  })

  it('forwards ref to button element', () => {
    const ref = { current: null }
    render(<Button ref={ref}>With Ref</Button>)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it('passes through additional button props', () => {
    render(<Button type="submit" name="test-button">Submit</Button>)
    const button = screen.getByText('Submit')
    expect(button).toHaveAttribute('type', 'submit')
    expect(button).toHaveAttribute('name', 'test-button')
  })
})
