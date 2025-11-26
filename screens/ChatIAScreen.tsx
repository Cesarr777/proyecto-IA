import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { NavigationProp } from '@react-navigation/native';

interface Message {
  text: string;
  isUser: boolean;
}

interface ChatIAProps {
  navigation: NavigationProp<any>;
  route: any;
}

export default function ChatIA({ navigation, route }: ChatIAProps) {
  const { nombre } = route.params;
  const [messages, setMessages] = useState<Message[]>([
    { text: 'Hola, soy tu asistente especializado en autismo. ¿En qué puedo ayudarte?', isUser: false }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const sendMessage = async () => {
    if (inputText.trim() === '' || loading) return;

    const userMessage = inputText.trim();
    setInputText('');

    // Agregar mensaje del usuario
    setMessages(prev => [...prev, { text: userMessage, isUser: true }]);
    setLoading(true);

    try {
  
      const GROQ_API_KEY = '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'; 
      
      const response = await fetch(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${GROQ_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'llama-3.1-8b-instant', // Modelo rápido y gratuito
            messages: [
              {
                role: 'system',
                content: 'Eres un asistente especializado en autismo. Respondes de forma clara, empática y útil en español. Tus respuestas son concisas pero informativas.'
              },
              {
                role: 'user',
                content: userMessage
              }
            ],
            temperature: 0.7,
            max_tokens: 300,
          }),
        }
      );

      console.log('Status HTTP:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.log('Error response:', errorText);
        
        if (response.status === 401) {
          setMessages(prev => [...prev, { 
            text: 'Error: API key inválida. Por favor configura tu API key de Groq.', 
            isUser: false 
          }]);
        } else {
          setMessages(prev => [...prev, { 
            text: `Error ${response.status}. Verifica tu configuración.`, 
            isUser: false 
          }]);
        }
        return;
      }

      const result = await response.json();
      console.log('Respuesta completa:', JSON.stringify(result, null, 2));

      if (result.choices && result.choices.length > 0) {
        const aiResponse = result.choices[0].message.content.trim();
        setMessages(prev => [...prev, { text: aiResponse, isUser: false }]);
      } else {
        setMessages(prev => [...prev, { 
          text: 'No recibí respuesta del modelo. Intenta de nuevo.', 
          isUser: false 
        }]);
      }

    } catch (error) {
      console.error('Error en chat:', error);
      setMessages(prev => [...prev, { 
        text: 'Error de conexión. Verifica tu internet y configuración de API.', 
        isUser: false 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chat sobre Autismo</Text>
      </View>

      <ScrollView 
        style={styles.messagesContainer}
        ref={scrollViewRef}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((message, index) => (
          <View 
            key={index} 
            style={[
              styles.messageBubble,
              message.isUser ? styles.userBubble : styles.aiBubble
            ]}
          >
            <Text style={[
              styles.messageText,
              message.isUser ? styles.userText : styles.aiText
            ]}>
              {message.text}
            </Text>
          </View>
        ))}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#666" />
            <Text style={styles.loadingText}>Escribiendo...</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Escribe tu pregunta..."
          placeholderTextColor="#999"
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={sendMessage}
          returnKeyType="send"
          multiline
          maxLength={500}
        />
        <TouchableOpacity 
          style={[styles.sendButton, (inputText.trim() === '' || loading) && styles.sendButtonDisabled]}
          onPress={sendMessage}
          disabled={inputText.trim() === '' || loading}
        >
          <Text style={styles.sendButtonText}>→</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '300',
    color: '#000',
    letterSpacing: 1,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#000',
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#F0F0F0',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: '#FFF',
  },
  aiText: {
    color: '#000',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 10,
  },
  loadingText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    backgroundColor: '#FFFFFF',
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 100,
    backgroundColor: '#F5F5F5',
    borderRadius: 22,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000',
    marginRight: 10,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#CCC',
  },
  sendButtonText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: '300',
  },
});