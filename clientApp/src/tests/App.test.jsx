import React from 'react';
import { render } from '@testing-library/react';
import App from '../App';
import { Provider } from 'react-redux';
import store from '../redux/store';

test('Render app and show auth', () => {
  const { container } = render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>,
  );
  expect(container).toMatchSnapshot();
});

test.skip('Render app and trigger some events', () => {
  const { container, getAllByText } = render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>,
  );

  container.querySelector('input').value = 'Nick';
  container.querySelector('button').click();

  expect(getAllByText(/join|create/i)).toBeInTheDocument();
});
