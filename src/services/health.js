import { post } from '../utils/request';

export function getWeather(payload) {
  return post('getWeather', payload);
}
