import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Text, Button, Alert } from 'react-native';

import NumberContainer from '../components/NumberContainer';
import Card from '../components/Card';

// outside because it shouldn't be recreated in every rerendering...
const findNumber = (min, max, usersChoice) => {
	let foundNumber = usersChoice;

	min = Math.ceil(min);
	max = Math.floor(max);

	if (foundNumber === usersChoice) {
		return foundNumber;
	} else {
		// use the divide and conquer algo:
		// find the middle number
		mid = Math.floor((min + max) / 2);

		// compare middle number with chosen num
		if (foundNumber === usersChoice) {
			return foundNumber;
		}
		// if number at mid is greate than x,
		// search in the left half of mid
		if (mid > usersChoice) {
			findNumber(min, mid-1);
		} else {
			// else search in the right half...
			return findNumber(mid+1, max);
		}
		return foundNumber;
	}
};
const GameScreen = (props) => {

	

	const [ currentGuess, setCurrentGuess ] = useState(findNumber(1, 100, props.userChoice));
	const [ rounds, settRounds ] = useState(0);

	const currentLow = useRef(1);
	const currentHigh = useRef(100);

	const { userChoice, onGameOver } = props;

	useEffect(
		() => {
			if (currentGuess === props.userChoice) {
				props.onGameOver(rounds);
			}
		},
		[ currentGuess, userChoice, onGameOver ]
	);

	

	const nextGuessHandler = (direction) => {
		const shouldBeLower = direction === 'lower' && currentGuess < props.userChoice;
		const shouldBeGreater = direction === 'greater' && currentGuess > props.userChoice;
		if (shouldBeLower || shouldBeGreater) {
			Alert.alert('Wrong hint!', 'Please try again.', [
				{
					text: 'Sorry',
					style: 'cancel'
				}
			]);
		}
		if (direction === 'lower') {
			currentHigh.current = currentGuess;
		} else {
			currentLow.current = currentGuess;
		}
		const nextNumber = findNumber(currentLow.current, currentHigh.current, currentGuess);
		setCurrentGuess(nextNumber);
		settRounds((curRounds) => curRounds + 1);
	};
	return (
		<View style={styles.screen}>
			<Text>Opponent's Guess: </Text>
			<NumberContainer>{currentGuess}</NumberContainer>
			<Card style={styles.buttonContainer}>
				<View style={styles.button}>
					<Button title="LOWER" onPress={nextGuessHandler.bind(this, 'lower')} />
				</View>
				<View style={styles.button}>
					<Button title="GREATER" onPress={nextGuessHandler.bind(this, 'greater')} />
				</View>
			</Card>
		</View>
	);
};

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		padding: 10,
		alignItems: 'center'
	},
	buttonContainer: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		marginTop: 20,
		width: 300,
		maxWidth: '80%'
	},
	button: {
		width: '40%',
		margin: 10
	}
});

export default GameScreen;
