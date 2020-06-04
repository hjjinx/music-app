import ytdl from 'ytdl-core';

export const getBestFormat = async href => {
  let info;
  try {
    info = await ytdl.getInfo(href);
  } catch (err) {
    console.log('YTDL issue..');
    console.log(err);
  }
  let bestFormat;
  if (!info.formats) return;
  let maxBitrate = 0;
  for (let format of info.formats)
    if (format.audioBitrate && format.audioBitrate > maxBitrate) {
      maxBitrate = format.audioBitrate;
      bestFormat = format;
    }

  return {bestFormat, info};
};
