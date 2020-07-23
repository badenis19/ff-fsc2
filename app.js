const fetch = require('node-fetch');
const ntc = require('ntc');
const { getColorFromURL } = require('color-thief-node');
const rgbHex = require('rgb-hex');

//  10 products and identifies the prominent colour of each item of clothing. 
// The output of this should be a JSON file which contains an array of products 
// listing the product name, designer, description, link, image path and colour. 6
//  You may use any tool, package or plugin to achieve this.


const size = 10;

const writefile = (obj) => {
  fs = require('fs');
  fs.writeFile('prominent_color.json', JSON.stringify(obj), function (err) {
    if (err) return console.log(err);
    console.log('success ');
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

    // const returnColorfromImage = (product) => {
    //   (async () => {
    //     const preminantColor = await getColorFromURL(product.images.cutOut);
    //     let rgbString = preminantColor.toString().replace(" ", ",");
    //     let r = rgbHex(rgbString);
    //     var ntcMatch = ntc.name(r);
    //     console.log(ntcMatch[1])
    //   })();
    // }

    const returnColorfromImage = (product) => {
      (async () => {
        const preminantColor = await getColorFromURL(product.images.cutOut);
        let rgbString = preminantColor.toString().replace(" ", ",");
        let r = rgbHex(rgbString);
        var ntcMatch = ntc.name(r);
        console.log(ntcMatch[1])
      })();
      // return ntcMatch[1];
    }

    // (async () => {
    //   const preminantColor = await getColorFromURL("data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwoICAgICAgICAcHCAoHBwcHCA8ICQcKFREWFhURExMYHSggGBolGxMTITEhJSkrLi4uFx8zODMsNygtLisBCgoKDQoLFQoPDisZExkrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrK//AABEIAKgBLAMBIgACEQEDEQH/xAAXAAEBAQEAAAAAAAAAAAAAAAAAAQIG/8QAIBABAQEAAQQCAwAAAAAAAAAAAAERQSExYYFxoQJRkf/EABcBAQADAAAAAAAAAAAAAAAAAAABBQf/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwDjqjVZUDVkWIA1FwgDIAAAAABiqDKpTQVEUAAAAAAAAEAAFQAAAAAAAAG0wAM8GACiAIAAAAAAaGAAAshiLKAi2sgoAC4kaAxlpkEWIoAAIAAAAAAAC7DYgC7DYgC7BFgAAAAAANSfZhAGaLUABAFRQAAFiANMiglRUgAAKcLxFvT8cBgAAAAAFAAAAAAAAAAABTUAAAAagM4uKAmI0yACAogC1BYCDWfpMAKgAAAAAACgAAAAAIAAAAAAALGs6MgC6moDWpqALpqAAAAACoAuluoAL3RZ0+QLMGvlmghoAfwAAAAAAAAAAAAAFABAAFRqToCI1nTWQAAAAAAAAAAAAXUAAAAAAAAAAAAAAAAAFkBABTARYYgLvTEAAAAAAAAAAAAFkBBrEoIAAACiAKIAogAAAAAAAC4ArICoAAAAAAAAKCAAAANTsyA1LwlTQAFBAAAAAAAAAAAAAAWQVAAAMMAEGr2ZAAAAAXhF4BAAAAAAAAAAAAXBdQAADDF1O4IAAAAAAAAHo9AB6PQAAAAAAC8IvAIAAAAAAAAAAACgAAAAAgAAAAAKYALIZ5BIZ5MBAlmIAAAAACoAAAAAAAAAAAAA/9k=");
    //   let rgbString = preminantColor.toString().replace(" ", ",");
    //   let r = rgbHex(rgbString);
    //   var ntcMatch = ntc.name(r);
    //   // console.log(ntcMatch[1]);
    // })();

    tenProducts.forEach((product) => {
      res.push({
        name: product.shortDescription,
        designer: product.brand.name,
        link: "https://www.farfetch.com" + product.url,
        image_path: product.images.cutOut,
        color: returnColorfromImage(product)
      })
    })
  }

  console.log("to send:", res)
  writefile(res)
}







// to change hex to color name
// var ColorCode = "#008559";

// // 2. Rate the color using NTC
// var ntcMatch = ntc.name(ColorCode);

// // 3. Handle the result. The library returns an array with the identified color.

// // Text string: Color name e.g "Deep Sea"
// console.log(ntcMatch[1]);


// // // TO DO: Extract dominent color from image 
// // // =========================


// console.log("color:", data.vibrant) // returns the hex code


// // hex to color name
// // ============================

// // to change hex to color name
// var ColorCode = "#008559";

// // 2. Rate the color using NTC
// var ntcMatch = ntc.name(ColorCode);

// // 3. Handle the result. The library returns an array with the identified color.

// // Text string: Color name e.g "Deep Sea"
// console.log(ntcMatch[1]);







