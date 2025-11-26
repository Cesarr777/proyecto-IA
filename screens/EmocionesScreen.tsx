import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ActivityIndicator, ScrollView, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { NavigationProp } from '@react-navigation/native';

interface Emotion {
  label: string;
  score: number;
}

interface DeteccionEmocionesProps {
  navigation: NavigationProp<any>;
  route: any;
}

export default function DeteccionEmociones({ navigation, route }: DeteccionEmocionesProps) {
  const { nombre } = route.params;
  const [image, setImage] = useState<string | null>(null);
  const [emotions, setEmotions] = useState<Emotion[]>([]);
  const [loading, setLoading] = useState(false);

  // Función para seleccionar imagen de la galería
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permiso necesario', 'Se necesita permiso para acceder a la galería');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      analyzeEmotion(result.assets[0].uri);
    }
  };

  // Función para analizar la emoción con Hugging Face
  const analyzeEmotion = async (imageUri: string) => {
    setLoading(true);
    setEmotions([]);

    try {
      console.log('Preparando imagen...');

      // Leer imagen como blob
      const response = await fetch(imageUri);
      const blob = await response.blob();

      console.log('Enviando imagen a Hugging Face...');

      // Intentar con diferentes modelos
      const apiResponse = await fetch(
        'https://api-inference.huggingface.co/models/dima806/facial_emotions_image_detection',
        {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer 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',
          },
          body: blob,
        }
      );

      console.log('Status de respuesta:', apiResponse.status);

      if (apiResponse.status === 403) {
        Alert.alert('API Key inválida', 'Tu API Key no es válida. Verifica en huggingface.co/settings/tokens');
        return;
      }

      if (apiResponse.status === 503) {
        Alert.alert('Modelo cargando', 'El modelo se está iniciando. Espera 20 segundos e intenta de nuevo.');
        return;
      }

      const textResponse = await apiResponse.text();
      console.log('Respuesta:', textResponse.substring(0, 300));

      let result;
      try {
        result = JSON.parse(textResponse);
      } catch (e) {
        console.log('Error parseando JSON');
        Alert.alert('Error', 'Respuesta inesperada del servidor');
        return;
      }

      console.log('Resultado parseado:', result);

      if (result.error) {
        console.log('Error de API:', result.error);
        Alert.alert('Error', result.error);
        return;
      }

      if (result && Array.isArray(result) && result.length > 0) {
        const sortedEmotions = result.sort((a: Emotion, b: Emotion) => b.score - a.score);
        setEmotions(sortedEmotions);
        console.log('¡Emociones detectadas!', sortedEmotions);
      } else {
        Alert.alert('Sin resultados', 'No se detectó ninguna cara en la imagen');
      }
    } catch (error) {
      console.error('Error general:', error);
      Alert.alert('Error', 'Error al procesar la imagen.');
    } finally {
      setLoading(false);
    }
  };

  // Mapeo de emociones a español
  const emotionLabels: { [key: string]: string } = {
    'happy': 'Felicidad',
    'sad': 'Tristeza',
    'angry': 'Enojo',
    'surprise': 'Sorpresa',
    'fear': 'Miedo',
    'disgust': 'Disgusto',
    'neutral': 'Neutral',
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Analiza tu emoción</Text>

        {!image ? (
          <TouchableOpacity style={styles.selectButton} onPress={pickImage}>
            <Text style={styles.selectButtonText}>Seleccionar imagen</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.imageContainer}>
            <Image source={{ uri: image }} style={styles.image} />
            <TouchableOpacity style={styles.changeButton} onPress={pickImage}>
              <Text style={styles.changeButtonText}>Cambiar imagen</Text>
            </TouchableOpacity>
          </View>
        )}

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#000" />
            <Text style={styles.loadingText}>Analizando...</Text>
          </View>
        )}

        {emotions.length > 0 && !loading && (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsTitle}>Resultados</Text>
            {emotions.map((emotion, index) => (
              <View key={index} style={styles.emotionRow}>
                <Text style={styles.emotionLabel}>
                  {emotionLabels[emotion.label.toLowerCase()] || emotion.label}
                </Text>
                <View style={styles.barContainer}>
                  <View 
                    style={[
                      styles.barFill, 
                      { width: `${emotion.score * 100}%` }
                    ]} 
                  />
                </View>
                <Text style={styles.emotionScore}>
                  {(emotion.score * 100).toFixed(0)}%
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    paddingTop: 60,
    paddingHorizontal: 40,
    paddingBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '300',
    color: '#000',
    marginBottom: 60,
    letterSpacing: 1,
  },
  selectButton: {
    width: '100%',
    height: 200,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  selectButtonText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '400',
    letterSpacing: 0.5,
  },
  imageContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 40,
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    marginBottom: 20,
  },
  changeButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 8,
  },
  changeButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '400',
  },
  loadingContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    color: '#000',
    fontWeight: '300',
  },
  resultsContainer: {
    width: '100%',
    marginTop: 40,
  },
  resultsTitle: {
    fontSize: 24,
    fontWeight: '300',
    color: '#000',
    marginBottom: 30,
    letterSpacing: 1,
  },
  emotionRow: {
    marginBottom: 25,
  },
  emotionLabel: {
    fontSize: 18,
    fontWeight: '400',
    color: '#000',
    marginBottom: 8,
  },
  barContainer: {
    width: '100%',
    height: 30,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 5,
  },
  barFill: {
    height: '100%',
    backgroundColor: '#000',
  },
  emotionScore: {
    fontSize: 16,
    fontWeight: '300',
    color: '#666',
    textAlign: 'right',
  },
});