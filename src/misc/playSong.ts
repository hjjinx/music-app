import TrackPlayer from 'react-native-track-player';
import {getBestFormat} from './ytdl-wrapper';
import {AsyncStorage} from 'react-native';

export default async (href, updateRecentlyPlayed) => {
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

    var {bestFormat, info} = await getBestFormat(href);
    console.log(info);

    // Add to recentlyPlayed songs
    const recentlyPlayed = JSON.parse(
      await AsyncStorage.getItem('recentlyPlayed'),
    );
    // If this song in already one of the last 10 played songs,
    for (let i = 0; i < recentlyPlayed.length; i++) {
      let currSong = recentlyPlayed[i];
      if (currSong.href === href) recentlyPlayed.splice(i, 1);
    }
    recentlyPlayed.unshift({
      href: href,
      title: info.title,
      artist: info.author.name,
      image: info.player_response.videoDetails.thumbnail.thumbnails[2].url,
    });
    if (recentlyPlayed.length > 10) recentlyPlayed.pop();
    updateRecentlyPlayed(recentlyPlayed);
    await AsyncStorage.setItem(
      'recentlyPlayed',
      JSON.stringify(recentlyPlayed),
    );

    // Play the song
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
