const logElement = document.getElementById('log');

export function log(text, color) {
    const div = document.createElement('div');
    div.innerText = `${formatTimeFromDate(new Date())} ${text}`;
    div.style = `color: ${color || 'green'}`;
    if(!color) {
       console.log(text);
    }
    if(logElement.hasChildNodes()){
        logElement.insertBefore(div, logElement.childNodes[0]);
    } else {
        logElement.appendChild(div);
    }
}

export function error(text){
    log(text, 'red');
    console.error(text);
}

export function warn(text){
    log(text, 'orange');
    console.warn(text);
}

function formatTimeFromDate(date){
	const minutes = correctUnder10Values(date.getMinutes());
    const seconds = correctUnder10Values(date.getSeconds());
	return `${date.getHours()}:${minutes}:${seconds}:${date.getMilliseconds()}`;
}

function correctUnder10Values(value){
	return value < 10 ? ("0" + value) : value;
}
