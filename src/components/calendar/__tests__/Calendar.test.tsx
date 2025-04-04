import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Calendar } from '../Calendar'

describe('Calendar', () => {
  const mockDate = new Date(2024, 0, 1) // January 1, 2024
  const mockOnDateSelect = vi.fn()

  it('renders the current month and year', () => {
    render(<Calendar currentDate={mockDate} onDateSelect={mockOnDateSelect} />)
    expect(screen.getByText('January 2024')).toBeInTheDocument()
  })

  it('renders the days of the week', () => {
    render(<Calendar currentDate={mockDate} onDateSelect={mockOnDateSelect} />)
    expect(screen.getByText('Sun')).toBeInTheDocument()
    expect(screen.getByText('Mon')).toBeInTheDocument()
    expect(screen.getByText('Tue')).toBeInTheDocument()
    expect(screen.getByText('Wed')).toBeInTheDocument()
    expect(screen.getByText('Thu')).toBeInTheDocument()
    expect(screen.getByText('Fri')).toBeInTheDocument()
    expect(screen.getByText('Sat')).toBeInTheDocument()
  })

  it('calls onDateSelect when a date is clicked', () => {
    render(<Calendar currentDate={mockDate} onDateSelect={mockOnDateSelect} />)
    const dateButton = screen.getByText('1')
    fireEvent.click(dateButton)
    expect(mockOnDateSelect).toHaveBeenCalled()
  })
}) 