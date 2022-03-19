/*
    Before start Scraping we can add a function to click on : show more, to select all the products details
    And we can add a function too to select all the categories and scrape from them 1 by 1
*/
//import puppeteer and fileSystem
const puppeteer = require("puppeteer")
const fs = require("fs/promises")

//function to scrape
async function scrape(){
    //create a new browser and page and specified the link
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    

    /*******************************************************************************************************************/
    //get all the products urls

    await page.goto("https://www.mediamarkt.es/es/category/convertibles-2-en-1-160.html")
    const urls = await page.evaluate(()=>{
        return Array.from(document.querySelectorAll("a.StyledLinkRouter-sc-1drhx1h-2.cOmqtX.StyledLink-omqd0i-0.dRrAGE")).map(x=> x.href)
    })
    
    //get all the names
    const names = await page.evaluate(()=>{
        return Array.from(document.querySelectorAll("p.BaseTypo-sc-1jga2g7-0.izkVco.StyledInfoTypo-sc-1jga2g7-1.doYUxh")).map(x=> x.innerText)
    })

    //get all the images : mazal
    const images_url = await page.evaluate(()=>{
        return Array.from(document.querySelectorAll("div.StyledPicture-sc-1s3zfhk-0.gFoXlk>picture>img")).map(x=> x.src)
    })

    //get all the prices
    const prices = await page.evaluate(()=>{
        return Array.from(document.querySelectorAll(".StyledUnbrandedPriceDisplayWrapper-sc-1n9i68m-0.gWEOl")).map(x=> x.innerText)
    })

    //get all the dlvr time
    const delivery = await page.evaluate(()=>{
        return Array.from(document.querySelectorAll("div.StyledAvailabilityHeadingWrapper-sc-901vi5-2.iPyFyN>span.BaseTypo-sc-1jga2g7-0.izkVco.StyledInfoTypo-sc-1jga2g7-1.gUwKjU.StyledAvailabilityTypo-sc-901vi5-7.egVdxU")).map(x=> x.innerText)
    })

    //get all the specs : split with \n
    const infos = await page.evaluate(()=>{
        return Array.from(document.querySelectorAll(".StyledMediaStyleSwitch-sc-1s1z6np-0.llaJzb")).map(x=> x.innerText)
    })

    
    /*******************************************************************************************************************/
    
    console.log(names.length)
    console.log(urls.length)
    console.log(images_url.length)
    console.log(prices.length)
    console.log(delivery.length)
    console.log(infos.length)
    console.log(infos)
   
    /* GET every elements 1 by 1, and then store them in MongoDB */







    //close the browser
    await browser.close()
}

scrape()