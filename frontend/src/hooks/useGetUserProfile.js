import{ useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import useToastHook from '../hooks/useToastHook';

const useGetUserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const { username } = useParams()
  const showToast = useToastHook();
  
  useEffect(() => {
    const getUser = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/users/profile/${username}`);
        const data = await res.json();
        if (data.error) {
          showToast("error", data.error, "error");
          return;
        }
        setUser(data);
        // console.log(data);
      } catch (error) {
        showToast("error", error, "error");
      } finally {
        setLoading(false);
      }
    };
    getUser();
  }, [username, showToast]);
  return { user, loading };
};

export default useGetUserProfile