/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, ScrollView, TouchableOpacity} from 'react-native';
import SourateBox from '../../components/SourateBox';
import { Chapter } from '../../models/interfaces';

interface SouratesSelectorProps {
  handleLabelPress: (chapter: {no: number | undefined}) => Promise<void>;
  chapters: Chapter[];
}

const SouratesSelector: React.FC<SouratesSelectorProps> = ({
  handleLabelPress,
  chapters,
}) => (
  <ScrollView>
    <View
      style={{
        padding: 20,
        flexDirection: 'row-reverse',
        flexWrap: 'wrap',
      }}>
      {chapters?.map((chapter, index) => (
        <TouchableOpacity
          key={index}
          style={{
            borderRadius: 20,
            padding: 5,
            marginVertical: 5,
          }}
          onPress={() => handleLabelPress(chapter)}>
          <SourateBox chapterNo={chapter.no} count_ayat={chapter.count_ayat}/>
        </TouchableOpacity>
      ))}
    </View>
  </ScrollView>
);

export default SouratesSelector;
