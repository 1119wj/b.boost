import { useStore } from '@/store/useStore';
import Box from '../common/Box';
import { Link } from 'react-router-dom';

const AddPlaceButton = () => {
  const activePlace = useStore((state) => state.place);
  return (
    <Link to={`/create/map/${activePlace.id}`}>
      <Box>
        <button
          className={`h-14 w-full rounded-md ${activePlace ? 'bg-c_bg_blue' : 'bg-c_button_gray'} p-4 text-xl font-semibold text-white`}
          disabled={!!!activePlace}
        >
          장소 추가하기
        </button>
      </Box>
    </Link>
  );
};

export default AddPlaceButton;
