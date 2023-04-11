import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import React from 'react';
import { useLatestUploads } from '@hooks';
import { Colors } from '@constants/colors';
import { ChapterCard, Text } from '@atoms';

interface LatestUpdatesListProps {
  style?: StyleProp<ViewStyle>;
}

const LatestUpdatesList = ({ style }: LatestUpdatesListProps) => {
  const { data, status } = useLatestUploads();

  return (
    <View style={[style]}>
      <View style={s.listHeader}>
        <Text style={s.listHeaderTitle}>Latest Updates</Text>
      </View>
      <View style={s.list}>
        {status === 'error' && <Text>Error</Text>}
        {status === 'loading' && (
          <View style={s.loader}>
            <ActivityIndicator />
          </View>
        )}
        {status === 'success' && data.data && data.ok && (
          <>
            {data.data.data.map(item => (
              <ChapterCard {...item} key={item.id} />
            ))}
          </>
        )}
      </View>
    </View>
  );
};

export default LatestUpdatesList;

const s = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listHeader: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  listHeaderTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.WHITE,
  },
  list: {
    flexDirection: 'column',
    width: '90%',
    height: 472,
    backgroundColor: Colors.BLACK_LIGHT,
    marginHorizontal: '5%',
    borderRadius: 15,
  },
});
