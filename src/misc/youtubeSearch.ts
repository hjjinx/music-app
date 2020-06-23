// Made this for Discord bot in order to search YouTube search results

module.exports.search = async function(query) {
  console.log(query);
  const cheerio = require('react-native-cheerio');
  const link = `https://www.youtube.com/results?search_query=${query}&sp=EgIQAQ%253D%253D`;
  const res = await fetch(link);
  let html = await res.text();
  const $ = cheerio.load(html);

  var urlArr = [];

  const ch1 = await $(`h3.yt-lockup-title`);

  // Youtube can return search results in 2 pages now. This makes for 2 separate scenarios
  // In this scenario, the new way HTMl is returned.
  if (html.length === 0) {
    const ch2 = await $(`ytd-thumbnail.style-scope ytd-video-renderer`).each(
      (i, elem) => {
        const img = elem.children[0].children[0].children[0].attribs.src;
        const next = elem.next;
        const title = next.children[0].children[0].children[0].children;
      },
    );
  }

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
  return urlArr;
};
