import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useCallback, useMemo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '@constants/colors';
import { MangaSearchFilters, useMangaQuery, useSCReducer } from '@hooks';
import { MangaExpansions, MangaResponse } from '@api/manga-api';
import { MangaCard, SearchInput, Text } from '@atoms';
import { BottomTabScreenNavigationProp } from '@types';
import {
  BottomTabNavigatorRoutes,
  StackNavigatorRoutes,
} from '@navigation/types';
import { FilterIcon } from '@icons';

const isMangaResponse = (obj: any): obj is MangaResponse => {
  return typeof obj === 'object' && 'result' in obj && obj.result === 'ok';
};

const keyExtractor = ({ id }: MangaResponse['data'][number]) => id;

type Navigation =
  BottomTabScreenNavigationProp<BottomTabNavigatorRoutes.Search>['navigation'];

const INITIAL_PARAMS: Partial<MangaSearchFilters> = {
  title: '',
  order: {
    relevance: 'desc',
  },
};

const SearchScreen = () => {
  const { top } = useSafeAreaInsets();

  const navigation = useNavigation<Navigation>();

  const [params, dispatch] = useSCReducer(INITIAL_PARAMS);

  const {
    data,
    status,
    refetch,
    isLoading,
    fetchNextPage,
    isFetchingNextPage,
  } = useMangaQuery(params, {
    includes: [MangaExpansions.COVER],
    limit: 10,
  });

  const mangaData = useMemo(() => {
    const successData =
      data?.pages
        .flat()
        .filter(isMangaResponse)
        .flatMap(res => res.data) || [];

    return successData;
  }, [data?.pages]);

  const onEndReached = useCallback(() => {
    if (!isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, isFetchingNextPage]);

  const onInputSubmit = useCallback(
    (value: string) => {
      dispatch({
        type: 'setTitle',
        payload: value,
      });
      refetch();
    },
    [refetch, dispatch],
  );

  const showAdvancedSearch = useCallback(() => {
    // TODO: implement advanced search
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: MangaResponse['data'][number] }) => {
      const onPress = () => {
        navigation.push(StackNavigatorRoutes.MangaDetails, {
          mangaId: item.id,
        });
      };

      return (
        <MangaCard
          {...item}
          onPress={onPress}
          style={{
            transform: [{ scale: 1.2 }],
          }}
        />
      );
    },
    [navigation],
  );

  if (status === 'error') {
    return (
      <View style={s.container}>
        <Text style={s.text}>
          {'An error occurred while fetching manga data.'}
        </Text>
      </View>
    );
  }

  return (
    <View style={[s.container, { paddingTop: top }]}>
      <FlatList
        style={s.list}
        contentContainerStyle={s.listContent}
        columnWrapperStyle={s.listWrapper}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="always"
        onEndReachedThreshold={0.5}
        numColumns={2}
        data={mangaData}
        onEndReached={onEndReached}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        stickyHeaderIndices={[0]}
        ListHeaderComponent={
          <View style={s.searchContainer}>
            <SearchInput
              onSubmit={onInputSubmit}
              onTextChange={onInputSubmit}
              style={s.search}
            />
            <TouchableOpacity onPress={showAdvancedSearch}>
              <FilterIcon />
            </TouchableOpacity>
          </View>
        }
        ListHeaderComponentStyle={s.header}
        ListFooterComponentStyle={s.footer}
        ListFooterComponent={
          <View style={s.loader}>
            {(isFetchingNextPage || isLoading) && (
              <Text style={s.text}>Loading...</Text>
            )}
          </View>
        }
      />
    </View>
  );
};

export default SearchScreen;

const s = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.BLACK,
  },
  footer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 0,
  },
  text: {
    color: Colors.WHITE,
  },
  header: {
    width: '100%',
    alignItems: 'center',
    height: 48,
    backgroundColor: Colors.BLACK,
    marginBottom: -30,
  },
  search: {
    flex: 1,
    height: 40,
    marginRight: 8,
  },
  searchContainer: {
    width: '90%',
    height: 40,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  loader: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    width: '100%',
  },
  listContent: {
    gap: 60,
  },
  listWrapper: {
    justifyContent: 'space-evenly',
  },
});
