import TrackPlayer from 'react-native-track-player';
import {getBestFormat} from './ytdl-wrapper';

export default async href => {
  try {
    await TrackPlayer.setupPlayer();
    TrackPlayer.updateOptions({
      ratingType: TrackPlayer.RATING_5_STARS,
      capabilities: [
        TrackPlayer.CAPABILITY_PLAY,
        TrackPlayer.CAPABILITY_PAUSE,
        TrackPlayer.CAPABILITY_STOP,
        TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
      ],

      // An array of capabilities that will show up when the notification is in the compact form on Android
      compactCapabilities: [
        TrackPlayer.CAPABILITY_PLAY,
        TrackPlayer.CAPABILITY_PAUSE,
        TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
      ],
    });

    const {bestFormat, info} = await getBestFormat(href);
    console.log(info);

    await TrackPlayer.add({
      id: '1',
      url: bestFormat.url,
      title: info.title,
      artist: info.author.name,
      artwork: info.player_response.videoDetails.thumbnail.thumbnails[2].url,
      duration: parseInt(info.length_seconds),
    });

    await TrackPlayer.play();
  } catch (err) {
    console.log('Erorr in playing sound...');
    console.log(err);
  }
};
