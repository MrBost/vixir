import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { routes } from '../src/App';

it('renders the landing headline and links every screen', () => {
  render(<RouterProvider router={createMemoryRouter(routes, { initialEntries: ['/'] })} />);
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Every student deserves a real practical.');
  expect(screen.getByText('Lab workspace')).toBeInTheDocument();
});
