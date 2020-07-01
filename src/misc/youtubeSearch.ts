// Made this for Discord bot in order to search YouTube search results

module.exports.search = async function(query) {
  const cheerio = require('react-native-cheerio');
  const link = `https://www.youtube.com/results?search_query=${query}&sp=EgIQAQ%253D%253D`;
  const res = await fetch(link);
  let html = await res.text();
  const $ = cheerio.load(html);

  var urlArr = [];

  const ch1 = await $(`h3.yt-lockup-title`);

  // Youtube can return search results in 2 pages now. This makes for 2 separate scenarios
  // In this scenario, the new way HTMl is returned.
  // if (html.length === 0) {
  //   const ch2 = await $(`ytd-thumbnail.style-scope ytd-video-renderer`).each(
  //     (i, elem) => {
  //       const img = elem.children[0].children[0].children[0].attribs.src;
  //       const next = elem.next;
  //       const title = next.children[0].children[0].children[0].children;
  //     },
  //   );
  // }

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

  if (urlArr.length === 0) {
    let script = await $('script').get()[26].children[0].data;

    var badJson = script.substr(30, script.length - 140);

    const json5 = require('json5');

    var correctJson = badJson.replace(/\n/g, '');
    correctJson = json5.parse(correctJson);

    let results =
      correctJson.contents.twoColumnSearchResultsRenderer.primaryContents
        .sectionListRenderer.contents[0].itemSectionRenderer.contents;

    // videoId
    for (let i = 0; i < (results.length < 20 ? results.length : 20); i++) {
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
    console.log(
      'https://youtube.com/watch?v=' + results[0].videoRenderer.videoId,
    );

    // thumbnail;
    console.log(
      results[0].videoRenderer.thumbnail.thumbnails[
        results[0].videoRenderer.thumbnail.thumbnails.length - 1
      ].url,
    );

    // Title
    console.log(results[0].videoRenderer.title.runs[0].text);

    // Channel name
    console.log(results[0].videoRenderer.longBylineText.runs[0].text);
  }

  return urlArr;
};
