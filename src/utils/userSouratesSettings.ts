import AsyncStorage from '@react-native-async-storage/async-storage';
import { Logger } from 'mayo-logger';
import { currentStorage } from '../storage/currentStorage';
import { getIndicesByName } from '../modals/SourateConfiguration/getIndicesByName';

export const userSouratesSettings = async () => {
    const res = await currentStorage();
    return res?.ranges || [];
};

export const indexFromStorage = async () => {
    try {
        Logger.info('Fetching index from storage', { tag: 'Lesson' });
        const storedCurrentIndex = await AsyncStorage.getItem('currentIndex');
        let storedCurrentIndexInt = parseInt(storedCurrentIndex);
        // Verify that it is still in user range preferences
        const settings = await userSouratesSettings();
        const indices = getIndicesByName(settings);
        if(!indices.includes(storedCurrentIndexInt)) {
            storedCurrentIndexInt = indices[0];
        }

        return storedCurrentIndexInt;
    } catch (error) {
        Logger.error('Error retrieving index from AsyncStorage', error, { tag: 'Lesson' });
    }
};