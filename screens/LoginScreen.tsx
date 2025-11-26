import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { NavigationProp } from '@react-navigation/native';

interface HomeScreenProps {
  navigation: NavigationProp<any>;
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const [nombre, setNombre] = useState('');

  const handleContinue = () => {
    if (nombre.trim() === '') {
      return;
    }
    // Navegar a la siguiente pantalla con el nombre
    navigation.navigate('Home', { nombre });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Hola</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Tu nombre"
            placeholderTextColor="#999"
            value={nombre}
            onChangeText={setNombre}
            onSubmitEditing={handleContinue}
            returnKeyType="done"
            autoFocus={true}
            maxLength={30}
          />

          <TouchableOpacity 
            style={[styles.button, nombre.trim() === '' && styles.buttonDisabled]} 
            onPress={handleContinue}
            disabled={nombre.trim() === ''}
          >
            <Text style={styles.buttonText}>→</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
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
  title: {
    fontSize: 48,
    fontWeight: '300',
    color: '#000',
    marginBottom: 60,
    letterSpacing: 1,
  },
  input: {
    width: '100%',
    height: 60,
    fontSize: 24,
    color: '#000',
    borderBottomWidth: 2,
    borderBottomColor: '#000',
    paddingHorizontal: 10,
    marginBottom: 60,
    textAlign: 'center',
  },
  button: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#CCC',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 36,
    fontWeight: '300',
  },
});