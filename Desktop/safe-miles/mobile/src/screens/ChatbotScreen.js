import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Colors, Spacing } from '../theme/colors';
import { Send, Mic } from 'lucide-react-native';

export default function ChatbotScreen() {
  const [messages, setMessages] = useState([
    { id: '1', text: 'Hello! I am your SaarthiMitra assistant. How can I help you today?', sender: 'bot' }
  ]);
  const [input, setInput] = useState('');

  const suggestions = ['I have a flat tire', 'Need a tow truck', 'Car won\'t start'];

  const sendMessage = (text) => {
    if (!text.trim()) return;
    const newMsg = { id: Date.now().toString(), text, sender: 'user' };
    setMessages((prev) => [...prev, newMsg]);
    setInput('');
    
    // Mock bot response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev, 
        { id: (Date.now() + 1).toString(), text: 'I can help with that! Please press the SOS button to instantly dispatch a verified mechanic to your location.', sender: 'bot' }
      ]);
    }, 1000);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AI Assistant</Text>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.bubble, item.sender === 'user' ? styles.userBubble : styles.botBubble]}>
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
        contentContainerStyle={styles.list}
      />

      <View style={styles.suggestions}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {suggestions.map((s, i) => (
            <TouchableOpacity key={i} style={styles.suggestionChip} onPress={() => sendMessage(s)}>
              <Text style={styles.suggestionText}>{s}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.inputArea}>
        <TouchableOpacity style={styles.micBtn}>
          <Mic color={Colors.textSecondary} size={24} />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor={Colors.textSecondary}
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={() => sendMessage(input)}>
          <Send color={Colors.text} size={20} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: Spacing.lg,
    paddingTop: Spacing.xl,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  list: {
    padding: Spacing.md,
  },
  bubble: {
    maxWidth: '80%',
    padding: Spacing.md,
    borderRadius: 16,
    marginBottom: Spacing.md,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
  },
  botBubble: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.surface,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    color: Colors.text,
    fontSize: 16,
  },
  suggestions: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  suggestionChip: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    marginRight: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  suggestionText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  inputArea: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.surface,
  },
  input: {
    flex: 1,
    height: 48,
    backgroundColor: Colors.background,
    borderRadius: 24,
    paddingHorizontal: Spacing.md,
    color: Colors.text,
    marginHorizontal: Spacing.sm,
  },
  micBtn: {
    padding: Spacing.sm,
  },
  sendBtn: {
    backgroundColor: Colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
