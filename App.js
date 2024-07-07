import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions, Linking, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MapView, { Marker } from 'react-native-maps';

const cities = [
  { name: "London", latitude: 51.5074, longitude: -0.1278, utcOffset: 0 },
  { name: "Paris", latitude: 48.8566, longitude: 2.3522, utcOffset: 1 },
  { name: "Cairo", latitude: 30.0444, longitude: 31.2357, utcOffset: 2 },
  { name: "Moscow", latitude: 55.7558, longitude: 37.6176, utcOffset: 3 },
  { name: "Dubai", latitude: 25.2048, longitude: 55.2708, utcOffset: 4 },
  { name: "Karachi", latitude: 24.8607, longitude: 67.0011, utcOffset: 5 },
  { name: "Dhaka", latitude: 23.8103, longitude: 90.4125, utcOffset: 6 },
  { name: "Bangkok", latitude: 13.7563, longitude: 100.5018, utcOffset: 7 },
  { name: "Beijing", latitude: 39.9042, longitude: 116.4074, utcOffset: 8 },
  { name: "Tokyo", latitude: 35.6895, longitude: 139.6917, utcOffset: 9 },
  { name: "Sydney", latitude: -33.8688, longitude: 151.2093, utcOffset: 10 },
  { name: "Noumea", latitude: -22.2758, longitude: 166.4580, utcOffset: 11 },
  { name: "Auckland", latitude: -36.8485, longitude: 174.7633, utcOffset: 12 },
  { name: "Samoa", latitude: -13.7590, longitude: -172.1046, utcOffset: -11 },
  { name: "Hawaii", latitude: 21.3069, longitude: -157.8583, utcOffset: -10 },
  { name: "Anchorage", latitude: 61.2181, longitude: -149.9003, utcOffset: -9 },
  { name: "Los Angeles", latitude: 34.0522, longitude: -118.2437, utcOffset: -8 },
  { name: "Denver", latitude: 39.7392, longitude: -104.9903, utcOffset: -7 },
  { name: "Chicago", latitude: 41.8781, longitude: -87.6298, utcOffset: -6 },
  { name: "New York", latitude: 40.7128, longitude: -74.0060, utcOffset: -5 },
  { name: "Caracas", latitude: 10.4806, longitude: -66.9036, utcOffset: -4 },
  { name: "Santiago", latitude: -33.4489, longitude: -70.6693, utcOffset: -3 },
  { name: "Buenos Aires", latitude: -34.6037, longitude: -58.3816, utcOffset: -3 },
  { name: "Sao Paulo", latitude: -23.5505, longitude: -46.6333, utcOffset: -3 },
  { name: "Cape Verde", latitude: 14.9167, longitude: -23.5167, utcOffset: -1 },
];

const getNext420Times = () => {
  const now = new Date();
  const utcNow = now.getUTCHours() * 3600 + now.getUTCMinutes() * 60 + now.getUTCSeconds();

  let next420AMCity = null;
  let next420AMTime = Infinity;

  let next420PMCity = null;
  let next420PMTime = Infinity;

  cities.forEach(city => {
    const offset = city.utcOffset * 3600;
    let next420AM = (4 * 3600 + 20 * 60 - utcNow + offset) % (24 * 3600);
    if (next420AM < 0) next420AM += 24 * 3600;
    if (next420AM < next420PMTime && next420AM > 0) { // Swap the conditions here
      next420PMTime = next420AM;
      next420PMCity = city;
    }
  
    let next420PM = (16 * 3600 + 20 * 60 - utcNow + offset) % (24 * 3600);
    if (next420PM < 0) next420PM += 24 * 3600;
    if (next420PM < next420AMTime && next420PM > 0) { // Swap the conditions here
      next420AMTime = next420PM;
      next420AMCity = city;
    }
  });
  

  return {
    next420AMCity,
    next420AMTime,
    next420PMCity,
    next420PMTime
  };
};

const formatTime = (seconds) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hrs}h ${mins < 10 ? '0' : ''}${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
};

const App = () => {
  const [next420AMCity, setNext420AMCity] = useState(null);
  const [next420AMTime, setNext420AMTime] = useState(0);
  const [next420PMCity, setNext420PMCity] = useState(null);
  const [next420PMTime, setNext420PMTime] = useState(0);

  useEffect(() => {
    const updateTimes = () => {
      const { next420AMCity, next420AMTime, next420PMCity, next420PMTime } = getNext420Times();
      setNext420AMCity(next420AMCity);
      setNext420AMTime(next420AMTime);
      setNext420PMCity(next420PMCity);
      setNext420PMTime(next420PMTime);
    };

    updateTimes();
    const interval = setInterval(updateTimes, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <LinearGradient
      colors={['#ff0000', '#ffff00', '#00ff00']}
      start={{ x: 0, y: 0.5 }}
      end={{ x: 1, y: 0.5 }}
      style={styles.container}
    >
      <Text style={styles.topBanner}>Brought to You by Monkeys Brew Media LLC</Text>
      <Text style={styles.text}>It's Four Twenty Somewhere</Text>
      <MapView
        style={styles.map}
        provider={MapView.PROVIDER_GOOGLE}
        initialRegion={{
          latitude: 0,
          longitude: 0,
          latitudeDelta: 100,
          longitudeDelta: 100,
        }}
      >
        {next420AMCity && (
          <Marker
            coordinate={{ latitude: next420AMCity.latitude, longitude: next420AMCity.longitude }}
            title={`Next 04:20 PM in ${next420AMCity.name}`}
          />
        )}
        {next420PMCity && (
          <Marker
            coordinate={{ latitude: next420PMCity.latitude, longitude: next420PMCity.longitude }}
            title={`Next 04:20 AM in ${next420PMCity.name}`}
          />
        )}
      </MapView>
      <View style={styles.countdownContainer}>
        {next420AMCity && (
          <Text style={styles.countdownText}>
            {`Next 04:20 AM: ${next420AMCity.name}`}
          </Text>
        )}
        {next420PMCity && (
          <Text style={styles.countdownText}>
            {`Next 04:20 PM: ${next420PMCity.name}`}
          </Text>
        )}
        <Text style={styles.countdownText}>
          {`Countdown: ${formatTime(Math.min(next420AMTime, next420PMTime))}`}
        </Text>
      </View>
      <TouchableOpacity style={styles.bottomBanner} onPress={() => Linking.openURL('https://www.patreon.com/MonkeysBrewMediaLLC')}>
        <Text style={styles.bottomBannerText}>Check Out Our Patreon!</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBanner: {
    fontSize: 18,
    color: 'black',
    marginTop: 50,
    marginBottom: 10,
  },
  text: {
    fontSize: 24,
    color: 'black',
    marginBottom: 10,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height / 2,
  },
  countdownContainer: {
   
  },
  countdownContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  countdownText: {
    fontSize: 18,
    color: 'black',
    marginTop: 10,
  },
  bottomBanner: {
    position: 'absolute',
    bottom: 10,
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 5,
  },
  bottomBannerText: {
    fontSize: 18,
    color: 'white',
  },
});

export default App;
