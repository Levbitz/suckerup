const axios = require("axios");
const cheerio = require("cheerio");
const { response, json } = require("express");
const express = require("express");
const app = express();

var port = process.env.PORT || 8000;
const newsPapers = [
  {
    name: "the-times",
    address: "https://www.thetimes.co.uk/environment/climate-change",
    base: "",
  },
  {
    name: "the-gaurdian",
    address: "https://www.theguardian.com/environment/climate-crisis",
    base: "",
  },
  {
    name: "the-telegram",
    address: "https://www.telegraph.co.uk/climate-change/",
    base: "https://www.telegraph.co.uk",
  },
];

//articles
const articles = [];

//loop througn nP
newsPapers.forEach((newspaper) => {
  axios.get(newspaper.address).then((response) => {
    const html = response.data;
    //       //console.log(html);
    const $ = cheerio.load(html);
    $('a:contains("climate")', html).each(function () {
      const title = $(this).text();
      const url = $(this).attr("href");
      articles.push({
        title,
        url: newspaper.base + url,
        source: newspaper.name,
      });
    });
  });
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.get("/news", (req, res) => {
  res.json(articles);
  //   axios
  //     .get("https://www.theguardian.com/environment/climate-crisis")
  //     .then((response) => {
  //       const html = response.data;
  //       //console.log(html);
  //       const $ = cheerio.load(html);
  //       $('a:contains("climate")', html).each(function () {
  //         const title = $(this).text();
  //         const url = $(this).attr("href");
  //         articles.push({
  //           title,
  //           url,
  //         });
  //       });
  //       res.json(articles);
  //     });
});

// app.get("/news/:id", async (req, res) => {
//   //res.send("Hello World!");
//   const Id = req.params.newspaperId;
//   const newspaper = newsPapers.filter((newspaper) => newspaper.name == Id);

//   console.log(newspaper);
// });

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
