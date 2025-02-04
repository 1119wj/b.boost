import { getPlace } from '@/api/place';
import React from 'react';
import { Place } from '@/types';
import PlaceItem from './PlaceItem';
import Marker from '@/components/Marker/Marker';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';

type SearchResultsProps = {
  query: string;
};

const SearchResults = ({ query }: SearchResultsProps) => {
  const { ref, data, isFetchingNextPage, hasNextPage } = useInfiniteScroll<
    Place[]
  >({
    queryKey: ['places', 'search'],
    query: query,
    queryFn: ({ pageParam }) => getPlace(query, pageParam),
    getNextPageParam: (lastPage) => {
      return lastPage.length > 4 ? lastPage.length : undefined;
    },
  });
  const isEmptyResults = (data?: { pages: Place[][] }) =>
    !data?.pages || data.pages.every((page) => page.length === 0);

  const isEmpty = isEmptyResults(data);

  return (
    <div className="max-h-[600px] flex-grow">
      {query && <p className="p-1 text-base">"{query}"에 대한 검색결과</p>}
      {!isEmpty ? (
        <div className="scrollbar-thumb-rounded-lg flex max-h-[600px] flex-col space-y-4 overflow-y-auto p-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-400 hover:scrollbar-track-gray-200 hover:scrollbar-thumb-gray-500">
          {data?.pages.map((page, index) => (
            <React.Fragment key={index}>
              {page.map((place: Place) => (
                <React.Fragment key={place.id}>
                  <PlaceItem key={place.id} place={place} />
                  <Marker
                    key={place.google_place_id}
                    position={{
                      lat: place.location.latitude,
                      lng: place.location.longitude,
                    }}
                  />
                </React.Fragment>
              ))}
            </React.Fragment>
          ))}
          <div ref={ref} className="h-1" />
        </div>
      ) : (
        <div className="flex h-44 items-center justify-center">
          <p className="text-lg text-c_button_gray">검색 결과 없음</p>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
