import { Provider } from 'react-redux';
import './App.css'
import { store } from './app/store';
import routes from "./routes";
import { RouterProvider } from 'react-router-dom';

function App() {

  return (
    <>
      <Provider store={store}>
        <RouterProvider router={routes} />
      </Provider>
    </>
  )
}

export default App
