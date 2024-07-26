// app/DeviceToken.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

const DeviceToken = () => {
  const [deviceToken, setDeviceToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      if (token) {
        setDeviceToken(token);
      }
    });
  }, []);

  async function registerForPushNotificationsAsync() {
    let token: string | undefined;
    try {
      if (Constants.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        console.log('Existing notification status:', existingStatus);
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== 'granted') {
          alert('Failed to get push token for push notification!');
          setError('Failed to get push token for push notification!');
          return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log('Expo Push Token:', token);
      } else {
        alert('Must use physical device for Push Notifications');
        setError('Must use physical device for Push Notifications');
      }

      if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }

      return token;
    } catch (e) {
      console.error('Error during push notification setup:', e);
      setError('Error during push notification setup');
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Device Token:</Text>
      <Text style={styles.token}>{deviceToken ? deviceToken : 'Fetching token...'}</Text>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  token: {
    marginTop: 10,
    paddingHorizontal: 20,
    textAlign: 'center',
  },
  error: {
    marginTop: 10,
    color: 'red',
  },
});

export default DeviceToken;
