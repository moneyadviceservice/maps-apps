import * as React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Carousel } from './Carousel';

// Mock the useEmblaCarousel hook
jest.mock('embla-carousel-react', () => ({
  __esModule: true,
  default: jest.fn(() => [jest.fn()]),
}));

describe('Carousel Component', () => {
  //
  it('should render the Carousel component', () => {
    // Arrange
    render(
      <Carousel options={{}} plugins={[]}>
        <div>Item 1</div>
        <div>Item 2</div>
        <div>Item 3</div>
      </Carousel>,
    );
    // Act & Assert
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('Item 3')).toBeInTheDocument();
  });
});
