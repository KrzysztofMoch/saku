import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import { authorize_user } from 'src/utils';
import {
  BottomTabNavigatorRoutes,
  StackNavigatorParams,
  StackNavigatorRoutes,
} from '@navigation/types';
import { useNavigation } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { Colors, AppLogo } from '@saku/shared';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '@store/auth';

type Navigation = StackScreenProps<
  StackNavigatorParams,
  StackNavigatorRoutes.Auth
>['navigation'];

const AuthScreen = () => {
  const { navigate } = useNavigation<Navigation>();
  const { bottom } = useSafeAreaInsets();
  const { setState, ...state } = useAuthStore();

  const handleAuth = async () => {
    await authorize_user();
    navigateToApp();
  };

  const skipAuth = () => {
    setState({ ...state, skipped: true });
    navigateToApp();
  };

  const navigateToApp = () => {
    navigate(StackNavigatorRoutes.BottomTabNavigator, {
      screen: BottomTabNavigatorRoutes.Home,
    });
  };

  return (
    <View style={[s.container, { paddingBottom: bottom }]}>
      <AppLogo width={Dimensions.get('window').width - 40} />
      <TouchableOpacity onPress={handleAuth} style={s.loginButton}>
        <Text style={s.loginText}>Login with MangaDex</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={skipAuth} style={s.skipButton}>
        <Text style={s.skipText}>Continue without login</Text>
      </TouchableOpacity>
      <Text style={s.info}>
        Your login and password are <Text style={s.infoBold}>not saved</Text>
        {'\n'} in the application
      </Text>
    </View>
  );
};

export default AuthScreen;

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BLACK_LIGHT,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  loginButton: {
    marginTop: '75%',
    marginHorizontal: '10%',
    marginBottom: 20,
    backgroundColor: Colors.PINK,
    width: '80%',
    height: 62,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    color: Colors.WHITE,
    fontSize: 22,
    fontWeight: 'bold',
  },
  skipButton: {
    marginHorizontal: '10%',
  },
  skipText: {
    color: Colors.WHITE,
    fontSize: 17,
  },
  info: {
    marginTop: '20%',
    color: Colors.WHITE,
    fontWeight: '400',
    fontSize: 13,
    textAlign: 'center',
  },
  infoBold: {
    fontWeight: 'bold',
  },
  button: {
    marginVertical: 10,
  },
});
