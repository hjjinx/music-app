// Made this for Discord bot in order to scrape YouTube search results

export default async function(query) {
  const cheerio = require('react-native-cheerio');
  const link = `https://www.youtube.com/results?search_query=${query}&sp=EgIQAQ%253D%253D`;
  const res = await fetch(link);
  let html = await res.text();
  const $ = cheerio.load(html);

  var urlArr = [];

  const ch1 = await $(`h3.yt-lockup-title`);

  // If YouTube returns results in the old way..
  ch1.each((i, elem) => {
    const child = elem.children[0];
    const artist = elem.next.children[0].children[0].data;
    const img =
      i > 5
        ? $(
            elem.parent.prev.children[0].children[0].children[0].children[1],
          ).data('thumb')
        : elem.parent.prev.children[0].children[0].children[0].children[1]
            .attribs.src;
    urlArr.push({
      href: `https://youtube.com${child.attribs.href}`,
      title: child.attribs.title,
      img,
      artist,
    });
  });

  // If YouTube does NOT return results in the old way..
  if (urlArr.length === 0) {
    html = $.html();
    const startIndex = html.indexOf(`window["ytInitialData"]`) + 26;
    const endIndex = html.indexOf(`window["ytInitialPlayerResponse"]`) - 6;
    const length = endIndex - startIndex;
    const content = JSON.parse(html.substr(startIndex, length));
    const results =
      content.contents.twoColumnSearchResultsRenderer.primaryContents
        .sectionListRenderer.contents[0].itemSectionRenderer.contents;

    const firstIndexIsNotAResult =
      results[0].showingResultsForRenderer || results[0].searchPyvRenderer;
    for (
      let i = firstIndexIsNotAResult ? 1 : 0;
      i < (firstIndexIsNotAResult ? 21 : 20);
      i++
    ) {
      urlArr.push({
        href: 'https://youtube.com/watch?v=' + results[i].videoRenderer.videoId,
        title: results[i].videoRenderer.title.runs[0].text,
        img:
          results[i].videoRenderer.thumbnail.thumbnails[
            results[i].videoRenderer.thumbnail.thumbnails.length - 1
          ].url,
        artist: results[i].videoRenderer.longBylineText.runs[0].text,
      });
    }

    // // videoId
    // console.log(
    //   "https://youtube.com/watch?v=" + results[0].videoRenderer.videoId
    // );

    // // thumbnail
    // console.log(
    //   results[0].videoRenderer.thumbnail.thumbnails[
    //     results[0].videoRenderer.thumbnail.thumbnails.length - 1
    //   ].url
    // );

    // // Title
    // console.log(results[0].videoRenderer.title.runs[0].text);

    // // Channel name
    // console.log(results[0].videoRenderer.longBylineText.runs[0].text);
  }

  return urlArr;
}
