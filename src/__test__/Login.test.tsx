import { render, screen } from '@testing-library/react';
import Login from '../pages/Login';
import { Provider } from 'react-redux';
import { store } from '../store';
import { BrowserRouter } from 'react-router-dom';

test('renders login form', () => {
  render(
    <Provider store={store}>
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    </Provider>
  );

  expect(screen.getByText(/login/i)).toBeInTheDocument();
});
