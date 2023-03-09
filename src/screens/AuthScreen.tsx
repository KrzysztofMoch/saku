import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { authorize_user } from '@utils';
import {
  BottomTabNavigatorRoutes,
  StackNavigatorParams,
  StackNavigatorRoutes,
} from '@navigation/types';
import { useNavigation } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';

type Navigation = StackScreenProps<
  StackNavigatorParams,
  StackNavigatorRoutes.Auth
>['navigation'];

const AuthScreen = () => {
  const { navigate } = useNavigation<Navigation>();

  const handleAuth = async () => {
    console.log('Authenticating...');
    await authorize_user();
    navigateToApp();
  };

  const navigateToApp = () => {
    navigate(StackNavigatorRoutes.BottomTabNavigator, {
      screen: BottomTabNavigatorRoutes.Home,
    });
  };

  return (
    <View style={s.container}>
      <Text style={s.text}>Saku</Text>
      <TouchableOpacity onPress={handleAuth} style={s.button}>
        <Text style={s.authText}>Login with MangaDex</Text>
      </TouchableOpacity>
      <TouchableOpacity style={s.button} onPress={navigateToApp}>
        <Text style={s.authText}>Continue without login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AuthScreen;

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'black',
    fontSize: 30,
  },
  authText: {
    color: 'blue',
  },
  button: {
    marginVertical: 10,
  },
});
