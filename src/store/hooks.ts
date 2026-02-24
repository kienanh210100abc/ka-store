import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./index";

// Hook để dispatch actions (có type-safe)
// Dispatch actions với TypeScript support
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

// Hook để select state (có type-safe)
// Lấy state với autocomplete và type checking
export const useAppSelector = useSelector.withTypes<RootState>();
