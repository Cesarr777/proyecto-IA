import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import io from 'socket.io-client';

export default function MapaScreen() {
  const [primerCajonOcupado, setPrimerCajonOcupado] = useState(false);

  useEffect(() => {
    const socket = io('http://192.168.72.206:5002'); // Cambia a la IP del servidor si no estás en localhost

    socket.on('estadoArduino', (data) => {
      const mensaje = data.mensaje;
      if (mensaje === 'Ocupado') {
        setPrimerCajonOcupado(true);
      } else if (mensaje === 'Libre') {
        setPrimerCajonOcupado(false);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <View style={styles.backgroundContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Bienvenido al mapa inteligente</Text>
        
        {/* Texto adicional debajo del título */}
        <Text style={styles.subtitle}>En esta pantalla podrás saber cuáles lugares están disponibles o ocupados</Text>

        <View style={styles.mapContainer}>
          {/* Fondo blanco semitransparente */}
          <View style={styles.fondoBlanco}></View>

          {/* Imagen del mapa de estacionamiento */}
          <Image source={require('../../assets/PARKING.png')} style={styles.mapImage} />

          {/* Superposición para el primer cajón */}
          <View 
            style={[
              styles.primerCajonOverlay, 
              { backgroundColor: primerCajonOcupado ? 'red' : 'green' } 
            ]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    backgroundColor: 'white', // Fondo blanco
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 15,
  },
  mapContainer: {
    width: '90%',
    height: '60%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  fondoBlanco: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Blanco con opacidad del 80%
    borderRadius: 10, // Ajusta el borde si quieres un efecto suave
  },
  mapImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  primerCajonOverlay: {
    position: 'absolute',
    top: '35%',  
    left: '43.9%', 
    width: 50,   
    height: 50,  
    borderRadius: 5,
    opacity: 0.8,
  },
  availableText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
});
