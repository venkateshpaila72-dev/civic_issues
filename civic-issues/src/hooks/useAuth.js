import { useAuthContext } from '../context/AuthContext';

/**
 * Convenience re-export of the auth context hook.
 * Components import this instead of importing useAuthContext directly.
 */
const useAuth = () => useAuthContext();

export default useAuth;