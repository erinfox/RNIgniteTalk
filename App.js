import React from 'react';
import {
  Animated,
  Easing,
  Vibration,
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';

const TEN_SECONDS = 1000 * 10;
const FIFTEEN_SECONDS = 1000 * 15;
const THIRTY_SECONDS = 1000 * 30;

const { width: screenWidth } = Dimensions.get('window');

const animatedValues = {
  '10': new Animated.Value(0),
  '15': new Animated.Value(0),
  '30': new Animated.Value(0),
};

export default class App extends React.Component {
  state = {
    time: undefined,
  };

  componentWillUpdate = (nextProps, nextState) => {
    clearInterval(this.interval);
    this.stopAnimation();

    if (nextState.time && nextState.time !== this.state.time) {
      this.pauseAnimations = false;
      this.interval = setInterval(() => Vibration.vibrate(), nextState.time);
      this.runAnimation(nextState.time);
    }
  };

  runAnimation = time => {
    if (this.pauseAnimations) return;

    this.animationId = `${time / 1000}`;

    const animatedValue = animatedValues[this.animationId];
    animatedValue.setValue(0);

    Animated.timing(animatedValue, {
      toValue: 1,
      duration: time,
      easing: Easing.linear,
    }).start(() => {
      this.runAnimation(time);
    });
  };

  stopAnimation = () => {
    this.pauseAnimations = true;
    const animatedValue = animatedValues[this.animationId];

    if (animatedValue) {
      animatedValue.stopAnimation();
      animatedValue.setValue(0);
    }
  };

  componentWillUnmount = () => {
    this.stopAnimation();
    this.stopInterval();
  };

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={this.setTime(TEN_SECONDS)}
        >
          <Animated.View
            style={[
              styles.buttonBackground,
              this.state.time === TEN_SECONDS && {
                width: animatedValues['10'].interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, screenWidth],
                }),
              },
            ]}
          />
          <Text style={styles.buttonText}>10</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={this.setTime(FIFTEEN_SECONDS)}
        >
          <Animated.View
            style={[
              styles.buttonBackground,
              this.state.time === FIFTEEN_SECONDS && {
                width: animatedValues['15'].interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, screenWidth],
                }),
              },
            ]}
          />
          <Text style={styles.buttonText}>15</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={this.setTime(THIRTY_SECONDS)}
        >
          <Animated.View
            style={[
              styles.buttonBackground,
              this.state.time === THIRTY_SECONDS && {
                width: animatedValues['30'].interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, screenWidth],
                }),
              },
            ]}
          />
          <Text style={styles.buttonText}>30</Text>
        </TouchableOpacity>
      </View>
    );
  }
  setTime = time => () =>
    this.setState(prevState => ({
      time: prevState.time === time ? undefined : time,
    }));
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'stretch',
    justifyContent: 'space-between',
  },
  buttonBackground: {
    backgroundColor: 'pink',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    // width: screenWidth,
  },
  buttonText: {
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
  buttonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
