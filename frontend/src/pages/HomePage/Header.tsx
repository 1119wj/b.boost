import { useUserInfoQuery } from '@/hooks/api/useUserInfoQuery';
import { useStore } from '@/store/useStore';
import { useEffect } from 'react';

const Header = () => {
  const user = useStore((state) => state.user);
  const isLogged = useStore((state) => state.isLogged);
  const setUser = useStore((state) => state.setUser);
  const handleLogin = () => {
    window.location.href = import.meta.env.VITE_GOOGLE_AUTH_URL_TEST;
  };
  const handleAdminLogin = () => {
    localStorage.setItem(
      'ACCESS_TOKEN_KEY',
      import.meta.env.VITE_TEST_ACCESS_TOKEN,
    );
    console.log(localStorage.getItem('ACCESS_TOKEN_KEY'));
  };

  useEffect(() => {
    if (isLogged) {
      const data = useUserInfoQuery();
      setUser(data);
      console.log('user', data);
    }
  }, [isLogged]);

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <h1 className="text-2xl font-bold">Logo</h1>
        <button className="" onClick={handleLogin}>
          {isLogged ? user?.id : '구글 로그인'}
        </button>
        <button
          onClick={handleAdminLogin}
          className="rounded-md border-2 border-gray-500 px-4 py-2"
        >
          테스트 id 로그인
        </button>
      </div>
    </header>
  );
};

export default Header;
