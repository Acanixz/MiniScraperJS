/* Copyright (c) 2022 Acanixz
All rights reserved.

This source code is licensed under the MIT-style license found in the
LICENSE file in the root directory of this source tree. 
*/

"use strict";
const puppeteer = require('puppeteer')
const fs = require('fs/promises')

let timeOffset = process.env.SCPR_timeOffset; // Don't forget to set env variables if hosted on server!
let URL = undefined
let mutationTarget = undefined
let extractionTarget = undefined
let fileName = undefined

if (timeOffset) { // Get settings from environment
    URL = process.env.SCPR_URL
    mutationTarget = process.env.SCPR_mutationTarget
    extractionTarget = process.env.SCPR_extractionTarget
    fileName = process.env.SCPR_Filename
} else { // Get settings from MiniScraperConfig.json
    const configFile = require("./data/MiniScraperConfig.json")
    timeOffset = configFile.timeOffset
    URL = configFile.URL
    mutationTarget = configFile.mutationTarget
    extractionTarget = configFile.extractionTarget
    fileName = configFile.fileName
}

const extractionFile = require(fileName)

 function GetCurrentTime(timeOffset){ // Use timeOffset to ajust possible hour differences
    let DateObj = new Date();
    let currentHour = DateObj.getHours() + timeOffset
    if ((currentHour) >= 24) {currentHour -= 24}
    if ((currentHour) < 0) {currentHour += 24}
    let CurrentTime = ("0" + currentHour).slice(-2) + ":" + ("0" + DateObj.getMinutes()).slice(-2) + ":" + ("0" + DateObj.getSeconds()).slice(-2)
    return CurrentTime
}

async function GetRecentElement(page){
    const extractedValue = await page.evaluate(x => {
        return document.querySelector(x).textContent
    }, extractionTarget)
    
    if (extractedValue != undefined){
        extractionFile.value = extractedValue
        extractionFile.timestamp = GetCurrentTime(timeOffset)

        fs.writeFile(fileName, JSON.stringify(extractionFile, null, 2), function writeJSON(err) {
            if (err) return console.log(err);
        });

        console.log("[MiniSCPR] Extracted: " + extractedValue)
    }
}

async function startup(){
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] })
    const page = await browser.newPage()
    console.log("[MiniSCPR] Connecting..")
    await page.goto(URL)
    console.log("[MiniSCPR] Connected!")

    await page.exposeFunction('puppeteerLogMutation', () => {
        GetRecentElement(page)
    });
    
    await page.evaluate(x => {
        const target = document.querySelector(x);
        const observer = new MutationObserver( mutations => {
        for (const mutation of mutations) {
            if (mutation.type === 'childList') {
                puppeteerLogMutation();
            }
        }
        });
        observer.observe(target, { childList: true });
    }, mutationTarget);
    console.log("[MiniSCPR] Observer is now active")
}

console.log("[MiniSCPR] index.js initialialized successfully")
startup()