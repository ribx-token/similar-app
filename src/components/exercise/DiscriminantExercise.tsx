import React, {useCallback, useEffect, useState, useContext} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {Button, Text, Card, Provider, DefaultTheme} from 'react-native-paper';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faVolumeUp } from '@fortawesome/free-solid-svg-icons';
import { syncStorage } from '../../storage/syncStorage';

import {radioButtonText} from './radioButtonText';
import CustomRadioButton from './CustomRadioButton';

import { Alternative, Statement } from '../../models/interfaces';
import { Logger } from 'mayo-logger';
import { AnswerStat } from '../../models/AnswerStat';
import { updateAnswerStats } from './updateStats';

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: 'orange',
  },
};

const DiscriminantExercise = ({exercises}) => {
  const {t} = useTranslation();
  const [statement, setStatement] = useState<Statement>(null);
  const [alternatives, setAternatives] = useState<Alternative[]>([]);
  const [selectedValue, setSelectedValue] = useState<number>();
  // const {kalima, currentChapterName } = route?.params;
  const [isValid, setIsValid] = useState<string>('neutral');
  const [otherSourate, setOtherSourate] = useState<string>('');
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [exerciseType, setExerciseType] = useState('');
  const [answerStats, setAnswerStats] = useState<AnswerStat[]>([]);

  const navigation = useNavigation();

  useEffect(() => {
    if(answerStats?.length === 0) return; 
    syncStorage(answerStats);
  }, [answerStats]);

  const handleCheck = async (index: number, statement: Statement) => {
    Logger.info('Starting handleCheck...');
    setSelectedValue(index);
    console.log(statement);
    try {
      const alternative = alternatives[index]?.verse;
      const validationOutcome = statement.verse.chapter_no === alternative.chapter_no && statement.verse.verse_no === alternative.verse_no ? 'right':'wrong'; 
      setIsValid(validationOutcome);
      let id: string;
      if (validationOutcome === 'right') {
        id = `${statement.verse.chapter_no}-${statement.verse.verse_no}`;
        updateAnswerStats({ id, valid: true}, setAnswerStats);
      } else {
        id = `${statement.verse.chapter_no}-${statement.verse.verse_no}`;
        updateAnswerStats({ id, valid: false}, setAnswerStats);
        id = `${alternative.chapter_no}-${alternative.verse_no}`;
        updateAnswerStats({ id, valid: false}, setAnswerStats);
      }
      Logger.info(`Validation outcome: ${validationOutcome}`);
    } catch (error) {
      Logger.error('Error during handleCheck', error);
    }
  };

  const updateExerciseContent = useCallback(() => {
    Logger.info('Updating exercise content...');
    try {
      if (exercises && exercises[exerciseIndex]) {
        const data = exercises[exerciseIndex];
        setStatement(data.statement);
        setAternatives(data.alternatives);
        setSelectedValue(undefined);
        setIsValid('neutral');
        setExerciseType(data.exercise_type);
        // navigation.setOptions({
        //   headerBackTitle: currentChapterName,
        // });
      } else {
        Logger.warn('No more exercises available!');
      }
    } catch (error) {
      Logger.error('Error updating exercise content', error);
    }
  }, [exerciseIndex, exercises, navigation]);

  useEffect(() => {
    updateExerciseContent();
  }, [updateExerciseContent]);

  return (
    <Provider theme={theme}>
      <ScrollView style={{flex: 1}}>
        <View style={styles.container}>
          <Card style={styles.card}>
            <Card.Content>
              {exerciseType !== 'FindSourate' && (
                <View style={styles.headerLine}>
                  <Text style={styles.rightText}>
                    {statement?.verse.sourate || ''}
                  </Text>
                  <Text style={styles.leftText}>
                    {statement
                      ? `${statement?.verse.chapter_no}:${statement?.verse.verse_no}`
                      : ''}
                  </Text>
                </View>
              )}

              <Text style={styles.rightAlignedText}>
                {statement
                  ? `${statement.verse?.ungrouped_text?.pre} ${
                      exerciseType === 'FindDiscriminant'
                        ? '...'
                        : statement.verse?.ungrouped_text?.discriminant
                    } ${statement.verse?.ungrouped_text?.post}`
                  : ''}
              </Text>
            </Card.Content>
          </Card>

          <View style={styles.radioContainer}>
            {alternatives.map((option, index) => (
              <CustomRadioButton
                key={index}
                text={radioButtonText(
                  option,
                  index,
                  exerciseType,
                  isValid,
                  selectedValue,
                )}
                selected={selectedValue === index}
                onPress={() => handleCheck(index, statement)}
                serviceFailed={isValid === 'wrong' && selectedValue === index}
                serviceValid={isValid === 'right' && selectedValue === index}
              />
            ))}
          </View>

          <Card style={styles.newExerciseButtonCard}>
            <Button
              mode="contained"
              onPress={() => {
                setExerciseIndex(prevIndex => prevIndex + 1);
                updateExerciseContent();
              }}
              disabled={isValid !== 'right'}>
              {t('continue')}
              {/* <FontAwesomeIcon icon={faVolumeUp } size={60}/> */}
            </Button>
          </Card>
        </View>
      </ScrollView>
    </Provider>
  );
};

const styles = StyleSheet.create({
  newExerciseButtonCard: {
    width: '95%',
    alignSelf: 'center',
    marginTop: 20,
  },
  radioContainer: {
    margin: 20,
    alignItems: 'flex-end',
    alignSelf: 'stretch',
  },
  headerLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  leftText: {
    textAlign: 'left',
    writingDirection: 'ltr',
    fontWeight: 'bold',
  },
  rightText: {
    fontFamily: 'ScheherazadeNew-Regular',
    fontSize: 20,
    textAlign: 'right',
    writingDirection: 'rtl',
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    alignItems: 'center', // Align items to the center
    justifyContent: 'flex-start',
    padding: 10, // Add some padding to prevent the card from touching the screen edges
  },
  rightAlignedText: {
    textAlign: 'right',
    writingDirection: 'rtl',
    fontSize: 20,
    fontFamily: 'ScheherazadeNew-Regular',
  },
  card: {
    width: '95%', // Set the card width to almost full screen width
    alignSelf: 'center', // Center the card
  },
});

export default DiscriminantExercise;
