import AppRouter from './routes/AppRouter';
import { Provider } from 'react-redux';
import store from './redux/store';
import './styles/index.css';

export default function App() {
  return (
    <Provider store={store}>
      <AppRouter />
    </Provider>
  );
}
