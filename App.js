import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import * as Font from 'expo-font';
import { AppLoading } from 'expo';

import Header from './components/Header';
import StartGameScreen from './screens/StartGameScreen';
import GameScreen from './screens/GameScreen';
import GameOverScreen from './screens/GameOverScreen';

const fetchFonts = () => {
	// returns a promise
	return Font.loadAsync({
		'open-sans': require('./assets/fonts/OpenSans-Regular.ttf'),
		'open-sans-bold': require('./assets/fonts/OpenSans-Bold.ttf')
	});
};

export default function App() {
	const [ userNumber, setUserNumber ] = useState();
	const [ guessRounds, setGuessRounds ] = useState(0);
	const [ dataLoaded, setDataLoaded ] = useState(false);

	if (!dataLoaded) {
		// AppLoading prolongs the splash screen...
		return (
			<AppLoading
				startAsync={fetchFonts} // point at operation to start on 1st render
				onFinish={() => setDataLoaded(true)}
				onError={() => console.log(err)}
			/>
		);
	}

	const configureNewGameHandler = () => {
		setGuessRounds(0);
		setUserNumber(null);
	};

	const startGameHandler = (selectedNumber) => {
		setUserNumber(selectedNumber);
	};

	const gameOverHandler = (numOfRounds) => {
		setGuessRounds(numOfRounds);
	};

	let content = <StartGameScreen onStartGame={startGameHandler} />;

	if (userNumber && guessRounds <= 0) {
		content = <GameScreen userChoice={userNumber} onGameOver={gameOverHandler} />;
	} else if (guessRounds > 0) {
		content = (
			<GameOverScreen roundsNumber={guessRounds} userNumber={userNumber} onRestart={configureNewGameHandler} />
		);
	}

	return (
		// SafeAreaView must be at the most top component,
		// thus: App.
		<SafeAreaView style={styles.screen} >
				<Header title="Guess a number " />
				{content}
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	screen: {
		flex: 1
	}
});
