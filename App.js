import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ImageBackground, StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import * as Location from "expo-location";

export default function App() {
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  const fetchWeather = async () => {
    if (latitude && longitude) {
      const API_KEY = "a7cda3dcee396fe4115415d1d79e996a";
      const URL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;

      try {
        const response = await fetch(URL);
        const data = await response.json();

        if (response.ok) {
          setWeather(data);
          setError(null); // Reset any previous errors
        } else {
          setError(data.message || "Failed to fetch data.");
        }
      } catch (err) {
        console.error("Error fetching weather data:", err);
        setError("Failed to fetch data. Please try again later.");
      }
    }
  };

  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === "granted") {
      let currentPosition = await Location.getCurrentPositionAsync({});
      setLatitude(currentPosition.coords.latitude);
      setLongitude(currentPosition.coords.longitude);
    } else {
      setError("Permission to access location was denied");
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  useEffect(() => {
    if (latitude && longitude) {
      fetchWeather(); 
    }
  }, [latitude, longitude]);

  // Determine which icon to show based on temperature
  const getWeatherIcon = (temp) => {
    if (temp >= 30) {
      return <Icon name="sun-o" size={100} color="#ffcc00" />;
    } else if (temp >= 20) {
      return <Icon name="cloud" size={100} color="#a0a0a0" />;
    } else if (temp >= 0) {
      return <Icon name="snowflake-o" size={100} color="#00f" />;
    } else {
      return <Icon name="cloud" size={100} color="#b0b0b0" />;
    }
  };

  return (
    <>
      <ImageBackground
        source={{
          uri: "https://t4.ftcdn.net/jpg/05/52/47/31/360_F_552473151_gaBefjYdGK1SNYkQtIfo3HYiXTtj900W.jpg",
        }}
      >
        <View style={styles.main}>
          <StatusBar style="auto" />
          <Text style={styles.title}>
            <Text style={styles.appName}>IR Weather</Text> Service
          </Text>
          <View style={styles.data}>
            <View style={styles.place}>
              <Icon name="map-marker" size={50} color="#900" />
              <Text style={styles.city}>
                {weather ? weather.name : "Fetching location..."}
              </Text>
            </View>
            {/* Display the latitude and longitude if available */}
            {weather ? (
              <Text style={styles.temperature}>
                {weather.main.temp.toFixed(2)}°C
              </Text>
            ) : (
              <Text style={styles.temperature}>Fetching weather...</Text>
            )}
          </View>
          <View style={styles.desc}>
            <View style={styles.icon}>
              {/* Conditionally render icon based on temperature */}
              {weather ? (
                getWeatherIcon(weather.main.temp)
              ) : (
                <Icon name="cloud" size={100} color="#b0b0b0" />
              )}
            </View>
            <View style={styles.info}>
              <Text style={styles.sky}>
                {weather
                  ? `Weather: ${weather.weather[0].description}`
                  : "Loading..."}
              </Text>
              <Text style={styles.humidity}>
                Humidity: {weather ? `${weather.main.humidity}%` : "Loading..."}
              </Text>
              <Text style={styles.wind}>
                Wind: {weather ? `${weather.wind.speed} m/s` : "Loading..."}
              </Text>
            </View>
          </View>
        </View>
      </ImageBackground>
      <View style={styles.creditBox}>
        <Text style={styles.credit}>
          Developed By <Text style={styles.creditName}>Istiak Rahman</Text>
        </Text>
      </View>
    </>
  );
}

let styles = StyleSheet.create({
  main: {
    height: "100%",
    position: "relative",
  },
  appName: {
    textDecorationLine: "underline",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 30,
    color: "#fff",
  },
  data: {
    marginLeft: 5,
    marginRight: 5,
  },
  place: {
    display: "flex",
    flexDirection: "row",
    marginTop: 10,
    alignItems: "center",
  },
  city: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 8,
  },
  temperature: {
    fontSize: 60,
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 50,
    marginTop: 10,
  },
  desc: {
    alignItems: "center",
    marginTop: 16,
  },
  info: {
    marginTop: 25,
    gap: 10,
    backgroundColor: "#cecdff",
    padding: 10,
    width: 300,
    borderRadius: 20,
  },
  sky: {
    fontSize: 28,
  },
  humidity: {
    fontSize: 28,
  },
  wind: {
    fontSize: 28,
  },
  creditBox: {
    width: "100%",
    backgroundColor: "black",
    position: "absolute",
    bottom: 0,
    paddingVertical: 10,
    alignItems: "center",
  },
  credit: {
    fontSize: 20,
    textAlign: "center",
    color: "#fff",
    width: "100%",
  },
  creditName: {
    fontWeight: "bold",
    fontSize: 25,
  },
});
