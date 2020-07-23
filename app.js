const fetch = require('node-fetch');
const ntc = require('ntc');
const { getColorFromURL } = require('color-thief-node');
const rgbHex = require('rgb-hex');
const fs = require('fs');

const size = 10;

const writefile = (obj) => {
  fs.writeFile('prominent_color.json', JSON.stringify(obj), function (err) {
    if (err) return console.log(err);
    console.log('success');
  });
}

fetch('https://www.farfetch.com/uk/plpslice/listing-api/query?setId=9645&view=180&gender=Men')
  .then(res => res.json())
  .then(data => sendProductDetailsWithProminentColor(data.listing.products))

const sendProductDetailsWithProminentColor = (products) => {
  let res = [];

  if (products) {
    const tenProducts = products.slice(0, size).map(i => {
      return i;
    });

    const returnColorfromImage = (product) => {
      return new Promise((resolve, reject) => {
        (async () => {
          const preminantColor = await getColorFromURL(product.images.cutOut);
          let rgbString = preminantColor.toString().replace(" ", ",");
          let hex = rgbHex(rgbString);
          const ntcMatch = ntc.name(hex);
          ntcMatch ? resolve(ntcMatch[1]) : reject("No match")
        })();
      })
    }

    tenProducts.forEach(async (product) => {
      const prominentColor = await returnColorfromImage(product);
      res.push({
        name: product.shortDescription,
        designer: product.brand.name,
        link: "https://www.farfetch.com" + product.url,
        image_path: product.images.cutOut,
        color: prominentColor
      })

      writefile(res)
    })
  }
}