//import puppeteer and fileSystem
const puppeteer = require("puppeteer")
const fs = require("fs/promises")
const UserAgent = require("user-agents")

const items = []

//function to scrape
async function scrape(){
    //create a new browser and page and specified the link
    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    // disable javascript so page doesn't redirect automatically and request cloudflare captcha
    page.setJavaScriptEnabled(false)

    // randomize user agent to bypass cloudflare captcha
    page.setUserAgent(new UserAgent().toString())

    /*******************************************************************************************************************/
    //get all the products urls into a list and loop them to extract informations
    await page.goto("https://www.mediamarkt.es/es/category/convertibles-2-en-1-160.html")
    const urls = await page.evaluate(()=>{
        return [...document.querySelectorAll("[class*=ProductContainer] [class*=StyledListItem] > a")].map(x=> x.href)
    })
    
    for (const url of urls) {
        // randomize user agent to bypass cloudflare captcha
        page.setUserAgent(new UserAgent().toString())

        // extract infos from links one by one :
        await page.goto(url)
        
        //image url
        const images_url = await page.evaluate(() => {
            return [...document.querySelectorAll("[class*=StyledZoomImage] img")].map(img => img.src)
        })
        
        //name :
        const name = await page.evaluate(() => document.querySelector("[class*=StyledPdpHeaderCell] h1")?.innerText.trim())
        
        //brand : 
        const brand = await page.evaluate(() => document.querySelector("[class*=StyledPdpHeaderCell] a > span")?.innerText.trim())
        
        // price : mazal hhh ok
        const price = await page.evaluate(() => {
            return parseFloat(document.querySelector("[class*=BrandedPriceFlexWrapper]")?.innerText.replace(/(\s)|([^0-9\.])/gm, '') ?? 0)
        })
        
        //delevry time :
        const delivery = await page.evaluate(() => [...document.querySelectorAll("[class*=StyledAvailabilityTypo]")].map(x=> x.innerText))
        
        //specifications :
        const infos = await page.evaluate(() => {
            return [...document.querySelectorAll("[class*=StyledFeatureContainer] tbody tr")].map((x) => (
                { 'info': x.firstChild.innerText, 'value': x.lastChild.innerText }
            ))
        })
        
        
        
        //console.log(image_url)
        await fs.appendFile("urls.txt", url+"\n")
        
        new Promise(() => items.push({ url, images_url, name, brand, price, delivery, infos }))
    }
    
    /*******************************************************************************************************************/
    var json = JSON.stringify(items, null, 2)
    console.log(json)
    //close the browser
    await browser.close()
}

scrape()