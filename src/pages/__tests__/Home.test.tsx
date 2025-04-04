import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Home } from '../Home'

describe('Home', () => {
  it('renders the welcome message', () => {
    render(<Home />)
    expect(screen.getByText('Welcome to Semester Planeraren')).toBeInTheDocument()
  })

  it('renders the description text', () => {
    render(<Home />)
    expect(screen.getByText('Plan your semester with ease and efficiency')).toBeInTheDocument()
  })

  it('renders the action buttons', () => {
    render(<Home />)
    expect(screen.getByText('Get Started')).toBeInTheDocument()
    expect(screen.getByText('Learn More')).toBeInTheDocument()
  })
}) 