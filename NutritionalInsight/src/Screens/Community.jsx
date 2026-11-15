import React, {useEffect, useState} from 'react';
import {ActivityIndicator, StyleSheet, View, Text} from 'react-native';
import {StreamChat} from 'stream-chat';
import {
  useChatContext,
  Channel as StreamChannel,
  MessageList,
  MessageInput,
} from 'stream-chat-react-native';
import loadAndDecodeToken from '../components/LoadAndDecodeToken'; // ✅ Make sure path is correct
import axios from 'axios';
import {BASE_URL} from '../API/API';

const Community = () => {
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState();
  const {client} = useChatContext();

  const chatClient = StreamChat.getInstance(
    'f4jd4sm2swcv',
    'q3muj4hurg56dsbhgg886pm3n4pg3etzg6hufccw8bh484znkf2396kngc7m84kv',
  );

  useEffect(() => {
    const connectAndSetup = async () => {
      try {
        const {decodedToken} = await loadAndDecodeToken();
        // console.log(data)
        // fetchProfileData(token);
        if (!decodedToken || !decodedToken._id || !decodedToken.name) {
          throw new Error('Invalid token or missing user data');
        }

        console.log('Decoded User:', decodedToken);

        // ✅ Connect user with real data from token
        await chatClient.connectUser(
          {
            id: decodedToken._id,
            name: decodedToken.name,
            role: 'admin', // only for dev use
          },
          chatClient.devToken(decodedToken._id),
        );

        // ✅ Now create or connect to the channel
        const communityChannel = chatClient.channel('messaging', 'community-group', {
          name: 'Nutritional Insight Community Group',
          members: [decodedToken._id], // 👈 ensures user is added
        });

        await communityChannel.watch();
        setChannel(communityChannel);
      } catch (err) {
        console.error('Error setting up community chat:', err);
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    connectAndSetup();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{color: 'red'}}>Error: {error}</Text>
      </View>
    );
  }

  if (!channel) {
    return (
      <View style={styles.center}>
        <Text>Failed to load channel.</Text>
      </View>
    );
  }

  return (
    <StreamChannel channel={channel} keyboardVerticalOffset={0}>
      <MessageList />
      <MessageInput />
    </StreamChannel>
  );
};

export default Community;

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
