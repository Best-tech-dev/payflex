import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors } from '@/constants/theme';

const mockMessages = [
  { id: '1', sender: 'user', text: 'Hello, I need help with my account.' },
  { id: '2', sender: 'bot', text: 'Sure, I can help you with that. What seems to be the problem?' },
  { id: '3', sender: 'user', text: 'I am unable to access my wallet.' },
  { id: '4', sender: 'bot', text: 'Have you tried resetting your password?' },
  { id: '5', sender: 'user', text: 'Yes, but it still doesnt work.' },
  { id: '6', sender: 'bot', text: 'Let me check your account details.' },
  { id: '7', sender: 'user', text: 'Thank you.' },
  { id: '8', sender: 'bot', text: 'I see the issue. I will resolve it for you.' },
  { id: '9', sender: 'user', text: 'Great, how long will it take?' },
  { id: '10', sender: 'bot', text: 'It should be resolved within the next 24 hours.' },
  { id: '11', sender: 'user', text: 'Okay, thank you for your help.' },
  { id: '12', sender: 'bot', text: "You're welcome! Is there anything else I can assist you with?" },
  { id: '13', sender: 'user', text: "No, that's all for now" },
  { id: '14', sender: 'bot', text: 'Alright, have a great day!' },
  { id: '15', sender: 'user', text: 'You too, bye.' },
  { id: '16', sender: 'bot', text: 'Goodbye!' },
  { id: '17', sender: 'user', text: 'Thanks again.' },
  { id: '18', sender: 'bot', text: 'Anytime!' },
  { id: '19', sender: 'user', text: 'Bye.' },
  { id: '20', sender: 'bot', text: 'Take care!' },
];

const Support = () => {
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    // Logic to send message
    if (message.trim()) {
      console.log('Message sent:', message);
      setMessage('');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#E5E7EB', backgroundColor: 'white' }}>
          <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#111827' }}>Support</Text>
        </View>
        
        {/* Messages */}
        <ScrollView style={{ flex: 1, padding: 16, backgroundColor: '#F9FAFB' }}>
          {mockMessages.map((msg) => (
            <View key={msg.id} style={{ 
              marginBottom: 12, 
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', 
              backgroundColor: msg.sender === 'user' ? '#DCF8C6' : '#ECECEC', 
              padding: 10, 
              borderRadius: 8,
              maxWidth: '80%'
            }}>
              <Text style={{ color: '#111827' }}>{msg.text}</Text>
            </View>
          ))}
        </ScrollView>
        
        {/* Input Bar */}
        <View style={{ 
          flexDirection: 'row', 
          alignItems: 'center', 
          padding: 16, 
          borderTopWidth: 1, 
          borderTopColor: '#E5E7EB',
          backgroundColor: 'white'
        }}>
          <TextInput
            style={{ 
              flex: 1, 
              height: 40, 
              borderColor: '#E5E7EB', 
              borderWidth: 1, 
              borderRadius: 8, 
              paddingHorizontal: 8, 
              marginRight: 8,
              backgroundColor: 'white'
            }}
            placeholder="Type a message"
            value={message}
            onChangeText={setMessage}
          />
          <TouchableOpacity style={{ marginRight: 8 }}>
            <MaterialCommunityIcons name="translate" size={24} color="#111827" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSendMessage}>
            <MaterialCommunityIcons name="send" size={24} color={colors.primary.main} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Support;