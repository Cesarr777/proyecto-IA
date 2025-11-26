import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { NavigationProp } from '@react-navigation/native';

interface MapaScreenProps {
  navigation: NavigationProp<any>;
  route: any;
}

export default function MapaScreen({ navigation, route }: MapaScreenProps) {
  const { nombre } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.greeting}>Hola, {nombre}</Text>
        
        <View style={styles.buttonsContainer}>
          <TouchableOpacity 
            style={styles.mainButton}
            onPress={() => navigation.navigate('EmocionesScreen', { nombre })}
          >
            <Text style={styles.mainButtonText}>Detección de emociones</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.mainButton}
            onPress={() => navigation.navigate('ChatIAScreen', { nombre })}
          >
            <Text style={styles.mainButtonText}>Chat IA</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('SugerenciasScreen', { nombre })}
        >
          <Text style={styles.secondaryButtonText}>Sugerencias</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 100,
  },
  content: {
    width: '80%',
    maxWidth: 400,
    alignItems: 'center',
  },
  greeting: {
    fontSize: 32,
    fontWeight: '300',
    color: '#000',
    marginBottom: 80,
    letterSpacing: 1,
  },
  buttonsContainer: {
    width: '100%',
    marginBottom: 60,
  },
  mainButton: {
    width: '100%',
    height: 70,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderRadius: 8,
  },
  mainButtonText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '400',
    letterSpacing: 0.5,
  },
  secondaryButton: {
    width: '100%',
    height: 60,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 8,
  },
  secondaryButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '400',
    letterSpacing: 0.5,
  },
});