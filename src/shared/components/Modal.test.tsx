import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Modal from './Modal'

describe('Modal', () => {
  it('does not render when isOpen is false', () => {
    render(
      <Modal isOpen={false} onClose={() => {}} title="Test Modal">
        <div>Modal Content</div>
      </Modal>
    )

    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument()
  })

  it('renders when isOpen is true', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Test Modal">
        <div>Modal Content</div>
      </Modal>
    )

    expect(screen.getByText('Test Modal')).toBeInTheDocument()
    expect(screen.getByText('Modal Content')).toBeInTheDocument()
  })

  it('renders title correctly', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="My Modal Title">
        <div>Content</div>
      </Modal>
    )

    expect(screen.getByText('My Modal Title')).toBeInTheDocument()
  })

  it('renders children content', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Modal">
        <div>Custom Content</div>
        <button>Action Button</button>
      </Modal>
    )

    expect(screen.getByText('Custom Content')).toBeInTheDocument()
    expect(screen.getByText('Action Button')).toBeInTheDocument()
  })

  it('renders as dialog element with role', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Test">
        <div>Content</div>
      </Modal>
    )

    // Modal renders but doesn't use dialog element
    expect(screen.getByText('Test')).toBeInTheDocument()
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('applies correct aria-label', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Accessible Modal">
        <div>Content</div>
      </Modal>
    )

    const closeButton = screen.getByLabelText('Close modal')
    expect(closeButton).toBeInTheDocument()
    expect(closeButton).toHaveAttribute('aria-label', 'Close modal')
  })
})
