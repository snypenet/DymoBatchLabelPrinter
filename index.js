const Dymo = require("dymojs");
const uuid = require("uuid/v4");
const fs = require("fs");
const dymo = new Dymo();

let labelContentsData = fs.readFileSync("C:\\Users\\MLC Laptop 2\\Documents\\CreatedLabels\\LabelPrinterData\\data.txt");
let labelContentsDataRows = labelContentsData.toString().split('\r\n');
let labelContentsTokens = loadDataTokens(labelContentsDataRows);
let labelDataToPrint = loadData(labelContentsDataRows, labelContentsTokens);

let labelsQueue = [];

for(let i in labelDataToPrint){
    let labelContents = fs.readFileSync(`C:\\Users\\MLC Laptop 2\\Documents\\CreatedLabels\\${labelDataToPrint[i].LabelName}`).toString().trim().replace(/(\r\n|\n|\r)/g, '');
    let newLabel = labelContents.toString();
    for(let prop in labelDataToPrint[i]){
        let replacer = new RegExp(prop, "g");
        newLabel = newLabel.replace(replacer, labelDataToPrint[i][prop]);
    }

    labelsQueue.push(newLabel);
    labelsQueue.push(newLabel);
}

flushLabelQueue(labelsQueue);

function flushLabelQueue(queue){
    if(queue.length){
        printThis(queue.pop());
        setTimeout(() => {
            flushLabelQueue(queue);
        }, 3000);
    }
}

function loadDataTokens(data){
    let tokenContents = {};
    let tokens = data[0].trim().split('\t');
    for(let j in tokens){
        tokenContents[j] = tokens[j].trim();
    }
    return tokenContents;
}

function loadData(data, tokens){
    let dataToPrint = [];
    for(let k in data){
        if(k != 0){
            let labelDataPoints = data[k].trim().split('\t');
            if(labelDataPoints.length > 0){
                let labelData = {};
                for(let l in labelDataPoints){
                    labelData[tokens[l]] = labelDataPoints[l].trim();
                }
                dataToPrint.push(labelData);
            }
        }
    }
    return dataToPrint;
}

function printThis(labelXml){
   dymo.print('DYMO LabelWriter 450', labelXml).then(successResult => {
        console.log(successResult);
    }, errorResult => {
        console.log(errorResult);
    });
}