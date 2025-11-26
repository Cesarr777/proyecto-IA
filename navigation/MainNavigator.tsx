// MainNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { enableScreens } from 'react-native-screens';

// Importar tus pantallas
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import SugerenciasScreen from '../screens/SugerenciasScreen';
import EmocionesScreen from '../screens/EmocionesScreen';
import ChatIAScreen from '../screens/ChatIAScreen';

// Tipos para las rutas
export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  SugerenciasScreen: undefined;
  EmocionesScreen: undefined;
  ChatIAScreen: undefined;
  InfoCarScreen: { availableSpots: number };
  PremiumScreen: { availableSpots: number };
};

// Tipado de navegación y rutas
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

export type InfoCarScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'InfoCarScreen'
>;

export type InfoCarScreenRouteProp = RouteProp<
  RootStackParamList,
  'InfoCarScreen'
>;

// Habilitar pantallas nativas (mejor rendimiento)
enableScreens();

const Stack = createStackNavigator<RootStackParamList>();

export default function MainNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Inicio' }}
        />
        <Stack.Screen
          name="SugerenciasScreen"
          component={SugerenciasScreen}
          options={{ title: 'Sugerencias' }}
        />
        <Stack.Screen
          name="EmocionesScreen"
          component={EmocionesScreen}
          options={{ title: 'Emociones' }}
        />
        <Stack.Screen
          name="ChatIAScreen"
          component={ChatIAScreen}
          options={{ title: 'Chat con IA' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
