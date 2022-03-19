//import puppeteer and fileSystem
const puppeteer = require("puppeteer")
const fs = require("fs/promises")

//function to scrape
async function scrape(){
    //create a new browser and page and specified the link
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    

    /*******************************************************************************************************************/
    //get all the products urls into a list and loop them to extract informations
    await page.goto("https://www.mediamarkt.es/es/category/convertibles-2-en-1-160.html")
    const urls = await page.evaluate(()=>{
        return Array.from(document.querySelectorAll("a.StyledLinkRouter-sc-1drhx1h-2.cOmqtX.StyledLink-omqd0i-0.dRrAGE")).map(x=> x.href)
    })
    
    var i = 1
    for (const url of urls) {
        
        // extract infos from links one by one : 
        await page.goto(url)

         /*Image url */
         const image_url = await page.evaluate(()=>{
             return Array.from(document.querySelectorAll("img"))
         })

         //name : 
         const name = await page.evaluate(()=>{
            return Array.from(document.querySelectorAll(".BaseTypo-sc-1jga2g7-0.izkVco.StyledInfoTypo-sc-1jga2g7-1.eyOXlh")).map(x=> x.innerText.Trim())
                                                        
        })
        /*const name = await page.evaluate(()=>
            document.querySelector(".StyledInfoTypo-sc-1jga2g7-1").textContent
        )*/

        //brand : 
        const brand = await page.evaluate(()=>{
            return Array.from(document.querySelectorAll("span.BaseTypo-sc-1jga2g7-0.izkVco.StyledInfoTypo-sc-1jga2g7-1.btBjbP")).map(x=> x.innerText)
        })

         // price : mazal
         const price = await page.evaluate(()=>{
            return Array.from(document.querySelectorAll("span.BaseTypo-sc-1jga2g7-0.izkVco.StyledInfoTypo-sc-1jga2g7-1.LmjzB.WholePrice-sc-1r6586o-7.eOXSJz")).map(x=> x.innerText)
        })

        //delevry time : 
        const delivery = await page.evaluate(()=>{
            return Array.from(document.querySelectorAll("div>span.BaseTypo-sc-1jga2g7-0.izkVco.StyledInfoTypo-sc-1jga2g7-1.lhGIyh.StyledAvailabilityTypo-sc-901vi5-7.egVdxU")).map(x=> x.innerText)
        })

        //specifications split with \t
        const infos = await page.evaluate(()=>{
            return Array.from(document.querySelectorAll(".StyledTableRow-sc-1enz63a-0.bXSuKd")).map((x)=> x.innerText)
        })
        


        //console.log(image_url)

         await fs.appendFile("urls.txt", url+"\n")
         i = i + 1
    }
    
    /*******************************************************************************************************************/
    var json = JSON.stringify(urls)
    console.log(json.constructor)
    //close the browser
    await browser.close()
}

scrape()