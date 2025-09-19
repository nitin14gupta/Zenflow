import { Asset } from 'expo-asset';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'assets_preloaded_v1';

// Enumerate bundled assets explicitly so Metro can include them
const imageModules: number[] = [
    require('../../assets/images/icon.png'),
    require('../../assets/images/android-icon-foreground.png'),
    require('../../assets/images/android-icon-background.png'),
    require('../../assets/images/android-icon-monochrome.png'),
    require('../../assets/images/favicon.png'),
    require('../../assets/images/splash-icon.png'),
    require('../../assets/images/habitLib1.png'),
    require('../../assets/images/habitLib2.png'),
    require('../../assets/images/habitLib3.png'),
    require('../../assets/images/habitLib4.png'),
    require('../../assets/images/habitLib5.png'),
    require('../../assets/images/habitLib6.png'),
];

const soundModules: number[] = [
    require('../../assets/notifications/notification_sound.wav'),
    require('../../assets/notifications/notification_sound_other.wav'),
];

export async function preloadBundledAssetsIfNeeded(): Promise<boolean> {
    try {
        const flag = await AsyncStorage.getItem(STORAGE_KEY);
        if (flag === '1') return true;
        await Asset.loadAsync([...imageModules, ...soundModules]);
        await AsyncStorage.setItem(STORAGE_KEY, '1');
        return true;
    } catch (e) {
        console.log('Asset preload error', e);
        return false;
    }
}


