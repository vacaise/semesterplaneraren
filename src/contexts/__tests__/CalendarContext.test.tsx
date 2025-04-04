import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CalendarProvider, useCalendar } from '../CalendarContext'

const TestComponent = () => {
  const { currentDate, selectedDate, setCurrentDate, setSelectedDate } = useCalendar()
  return (
    <div>
      <div data-testid="current-date">{currentDate.toISOString()}</div>
      <div data-testid="selected-date">{selectedDate?.toISOString() || 'null'}</div>
      <button onClick={() => setCurrentDate(new Date(2024, 0, 1))}>Set Current Date</button>
      <button onClick={() => setSelectedDate(new Date(2024, 0, 1))}>Set Selected Date</button>
    </div>
  )
}

describe('CalendarContext', () => {
  it('provides initial values', () => {
    render(
      <CalendarProvider>
        <TestComponent />
      </CalendarProvider>
    )

    const currentDate = screen.getByTestId('current-date')
    const selectedDate = screen.getByTestId('selected-date')

    expect(currentDate).toBeInTheDocument()
    expect(selectedDate).toHaveTextContent('null')
  })

  it('throws error when used outside provider', () => {
    const TestComponentWithoutProvider = () => {
      try {
        useCalendar()
        return <div>No error</div>
      } catch (error) {
        return <div>Error caught</div>
      }
    }

    render(<TestComponentWithoutProvider />)
    expect(screen.getByText('Error caught')).toBeInTheDocument()
  })
}) 