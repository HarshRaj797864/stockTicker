import { render, screen, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../app/AuthContext.jsx';
import { describe, it, expect } from 'vitest';

const TestComponent = () => {
  const { user, login } = useAuth();
  return (
    <div>
      <span data-testid="user">{user ? user.email : 'guest'}</span>
      <button onClick={() => login({ email: 'test@test.com' }, 'fake-token')}>Login</button>
    </div>
  );
};

describe('AuthContext', () => {
  it('provides guest state by default', () => {
    render(<AuthProvider><TestComponent /></AuthProvider>);
    expect(screen.getByTestId('user')).toHaveTextContent('guest');
  });

  it('updates state when login is called', async () => {
    render(<AuthProvider><TestComponent /></AuthProvider>);
    await act(async () => {
      screen.getByText('Login').click();
    });
    expect(screen.getByTestId('user')).toHaveTextContent('test@test.com');
  });
});
