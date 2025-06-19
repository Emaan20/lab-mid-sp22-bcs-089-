import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  PanResponder,
  Animated,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  Vibration,
  StatusBar,
} from 'react-native';

const dummyChats = [
//   { id: '1', sender: 'Tazeen', message: 'Hey there! How are you doing?', timestamp: '10:30 AM', isOwn: false },
//   { id: '2', sender: 'You', message: 'I\'m good, thanks! How about you?', timestamp: '10:32 AM', isOwn: true },
//   { id: '3', sender: 'Basit', message: 'Hey guys! What\'s the plan for today?', timestamp: '10:35 AM', isOwn: false },
//   { id: '4', sender: 'You', message: 'Let\'s meet at the usual place around 2 PM', timestamp: '10:37 AM', isOwn: true },
//   { id: '5', sender: 'Tazeen', message: 'Sounds perfect! See you there 👍', timestamp: '10:38 AM', isOwn: false },
];

export default function ChatScreen() {
  const [messages, setMessages] = useState(dummyChats);
  const [input, setInput] = useState('');
  const pan = useRef(new Animated.Value(0)).current;
  const dragThreshold = 100;
  const [showPullUpUI, setShowPullUpUI] = useState(false);
  const [showConnectButton, setShowConnectButton] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recordTime, setRecordTime] = useState(0);
  const intervalRef = useRef(null);
  const connectTimeoutRef = useRef(null);
  
  // Loader animation
  const loaderAnim1 = useRef(new Animated.Value(0.3)).current;
  const loaderAnim2 = useRef(new Animated.Value(0.3)).current;
  const loaderAnim3 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    if (showPullUpUI && !recording && !showConnectButton) {
      // Start loader animation
      const animateLoader = () => {
        Animated.sequence([
          Animated.timing(loaderAnim1, { toValue: 1, duration: 400, useNativeDriver: false }),
          Animated.timing(loaderAnim1, { toValue: 0.3, duration: 400, useNativeDriver: false }),
        ]).start();
        
        setTimeout(() => {
          Animated.sequence([
            Animated.timing(loaderAnim2, { toValue: 1, duration: 400, useNativeDriver: false }),
            Animated.timing(loaderAnim2, { toValue: 0.3, duration: 400, useNativeDriver: false }),
          ]).start();
        }, 200);
        
        setTimeout(() => {
          Animated.sequence([
            Animated.timing(loaderAnim3, { toValue: 1, duration: 400, useNativeDriver: false }),
            Animated.timing(loaderAnim3, { toValue: 0.3, duration: 400, useNativeDriver: false }),
          ]).start();
        }, 400);
      };
      
      animateLoader();
      const loaderInterval = setInterval(animateLoader, 1200);
      
      // Show connect button after 1 second
      connectTimeoutRef.current = setTimeout(() => {
        setShowConnectButton(true);
        clearInterval(loaderInterval);
      }, 1000);
      
      return () => {
        clearInterval(loaderInterval);
        clearTimeout(connectTimeoutRef.current);
      };
    }
  }, [showPullUpUI, recording, showConnectButton]);

  useEffect(() => {
    if (recording) {
      Vibration.vibrate(50);
      intervalRef.current = setInterval(() => {
        setRecordTime(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
      setRecordTime(0);
    }
    return () => clearInterval(intervalRef.current);
  }, [recording]);

  const formatTime = secs => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2,'0')}`;
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => gesture.dy < -10,
      onPanResponderMove: (_, gesture) => {
        if (!recording && gesture.dy < 0) {
          pan.setValue(gesture.dy);
          if (gesture.dy < -20) setShowPullUpUI(true);
        }
      },
      onPanResponderRelease: (_, gesture) => {
        if (!recording) {
          if (gesture.dy < -dragThreshold) {
            Animated.timing(pan, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }).start(() => {
              // Clear any existing timeouts
              clearTimeout(connectTimeoutRef.current);
              
              // Always show connect button first, then proceed to recording
              setShowConnectButton(true);
              setTimeout(() => {
                setShowPullUpUI(false);
                setShowConnectButton(false);
                setRecording(true);
              }, 1000);
            });
          } else {
            Animated.spring(pan, {
              toValue: 0,
              useNativeDriver: true,
            }).start(() => {
              setShowPullUpUI(false);
              setShowConnectButton(false);
              clearTimeout(connectTimeoutRef.current);
            });
          }
        }
      },
    })
  ).current;

  const handleConnect = () => {
    setShowConnectButton(false);
    setShowPullUpUI(false);
    setRecording(true);
  };

  const stopRecording = () => {
    setRecording(false);
    console.log('Recorded:', recordTime, 'seconds');
  };

  const handleSend = () => {
    if (input.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        sender: 'You',
        message: input,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwn: true,
      };
      setMessages(prev => [...prev, newMessage]);
      setInput('');
    }
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getAvatarColor = (name) => {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b', '#6c5ce7'];
    const index = name.length % colors.length;
    return colors[index];
  };

  const renderItem = ({ item }) => (
  <View style={[styles.messageContainer, item.isOwn ? styles.ownMessage : styles.otherMessage]}>
    {!item.isOwn && (
      <View style={[styles.avatar, { backgroundColor: getAvatarColor(item.sender) }]}>
        <Text style={styles.avatarText}>{getInitials(item.sender)}</Text>
      </View>
    )}
    <View style={[styles.messageBubble, item.isOwn ? styles.ownBubble : styles.otherBubble]}>
      {!item.isOwn && <Text style={styles.senderName}>{item.sender}</Text>}
      <Text style={[styles.messageText, item.isOwn ? styles.ownMessageText : styles.otherMessageText]}>
        {item.message}
      </Text>
      <Text style={[styles.timestamp, item.isOwn ? styles.ownTimestamp : styles.otherTimestamp]}>
        {item.timestamp}
      </Text>
    </View>
  </View>
);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#075E54" barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <View style={styles.groupAvatar}>
            <Text style={styles.groupAvatarText}>GC</Text>
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Group Chat</Text>
            <Text style={styles.headerSubtitle}>Tazeen, Basit, You</Text>
          </View>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerAction}>
            <Text style={styles.actionText}>📹</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerAction}>
            <Text style={styles.actionText}>📞</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerAction}>
            <Text style={styles.actionText}>⋮</Text>
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.chatContainer}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <Animated.View
          style={[styles.dragView, { transform: [{ translateY: pan }] }]}
          {...panResponder.panHandlers}
        >
          <FlatList
            data={messages}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.messagesList}
            showsVerticalScrollIndicator={false}
          />
        </Animated.View>

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TouchableOpacity style={styles.attachButton}>
              <Text style={styles.attachIcon}>📎</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.textInput}
              placeholder="Type a message"
              placeholderTextColor="#999"
              value={input}
              onChangeText={setInput}
              multiline
            />
            <TouchableOpacity style={styles.emojiButton}>
              <Text style={styles.emojiText}>😊</Text>
            </TouchableOpacity>
          </View>
          {input.trim() ? (
            <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
              <Text style={styles.sendIcon}>➤</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.voiceButton}>
              <Text style={styles.voiceIcon}>🎤</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Loader UI - positioned just above bottom bar */}
        {showPullUpUI && !recording && !showConnectButton && (
          <View style={styles.promptOverlay}>
            <View style={styles.loaderContainer}>
              <View style={styles.loader}>
                <Animated.View style={[styles.loaderDot, { opacity: loaderAnim1 }]} />
                <Animated.View style={[styles.loaderDot, { opacity: loaderAnim2 }]} />
                <Animated.View style={[styles.loaderDot, { opacity: loaderAnim3 }]} />
              </View>
              <Text style={styles.promptText}>Getting ready to record...</Text>
            </View>
          </View>
        )}

        {/* Connect Button UI - positioned just above bottom bar */}
        {showConnectButton && !recording && (
          <View style={styles.promptOverlay}>
            <View style={styles.connectContainer}>
              <Text style={styles.promptText}>Ready to connect!</Text>
              <TouchableOpacity style={styles.connectButton} onPress={handleConnect}>
                <Text style={styles.connectButtonText}>Connect</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Recording UI - positioned just above bottom bar */}
        {recording && (
          <View style={styles.recordingOverlay}>
            <View style={styles.recordingActions}>
              <TouchableOpacity style={styles.iconButton}>
                <Text style={styles.actionIcon}>🔇</Text>
              </TouchableOpacity>

              <View style={styles.avatarContainer}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>YOU</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.iconButton}>
                <Text style={styles.actionIcon}>👋</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={stopRecording} style={styles.iconButton}>
                <Text style={[styles.actionIcon, { color: '#D32F2F' }]}>✕</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.recordingText}>Recording voice message... {formatTime(recordTime)}</Text>
          </View>
        )}
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECE5DD',
  },
  header: {
    backgroundColor: '#075E54',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: Platform.OS === 'ios' ? 50 : 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  backButton: {
    marginRight: 16,
  },
  backArrow: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#128C7E',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  groupAvatarText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#B8E0D2',
    fontSize: 13,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerAction: {
    marginLeft: 20,
  },
  actionText: {
    color: 'white',
    fontSize: 18,
  },
  chatContainer: {
    flex: 1,
  },
  dragView: {
    flex: 1,
  },
 messagesList: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    paddingBottom: 100,
    flexGrow: 1, // Add this to ensure proper scrolling
  },
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 4, // Increased from 2 for better spacing
    alignItems: 'flex-end',
    maxWidth: '100%', // Ensure container doesn't overflow
  },
  ownMessage: {
    justifyContent: 'flex-end',
    alignSelf: 'flex-end', // Add this to align to right
    flexDirection: 'row-reverse', // This will put avatar on right side if needed
  },
  otherMessage: {
    justifyContent: 'flex-start',
    alignSelf: 'flex-start', // Add this to align to left
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    marginBottom: 4, // Add margin to align with bubble bottom
  },
  avatarText: {
    color: 'white',
    fontSize: 11, // Slightly smaller
    fontWeight: 'bold',
  },
  messageBubble: {
    maxWidth: '75%', // Reduced from 80% for better appearance
    minWidth: 60, // Add minimum width
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12, // Increased for more modern look
    marginVertical: 1,
    // Add shadow for better depth
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  ownBubble: {
    backgroundColor: '#DCF8C6',
    borderBottomRightRadius: 4, // Tail effect
    marginLeft: 'auto', // Push to right
  },
  otherBubble: {
    backgroundColor: 'white',
    borderBottomLeftRadius: 4, // Tail effect
    marginRight: 'auto', // Push to left
  },
  senderName: {
    fontSize: 12,
    fontWeight: '600', // Changed from 'bold'
    color: '#075E54',
    marginBottom: 2,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
    color: '#333',
  },
  ownMessageText: {
    color: '#333',
  },
  otherMessageText: {
    color: '#333',
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  ownTimestamp: {
    color: '#5A5A5A',
  },
  otherTimestamp: {
    color: '#999',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F0F0F0',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: 'white',
    borderRadius: 25,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    minHeight: 40,
  },
  attachButton: {
    marginRight: 8,
  },
  attachIcon: {
    fontSize: 20,
    color: '#707070',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    maxHeight: 100,
    paddingVertical: 0,
  },
  emojiButton: {
    marginLeft: 8,
  },
  emojiText: {
    fontSize: 18,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#075E54',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendIcon: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  voiceButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#075E54',
    alignItems: 'center',
    justifyContent: 'center',
  },
  voiceIcon: {
    fontSize: 16,
  },
  promptOverlay: {
    position: 'absolute',
    bottom: 70,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 25,
    padding: 16,
    alignItems: 'center',
  },
  loaderContainer: {
    alignItems: 'center',
  },
  loader: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  loaderDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
    marginHorizontal: 2,
    opacity: 0.3,
  },
  promptText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  connectContainer: {
    alignItems: 'center',
  },
  connectButton: {
    backgroundColor: '#075E54',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    marginTop: 12,
  },
  connectButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  recordingOverlay: {
    position: 'absolute',
    bottom: 70,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  recordingActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIcon: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#075E54',
    marginHorizontal: 10,
  },
  recordingText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
});