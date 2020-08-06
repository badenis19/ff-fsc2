const fetch = require('node-fetch');
const ntc = require('ntc'); // to recover human name from hex code 
const { getColorFromURL } = require('color-thief-node'); // to get color from URL 
const rgbHex = require('rgb-hex'); // rgb to hexadecimal 
const fs = require('fs');

// setting size of array, will be used to limit the size of the array
const sizeofArray = 10;

// function to create/store the json file
const writeFile = (obj) => {
  fs.writeFile('product_details_with_color.json', JSON.stringify(obj), function (err) {
    if (err) return console.log(err);
    console.log('<product_details_with_color.json> file created in same directoty as the project ');
  });
}

// fetching data from the API
fetch('https://www.farfetch.com/uk/plpslice/listing-api/query?setId=9645&view=180&gender=Men')
  .then(res => res.json())
  .then(data => sendProductDetailsWithProminentColor(data.listing.products))

// main method of the program
const sendProductDetailsWithProminentColor = async (products) => {
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
          // creating the object here
          const productDetails = {
            name: product.shortDescription,
            designer: product.brand.name,
            link: "https://www.farfetch.com" + product.url,
            image_path: product.images.cutOut,
            color: ntcMatch[1]
          }
          ntcMatch ? resolve(productDetails) : reject("No match")
        })();
      })
    }

    // creating an array to store all the promises
    let promiseArray = [];

    tenProducts.forEach(async (product) => {
      promiseArray.push(returnColorfromImage(product))
    })

    // using Promise.all to go through the promises and then store the file 
    Promise.all(promiseArray)
      .then(data => writeFile(data))
  }
}

