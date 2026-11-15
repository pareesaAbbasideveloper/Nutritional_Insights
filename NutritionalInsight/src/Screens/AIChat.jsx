import {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import AntIcons from 'react-native-vector-icons/AntDesign';

// Removed AsyncStorage as it's no longer needed for dynamic user preferences
// import AsyncStorage from '@react-native-async-storage/async-storage';

import {GoogleGenerativeAI} from '@google/generative-ai';

const GEMINI_API_KEY = 'AIzaSyCMGlUAjeXHonuG9-jqBOI8jfKd-6E1UcA'; // <--- REPLACE THIS
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({model: 'gemini-1.5-flash'});

export default function AIChatScreen() {
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [isSending, setIsSending] = useState(false);
  // Removed currentUser and isLoadingUser as they are no longer relevant for dynamic preferences
  // const [currentUser, setCurrentUser] = useState(null);
  // const [isLoadingUser, setIsLoadingUser] = useState(true);

  // Directly set isLoadingUser to false and initialize chat without user data
  const [isLoadingUser, setIsLoadingUser] = useState(false); // Set to false directly

  useEffect(() => {
    // No need to fetch user data, directly initialize chat messages
    setChatMessages([
      {
        id: '1',
        sender: 'AI',
        text: 'Hello! I am your Health & Food Counselor AI. How can I assist you today?',
      },
    ]);
  }, []); // Empty dependency array means this runs once on mount

  const handleSendMessage = async () => {
    if (!message.trim()) {
      return;
    }
    // No need to check for currentUser or isLoadingUser for message sending
    // if (!currentUser && !isLoadingUser) {
    //   Alert.alert('Error', 'User data not loaded. Cannot send message.');
    //   return;
    // }
    if (isSending) {
      return;
    }

    const userMessageText = message.trim();
    const userMessage = {
      id: String(chatMessages.length + 1),
      sender: 'User',
      text: userMessageText,
    };

    setChatMessages(prevMessages => [...prevMessages, userMessage]);
    setMessage('');
    setIsSending(true);

    try {
      // --- CRITICAL FIX: Prepare history for Gemini, ensuring it starts with 'user' ---
      const geminiHistory = [];
      // Skip the very first message if it's from the AI (our initial greeting)
      const startIndex =
        chatMessages.length > 0 && chatMessages[0].sender === 'AI' ? 1 : 0;

      for (let i = startIndex; i < chatMessages.length; i++) {
        const msg = chatMessages[i];
        const role = msg.sender === 'User' ? 'user' : 'model';
        geminiHistory.push({
          role: role,
          parts: [{text: msg.text}],
        });
      }

      // --- MODIFIED SYSTEM INSTRUCTION: Hardcoded for Health & Food ---
      const systemInstruction = `
        You are a supportive Counselor AI. Your expertise is strictly limited to providing advice, information, and support related to **Health and Food**.

        When a user asks a question:
        1. If the question is clearly within the scope of Health and Food, provide a helpful, empathetic, and concise answer.
        2. If the question is entirely outside the scope of Health and Food, you MUST respond ONLY with: "I am designed to assist with topics related to Health & Food. I cannot answer this question. Please ask something within my scope."
        3. Do not engage in conversations about topics outside the specified scope.
        4. Be concise and to the point.
      `;

      // Initialize the chat session with the prepared history
      const chat = model.startChat({
        history: geminiHistory,
        generationConfig: {
          maxOutputTokens: 200,
        },
      });

      // Send the user's new message to the chat
      const result = await chat.sendMessage(
        systemInstruction + "\n\nUser's question: " + userMessageText,
      );
      const response = await result.response;
      const aiResponseText = response.text();

      setChatMessages(prevMessages => [
        ...prevMessages,
        {
          id: String(prevMessages.length + 1),
          sender: 'AI',
          text: aiResponseText,
        },
      ]);
    } catch (error) {
      console.error('Error communicating with Gemini AI:', error);
      Alert.alert(
        'Error',
        'Failed to get a response from Counselor AI. Please try again later.',
      );
    } finally {
      setIsSending(false);
    }
  };

  // Removed loading user preferences UI as it's no longer needed
  // if (isLoadingUser) {
  //   return (
  //     <SafeAreaView style={styles.loadingContainer}>
  //       <ActivityIndicator size="large" color="#368A8F" />
  //       <Text style={styles.loadingText}>Loading user preferences...</Text>
  //     </SafeAreaView>
  //   );
  // }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
        {/* Chat Messages */}
        <ScrollView
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          ref={scrollView => {
            if (scrollView) {
              scrollView.scrollToEnd({animated: true});
            }
          }}>
          {chatMessages.map(msg => (
            <View
              key={msg.id}
              style={[
                styles.messageBubble,
                msg.sender === 'AI' ? styles.aiMessage : styles.userMessage,
              ]}>
              {msg.sender === 'AI' && (
                <View style={styles.aiAvatarPlaceholder}>
                  <Text style={styles.aiAvatarText}>AI</Text>
                </View>
              )}
              <Text style={styles.messageText}>{msg.text}</Text>
              {msg.sender === 'User' && (
                <Image
                  source={{
                    uri: 'https://placehold.co/40x40/e0e0e0/000000?text=You',
                  }}
                  style={styles.userMessageAvatar}
                />
              )}
            </View>
          ))}
          {isSending && (
            <View style={[styles.messageBubble, styles.aiMessage]}>
              <View style={styles.aiAvatarPlaceholder}>
                <Text style={styles.aiAvatarText}>AI</Text>
              </View>
              <ActivityIndicator size="small" color="#368A8F" />
              <Text style={styles.messageText}> Typing...</Text>
            </View>
          )}
        </ScrollView>

        {/* Input Area */}
        <View style={styles.inputArea}>
          <TextInput
            style={styles.textInput}
            placeholder="Ask Counselor AI..."
            value={message}
            onChangeText={setMessage}
            onSubmitEditing={handleSendMessage}
            returnKeyType="send"
            editable={!isSending && !isLoadingUser}
          />
          <TouchableOpacity
            onPress={handleSendMessage}
            style={styles.sendButton}
            disabled={isSending || isLoadingUser}>
            {isSending ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <AntIcons name="search"></AntIcons>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  menuIcon: {
    padding: 5,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
  messagesContent: {
    paddingVertical: 20,
  },
  messageBubble: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    maxWidth: '85%',
    borderRadius: 15,
    padding: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  aiMessage: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    marginRight: 'auto',
  },
  userMessage: {
    backgroundColor: '#dcf8c6',
    alignSelf: 'flex-end',
    marginLeft: 'auto',
  },
  aiAvatarPlaceholder: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#368A8F',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  aiAvatarText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  userMessageAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#e0e0e0',
    marginLeft: 10,
  },
  messageText: {
    fontSize: 16,
    color: '#2c3e50',
    flexShrink: 1,
  },
  inputArea: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingVertical: 10,
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    height: 50,
    backgroundColor: '#f0f0f0',
    borderRadius: 25,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#2c3e50',
  },
  sendButton: {
    backgroundColor: '#368A8F',
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
});