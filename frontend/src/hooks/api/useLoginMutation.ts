import { postLogIn } from '@/api/auth';
import { axiosInstance } from '@/api/axiosInstance';
import { useStore } from '@/store/useStore';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

export const useLogInMutation = () => {
  const navigate = useNavigate();

  const logIn = useStore((state) => state.logIn);

  const logInMutation = useMutation({
    mutationFn: postLogIn,
    onSuccess: ({ accessToken }) => {
      console.log('token', accessToken);
      localStorage.setItem(`ACCESS_TOKEN_KEY`, accessToken);
      axiosInstance.defaults.headers.Authorization = `Bearer ${accessToken}`;
      logIn();
    },
    onSettled: () => {
      navigate('/');
    },
  });

  return logInMutation;
};
