import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../redux/store'; // ✅ correct relative path

const useAppDispatch = () => useDispatch<AppDispatch>();

export default useAppDispatch;
