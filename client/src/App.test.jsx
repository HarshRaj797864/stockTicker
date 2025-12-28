import {render, screen} from '@testing-library/react';
import App from './App.jsx';
import {describe, it, expect} from 'vitest';

describe('App Component', () => {
  it('renders the Vite + React header', () => {
    render(<App />);
    
    const heading = screen.getByText(/Vite \+ React/i); 
    expect(heading).toBeInTheDocument();
  });
});
