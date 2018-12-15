const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');
const path = require('path');
const FILE_REGEXP = new RegExp(/\/\/\s?todo[:\s]+/i);
const files = getFiles();
const USERNAME_MAX_COLUMN_WIDTH = 10;
const DATA_MAX_COLUMN_WIDTH = 10;
const COMMENT_MAX_COLUMN_WIDTH = 50;
const FILE_MAX_COLUMN_WIDTH = 20;
console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths
        .map(p => readFile(p)
            .split(/\n/)
            .filter(line => line.match(FILE_REGEXP))
            .map(a => a.slice(a.search(FILE_REGEXP)) + '; ' + path.basename(p))
            .join('\n'))
        .join('\n')
        .split('\n')
        .map(line => {
            let parsedLine = line.replace(FILE_REGEXP, '').trim().split(';');
            if (parsedLine.length < 4) {
                let important = parsedLine[0].match('!') ? true : false;
                return {
                    user: '',
                    date: '',
                    comment: parsedLine[0].replace(/!/g, ''),
                    file: parsedLine[1].trim(),
                    important
                };
            }

            let user = parsedLine[0];
            let date = parsedLine[1].trim();
            let important = parsedLine[2].match(/!/) ? true : false;
            let comment = parsedLine[2].trim().replace(/!/g, '');
            let file = parsedLine[3].trim();

            return {user, date, comment, file, important}
        })
}

function importanceSort(collection) {
    return collection
        .slice(0)
        .sort(function (a, b) {
            let first = a.important;
            let second = b.important;
            return first - second
        })
        .reverse();

}

function userSort(collection) {
    return collection
        .slice(0)
        .sort(function (a, b) {
            let firstUser = a.user.length ? 1 : 0;
            let secondUser = b.user.length ? 1 : 0;
            return firstUser - secondUser;
        }).reverse();

}

function dateSort(collection) {
    return collection
        .slice(0)
        .sort(function (a, b) {
            let firstDate = a.date;
            let secondDate = b.date;
            firstDate = firstDate.length ? new Date(firstDate) : 0;
            secondDate = secondDate.length ? new Date(secondDate) : 0;
            return firstDate - secondDate;
        }).reverse();
}

function filterDate(collection, date) {
    return collection.filter(item => {
        let commentDate = item.date;
        let lineDate = commentDate.length ? new Date(commentDate) : 0;
        return lineDate > date
    })

}

function setMaxColumnWidth(collection) {
    let maxColumnWidth = [4, 4, 7, 4];
    let bounds = [USERNAME_MAX_COLUMN_WIDTH, DATA_MAX_COLUMN_WIDTH, COMMENT_MAX_COLUMN_WIDTH, FILE_MAX_COLUMN_WIDTH];
    collection.forEach(function (line) {
        if (!line.user.length || !line.date.length)
            return;
        maxColumnWidth[0] = defineMaxWidth(line.user.length, maxColumnWidth[0]);
        maxColumnWidth[1] = defineMaxWidth(line.date.length, maxColumnWidth[1]);
        maxColumnWidth[2] = defineMaxWidth(line.comment.length, maxColumnWidth[2]);
        maxColumnWidth[3] = defineMaxWidth(line.file.length, maxColumnWidth[3])
    });
    return maxColumnWidth.map((a, i) => {
        return a > bounds[i] ? bounds[i] : a
    })
}

const defineMaxWidth = (nextWidth, currentWidth,) => {
    if (nextWidth > currentWidth)
        return nextWidth;
    return currentWidth
};

function fillCell(content, cellWidth, doBorder = true) {
    let result = '  ';
    let str = content;
    result +=
        str.length <= cellWidth
            ? str.padEnd(cellWidth, ' ')
            : str.slice(0, cellWidth - 3) + '...';
    result += doBorder ? '  |' : '';
    return result;


}

function throwError() {
    console.log('Wrong command, please try again')
}

function showTable(collection) {
    if (!collection.length) {
        throwError();
        return;
    }
    let outputCollection = collection.slice(0);
    outputCollection.unshift({user:'user',date:'date',comment:'comment',file:'file'})ж
    let columnWidth = setMaxColumnWidth(collection);
    let result = '';
    outputCollection.forEach(function (line,i,collection) {
        result += `${line.important ? '!  ' : '   '}|${
            fillCell(line.user, columnWidth[0])}${
            fillCell(line.date, columnWidth[1])}${
            fillCell(line.comment, columnWidth[2])}${
            fillCell(line.file, columnWidth[3], false)}\n`;
        if(i === 0 || i === collection.length - 1){
            result += '-'.repeat(columnWidth.reduce((a, b) => a + b + 10)) + '\n';
        }

    });
    console.log(result);

}

function processCommand(command) {
    const commands = command.split(' ');
    switch (commands[0]) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            showTable(files);
            break;
        case 'important':
            showTable(files.filter(line => line.important));
            break;
        case 'user':
            commands[1] && showTable(files
                .filter(line => line.user.toLowerCase() === commands[1].toLowerCase()));
            break;
        case 'sort':
            let output = '';
            switch (commands[1]) {
                case 'importance':
                    output = importanceSort(files);
                    break;
                case 'user':
                    output = userSort(files);
                    break;
                case 'date':
                    output = dateSort(files);
                    break;
                default:
                    throwError();
                    break;
            }
            output && showTable(output);
            break;
        case 'date':
            let date = new Date(commands[1]);
            if (!date.getDate()) {
                throwError();
                break;
            }
            showTable(filterDate(files, date));
            break;
        default:
            throwError();
    }
}

// TODO you can do it!
// toDo you can do it1
//TODO you can do it2!
// TODO:you can do it3
//TODO:you can do it4!
//TODO: you can do it5
// toDo :you can do it6!
