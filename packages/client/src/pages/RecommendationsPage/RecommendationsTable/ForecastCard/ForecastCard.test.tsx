/*
 * © 2021 Thoughtworks, Inc.
 */

import { render } from '@testing-library/react'
import ForecastCard from './ForecastCard'
import each from 'jest-each'

describe('Forecast Card', () => {
  it('should render the card', () => {
    const { getByTestId } = render(<ForecastCard />)

    expect(getByTestId('forecast-card')).toBeInTheDocument()
  })

  const testProps = [
    ['title', { title: 'test-title' }],
    ['co2eSavings', { co2eSavings: 255 }],
    ['costSavings', { costSavings: 16500 }],
  ]
  each(testProps).it(
    'should display the %s that we pass through',
    (key, props) => {
      const { getByText } = render(<ForecastCard {...props} />)

      expect(getByText(props[key])).toBeInTheDocument()
    },
  )

  it('should render percents badge if percentChange is passed to it', () => {
    const { getByText } = render(
      <ForecastCard
        title="Title"
        co2eSavings="0"
        costSavings="0"
        co2ePercentChange={25}
        costPercentChange={10}
      />,
    )

    expect(getByText('25%')).toBeInTheDocument()
    expect(getByText('10%')).toBeInTheDocument()
  })
})
