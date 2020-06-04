// Made this for Discord bot in order to search YouTube search results

module.exports.search = async function(query) {
  const cheerio = require('react-native-cheerio');
  const res = await fetch(
    `https://www.youtube.com/results?search_query=${query}&sp=EgIQAQ%253D%253D`,
  );
  let html = await res.text();
  const $ = cheerio.load(html);

  var urlArr = [];
  html = await $(`h3.yt-lockup-title`).each((i, elem) => {
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
