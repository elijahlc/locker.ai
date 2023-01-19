import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './Components/App';
import { Provider } from 'react-redux';
import store from './store';
import { BrowserRouter } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';

const root = createRoot(document.querySelector('#root'));

root.render(
	<Provider store={store}>
		<BrowserRouter>
			<SnackbarProvider
				maxSnack={3}
				anchorOrigin={{
					vertical: 'top',
					horizontal: 'right',
				}}
			>
				<App />
			</SnackbarProvider>
		</BrowserRouter>
	</Provider>
);
