const fetch = require('node-fetch');
const ntc = require('ntc'); // to recover human name from hex code 
const { getColorFromURL } = require('color-thief-node'); // to get color from URL 
const rgbHex = require('rgb-hex'); // rgb to hexadecimal 
const fs = require('fs');

// setting size of array, will be used to limit the size of the array
const sizeofArray = 10;

// function to create/store the json file
const writefile = (obj) => {
  fs.writeFile('product_details_with_color.json', JSON.stringify(obj), function (err) {
    if (err) return console.log(err);
    console.log('<product_details_with_color.json> file created in same directory as the project ');
  });
}

// fetching data from the API
fetch('https://www.farfetch.com/uk/plpslice/listing-api/query?setId=9645&view=180&gender=Men')
  .then(res => res.json())
  .then(data => sendProductDetailsWithProminentColor(data.listing.products))

// main method of the program
const sendProductDetailsWithProminentColor = (products) => {
  let res = [];

  if (products) {
    // only keeping 10 products from the fetch
    const tenProducts = products.slice(0, sizeofArray).map(i => {
      return i;
    });

    // function get the name of the prominent color of each picture (using different libraries)
    const returnColorfromImage = (product) => {
      return new Promise((resolve, reject) => {
        (async () => {
          const preminantColor = await getColorFromURL(product.images.cutOut); // rgb in wrong format
          let rgbString = preminantColor.toString().replace(" ", ",");
          let hex = rgbHex(rgbString);
          const ntcMatch = ntc.name(hex);
          ntcMatch ? resolve(ntcMatch[1]) : reject("No match")
        })();
      })
    }

    tenProducts.forEach(async (product) => {
      // for each products, getting the required data and them to the array res
      const prominentColor = await returnColorfromImage(product);
      res.push({
        name: product.shortDescription,
        designer: product.brand.name,
        link: "https://www.farfetch.com" + product.url,
        image_path: product.images.cutOut,
        color: prominentColor
      })

    })
    
    // calling the writefile() method to create the json file
    writefile(res);
  }

}