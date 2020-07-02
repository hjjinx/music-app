// Made this for Discord bot in order to search YouTube search results

export default async function(query) {
  const cheerio = require('react-native-cheerio');
  const link = `https://www.youtube.com/results?search_query=${query}&sp=EgIQAQ%253D%253D`;
  const res = await fetch(link);
  let html = await res.text();
  const $ = cheerio.load(html);

  var urlArr = [];

  const ch1 = await $(`h3.yt-lockup-title`);

  ch1.each((i, elem) => {
    console.log('DIDnt require the new method');
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
  if (urlArr.length === 0) {
    let script = await $('script').get()[26].children[0].data;
    console.log('aaaa');
    var badJson = script.substr(30, script.length - 140);

    const json5 = require('json5');

    var correctJson = badJson.replace(/\n/g, '');
    correctJson = json5.parse(correctJson);

    let results =
      correctJson.contents.twoColumnSearchResultsRenderer.primaryContents
        .sectionListRenderer.contents[0].itemSectionRenderer.contents;

    const showingSearchInsteadFor = results[0].showingResultsForRenderer
      ? 1
      : 0;
    // console.log(showingSearchInsteadFor);
    for (
      let i = showingSearchInsteadFor;
      i <
      (results.length < 20 + showingSearchInsteadFor
        ? results.length + showingSearchInsteadFor
        : 20 + showingSearchInsteadFor);
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

    // videoId;
    // console.log(
    //   'https://youtube.com/watch?v=' + results[0].videoRenderer.videoId,
    // );

    // // thumbnail;
    // console.log(
    //   results[0].videoRenderer.thumbnail.thumbnails[
    //     results[0].videoRenderer.thumbnail.thumbnails.length - 1
    //   ].url,
    // );

    // // Title
    // console.log(results[0].videoRenderer.title.runs[0].text);

    // // Channel name
    // console.log(results[0].videoRenderer.longBylineText.runs[0].text);
  }

  return urlArr;
}
