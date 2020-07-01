import TrackPlayer from 'react-native-track-player';

module.exports = async function() {
  TrackPlayer.addEventListener('remote-play', () => {
    TrackPlayer.play();
  });

  TrackPlayer.addEventListener('remote-seek', d => {
    TrackPlayer.seekTo(d.position);
  });

  TrackPlayer.addEventListener('remote-previous', async d => {
    try {
      await TrackPlayer.skipToPrevious();
    } catch (err) {
      await TrackPlayer.seekTo(0);
    }
  });

  TrackPlayer.addEventListener('remote-pause', () => {
    TrackPlayer.pause();
  });

  TrackPlayer.addEventListener('remote-next', () => {
    TrackPlayer.skipToNext();
  });

  TrackPlayer.addEventListener('remote-stop', () => {
    TrackPlayer.destroy();
  });
};
