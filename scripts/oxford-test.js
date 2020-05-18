import * as common from './common.js';
import * as chart from './chart.js';

let questions;
let ranges;

export let chartSVG;

export const parameters = {
    'document': null,
    'instruction': {
        'element': null
    },
    'userInfo': {
        'element': null
    },
    'questions': {
        'element': null,
        'json': 'json/questions.json'
    },
    'results': {
        'element': null,
        // 'uploadUri': 'http://localhost/commitAnswers.php',
        // 'answersUri': 'http://localhost/commitAnswers.php',
        'uploadUri': 'http://k91495hf.beget.tech/commitAnswers.php',
        'answersUri': 'http://k91495hf.beget.tech/commitAnswers.php',
        'womenJSON': 'json/women.json',
        'menJSON': 'json/men.json',
        'boysJSON': 'json/boys.json',
        'girlsJSON': 'json/girls.json'
    },
    'chart': {
        'options': {
            height: '100%',
            width: '100%',
            topPadding: 0,
            leftPadding: 250,
            chartArea: {
                style: {
                    width: 3,
                    color: 'black'
                }                
            },
            header: {
                title: {
                    text: 'Основной заголовок',
                    style: {
                        fontSize: 100,
                        color: 'black',
                        fill: 'black',
                        opacity: 1,
                        anchor: 'start',
                        offset: 0
                    }
                },
                subTitle: {
                    text: 'Подзаголовок',
                    style: {
                        fontSize: 80,
                        color: 'gray',
                        fill: 'gray',
                        opacity: 1,
                        anchor: 'start',
                        offset: 0
                    }
                }
            },
            hAxis: {
                position: 10,
                style: {
                    width: 10,
                    fill: 'black',
                    color: 'black'
                }
            },
            vAxis: {
                position: 0,
                style: {
                    width: 3,
                    color: 'black'
                }
            },
            hGrid: {
                step: 100,
                count: 21,
                offset: 0,
                extend: 200,
                style: {width: 3, color: 'black'},
                dataLabels: {
                    labels: ['+100', '+90','+80','+70','+60','+50','+40','+30','+20','+10',
                    '0', '-10', '-20', '-30', '-40', '-50', '-60', '-70', '-80', '-90', '-100'],
                    style: {
                        fontSize: 60,
                        color: 'black',
                        fill: 'black',
                        opacity: 1,
                        anchor: 'end',
                        offset: 200 // Подумать о замене на расчетный от leftPadding
                    }
                },
                emphasises: [
                    {
                        emphasisUp: [7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7],
                        emphasisDown: [-15, -15, -15, -15, -15, -15, -15, -15, -15, -15, -15, -15],
                        style: {fill: 'gray', width: 6, fillOpacity: .3, strokeDasharray: '60 15'}
                    },
                    {
                        emphasisUp: [35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35],
                        emphasisDown: [7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7],
                        style: {fill: '#DDD', width: 6, fillOpacity: .3}
                    }
                ]
            },
            vGrid: {
                step: 400,
                count: 11,
                offset: 200,
                style: {
                    width: 3,
                    color: 'black'
                },
                dataLabels: {
                    labels: ['A','B','C','D','E','F','G','H','I', 'J', ' '],
                    subLabels: ['Стабильность','Счастье','Спокойствие','Уверенность','Активность','Cпособность','Ответственность','Объективность','Открытость', 'Общение', ' '],
                    parameters: {
                        rect: {
                            fill: 'white',
                            height: 250
                        },
                        style: {
                            fontSize: 70,
                            color: 'black',
                            fill: 'black',
                            opacity: 1,
                            anchor: 'middle',
                            offset: 0,
                        },
                        subStyle: {
                            fontSize: 48,
                            color: 'black',
                            fill: 'black',
                            opacity: 1,
                            anchor: 'middle',
                            offset: 0,
                        }
                    },
                }
            },
            graph: {
                line: {
                    width: 10,
                    color: "#449"
                },
                point: {
                    radius: 20,
                    color: 'maroon',
                },
                label: {
                    style: {
                        fontSize: 70,
                        color: 'black',
                        fill: 'black',
                        opacity: 1,
                        anchor: 'start',
                        offset: 30
                    }
                }                
            }
        }
    },
    'testList': {
        element: null
    }
};

export let userInfo = {
    'firstname': '',
    'lastname': '',
    'age': null,
    'sex': '',
    'occupation': ''
};
export let answers = [];
export const testList = [];
export let capacityAnswers = {'A': 0, 'B': 0,'C': 0, 
    'D': 0, 'E': 0, 'F': 0, 'G': 0, 'H': 0,'I': 0, 'J': 0,
    'ManicB': 0, 'ManicE': 0};

export const capacityResults = {
    'A': 0,
    'B': 0,
    'C': 0,
    'D': 0,
    'E': 0,
    'F': 0,
    'G': 0,
    'H': 0,
    'I': 0,
    'J': 0
};

const instruction = {
    'title': 'Как заполнять опросный лист',
    'instructions': [
        'Убедитесь в том, что понимаете вопрос. Прочтите его столько раз, сколько Вам необходимо.',
        'Пожалуйста, ответьте на каждый вопрос.',
        'Не задерживайтесь слишком долго на одном вопросе. Ответьте на вопрос сразу же, как только Вы его поняли, и переходите к следующему вопросу.',
        'Когда ответ будет разным, в зависимости от того, рассматриваете ли Вы прошлое или настоящее, отвечайте по отношению к настоящему времени.'
    ]
};

const userInfoForm = {
    'caption': 'Введите данные для прохождения теста',
    'questions': [
        {
            'name': 'firstname',
            'label': 'Имя',
            'type': 'text',
            'required': true,
            'placeholder': 'Ваше имя',
            'value': ''
        },
        {
            'name': 'lastname',
            'label': 'Фамилия',
            'type': 'text',
            'required': false,
            'placeholder': 'Ваша фамилия',
            'value': ''
        },
        {
            'name': 'age',
            'label': 'Возраст',
            'type': 'number',
            'min': 14,
            'max': 100,
            'required': true,
            'placeholder': 'Ваш возраст',
            'value': null
        },
        {
            'name': 'occupation',
            'label': 'Профессия',
            'type': 'text',
            'required': false,
            'placeholder': 'Ваша профессия',
            'value': ''
        },
        {
            'name': 'sex',
            'label': 'Пол',
            'type': 'radio',
            'required': true,
            'placeholder': 'Ваша пол',
            'options': [
                {'label': 'Женский', 'id': 'female','value': 'female'},
                {'label': 'Мужской', 'id': 'male','value': 'male'}
            ],
            'value': ''
        }
    ]
}

function calculateResults() {
    if(ranges) {
        capacityResults.A = ranges.A[capacityAnswers.A];
        capacityResults.B = ranges.B[capacityAnswers.B];
        capacityResults.C = ranges.C[capacityAnswers.C];
        capacityResults.D = ranges.D[capacityAnswers.D];
        capacityResults.E = ranges.E[capacityAnswers.E];
        capacityResults.F = ranges.F[capacityAnswers.F];
        capacityResults.G = ranges.G[capacityAnswers.G];
        capacityResults.H = ranges.H[capacityAnswers.H];
        capacityResults.I = ranges.I[capacityAnswers.I];
        capacityResults.J = ranges.A[capacityAnswers.J];
    }
    else {
        alert("Ranges еще не загружены"); // Диагностическое сообщение
    }
}

function clearLocalStorage(event) {
    localStorage.clear();
    event.currentTarget.form.reset();

    event.preventDefault();
}

function clickSaveChartButton(event) {
    const exportSVG = 'data:image/svg,' + encodeURIComponent(common.getElementById('oxftChartDiv').innerHTML);
    let exportLink = common.getElementById("osftResultA");

    if(exportLink) {
        exportLink.setAttribute('href', exportSVG);
        exportLink.setAttribute('download', 'results.svg');
    } 
    else {
        exportLink = common.createA(exportSVG, null, 'osftResultA', 'results.svg');
    }

    document.body.appendChild(exportLink);
    exportLink.click();
}

function clickSendButton(event) {
    sendAnswers();
}

function createUserInfoForm() {
    const form = common.createForm();
    const buttonsDiv = common.createDiv();

    buttonsDiv.appendChild(common.createButton('Далее'));

    form.appendChild(common.createHeader(userInfoForm.caption));
    form.appendChild(common.createFields(userInfoForm.questions));
    form.appendChild(buttonsDiv);

    if(userInfo.firstname) {
        const clearButton = common.createButton('Очистить');
        clearButton.addEventListener('click', clearLocalStorage);
        buttonsDiv.appendChild(clearButton);
    }

    form.addEventListener('submit', submitUserInfo);

    return form;
}

function createInstruction() {
    const form = common.createForm();
    const buttonsDiv = common.createDiv();

    buttonsDiv.appendChild(common.createButton('Далее'));

    form.appendChild(common.createHeader(instruction.title));
    form.appendChild(common.createList(instruction.instructions, 'ol'));
    form.appendChild(buttonsDiv);

    form.addEventListener('submit', submitInstruction);

    return form;
}

function createQuestion() {
    const result = common.createDiv(null, 'oxftQuestion');
    const textDiv = common.createDiv(null, 'oxftQuestionText');
    const buttonsDiv = common.createDiv(null, 'oxftQuestionButtons');
    const capacityInput = common.createInput('oxftCapacity', 'hidden');
    const numInput = common.createInput('oxftNum', 'hidden');
    const yesButton = common.createButton('Да', 'oxftYes', 'yes', 'button')
    const unknownButton = common.createButton('Возможно', 'oxftUnknown', 'unknown', 'button')
    const noButton = common.createButton('Нет', 'oxftNo', 'no', 'button')

    yesButton.addEventListener('click', submitYesQuestionForm);
    unknownButton.addEventListener('click', submitUnknownQuestionForm);
    noButton.addEventListener('click', submitNoQuestionForm);

    buttonsDiv.appendChild(yesButton);
    buttonsDiv.appendChild(unknownButton);
    buttonsDiv.appendChild(noButton);

    result.appendChild(textDiv);
    result.appendChild(capacityInput);
    result.appendChild(numInput);
    result.appendChild(buttonsDiv);

    return result;
}

function commitAnswer(answerData) {
    capacityAnswers[answerData.capacity] += answerData.value;

    if((answerData.num == 197) & (answerData.answer.toUpperCase() == 'YES'))
        capacityAnswers['ManicB'] = 1;

    if((answerData.num == 22) & (answerData.answer.toUpperCase() == 'YES'))
        capacityAnswers['ManicE'] = 1;

    answers.push(answerData);
}

function fillQuestionForm() {
    let questionNum = 1;
    if(answers.length == questions.length) {
        return false
    }
    else if(answers.length > 0) {
        questionNum = answers[answers.length - 1].num + 1;
    }

    const question = questions[questionNum - 1];

    common.getElementById('oxftQuestionText').innerHTML = question.Num + '.&nbsp;' + question.Question;
    common.getElementById('oxftCapacity').setAttribute('value', question.Capacity);
    common.getElementById('oxftNum').setAttribute('value', question.Num);
    common.getElementById('oxftYes').setAttribute('value', question.Values.Yes);
    common.getElementById('oxftUnknown').setAttribute('value', question.Values.Unknown);
    common.getElementById('oxftNo').setAttribute('value', question.Values.No);

    return true;
}

function getSexName(sex) {
    if(sex.toUpperCase() == 'MALE') {
        return 'Мужской'
    }
    else {
        return 'Женский'
    }
}

function loadJSON(url, func) {
    const request = new XMLHttpRequest();

    request.open('GET', url);
    request.responseType = 'json';

    request.onload = func;

    request.send();
}

export function clickTestButtton(event) {
    const jsonUri = 'answers.php?test=' + event.currentTarget.value;
    capacityAnswers = {'A': 0, 'B': 0,'C': 0, 
    'D': 0, 'E': 0, 'F': 0, 'G': 0, 'H': 0,'I': 0, 'J': 0,
    'ManicB': 0, 'ManicE': 0};
    answers = [];
    common.parameters.document = parameters.document;
    loadJSON(jsonUri, loadAnswersFunc);
}

function loadAnswersFunc(){
    const resultData = this.response;
    userInfo = resultData.userInfo;
    const answersData = resultData.answers;

    for(let i = 0; i < answersData.length; i++){
        let answerData = {'num': 0, 'capacity': '', 'value': 0, 'answer': ''}
        answerData.num = answersData[i].num;
        answerData.capacity = answersData[i].capacity;
        answerData.value = answersData[i].value;
        answerData.answer = answersData[i].answer;

        commitAnswer(answerData);
    }

    loadRanges(userInfo, loadRangesHideFunc);
    // parameters.results.element.style.display = 'block';
}

function loadQuestionsFunc() {
    questions = this.response;
    parameters.userInfo.element.style.display = 'block';
}

function loadRanges(userInfo, func) {
    let json;
    if(userInfo.sex == 'female') {
        if(userInfo.age > 18) {
            json = parameters.results.womenJSON;
        }
        else {
            json = parameters.results.girlsJSON;
        }
    }
    else if(userInfo.sex == 'male') {
        if(userInfo.age > 18) {
            json = parameters.results.menJSON;
        }
        else {
            json = parameters.results.boysJSON;
        }
    }

    loadJSON(json, func);
}

function loadRangesFunc() {
    ranges = this.response;
    loadAnswersFromLocalStorage()
    parameters.userInfo.element.style.display = 'none';
    if(fillQuestionForm()) {
        parameters.instruction.element.style.display = 'block';
    }
    else {
        calculateResults();
        showResults(parameters.results.element);
        parameters.results.element.style.display = 'block';
    }
}

function loadRangesHideFunc() {
    ranges = this.response;
    calculateResults();
    showResults(parameters.results.element);
    parameters.results.element.style.display = 'block';
}

function loadUserInfoFromLocalStorage() {
    userInfo.firstname = localStorage.getItem('userInfo_firstname');
    userInfo.lastname = localStorage.getItem('userInfo_lastname');
    userInfo.age = parseInt(localStorage.getItem('userInfo_age'));
    userInfo.sex = localStorage.getItem('userInfo_sex');
    userInfo.occupation = localStorage.getItem('userInfo_occupation');

}

function loadAnswersFromLocalStorage() {
    for(let i = 0; i < questions.length; i++){
        let answerData = {'num': 0, 'capacity': '', 'value': 0, 'answer': ''}
        let numStr =  localStorage.getItem('answer_' + questions[i].Num + '_num');
        if(numStr) {
            answerData.num = parseInt(numStr);
            answerData.capacity = localStorage.getItem('answer_' + questions[i].Num + '_capacity');
            answerData.value = parseInt(localStorage.getItem('answer_' + questions[i].Num + '_value'));
            answerData.answer = localStorage.getItem('answer_' + questions[i].Num + '_answer');

            commitAnswer(answerData);
        }
        else {
            break;
        }
    }
}

function saveUserInfoToLocalStorage() {
    localStorage.setItem('userInfo_firstname', userInfo.firstname);
    localStorage.setItem('userInfo_lastname', userInfo.lastname);
    localStorage.setItem('userInfo_age', userInfo.age);
    localStorage.setItem('userInfo_sex', userInfo.sex);
    localStorage.setItem('userInfo_occupation', userInfo.occupation);
}

function saveAnswerToLocalStorage(answer) {
    localStorage.setItem('answer_' + answer.num + '_num', answer.num);
    localStorage.setItem('answer_' + answer.num + '_capacity', answer.capacity);
    localStorage.setItem('answer_' + answer.num + '_value', answer.value);
    localStorage.setItem('answer_' + answer.num + '_answer', answer.answer);

}

function sendAnswers() {
    const xhr = new XMLHttpRequest();
    const resultData = {'userInfo': userInfo, 'answers': answers};
    const resultJSON = JSON.stringify(resultData);

    xhr.open("POST", parameters.results.uploadUri, true)
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    
    xhr.send(resultJSON);
}

function showResults(element) {
    const points = [];
    const percents = [];
    const resultDiv = common.createDiv(null, 'oxftResultDiv');
    const pointsDiv = common.createDiv(null, 'oxftPointsDiv');
    const percentsDiv = common.createDiv(null, 'oxftPercentsDiv');
    const chartDiv = common.createDiv(null, 'oxftChartDiv');

    element.innerHTML = "";

    resultDiv.style.display = 'flex';
    pointsDiv.style.flex = '1';
    percentsDiv.style.flex = '1';

    points.push('A: ' + capacityAnswers['A']);
    points.push('B: ' + capacityAnswers['B']);
    points.push('C: ' + capacityAnswers['C']);
    points.push('D: ' + capacityAnswers['D']);
    points.push('E: ' + capacityAnswers['E']);
    points.push('F: ' + capacityAnswers['F']);
    points.push('G: ' + capacityAnswers['G']);
    points.push('H: ' + capacityAnswers['H']);
    points.push('I: ' + capacityAnswers['I']);
    points.push('J: ' + capacityAnswers['J']);

    percents.push('A: ' + capacityResults['A']);
    percents.push('B: ' + capacityResults['B']);
    percents.push('C: ' + capacityResults['C']);
    percents.push('D: ' + capacityResults['D']);
    percents.push('E: ' + capacityResults['E']);
    percents.push('F: ' + capacityResults['F']);
    percents.push('G: ' + capacityResults['G']);
    percents.push('H: ' + capacityResults['H']);
    percents.push('I: ' + capacityResults['I']);
    percents.push('J: ' + capacityResults['J']);

    pointsDiv.appendChild(common.createHeader("Набранные очки", 'h2'));
    pointsDiv.appendChild(common.createList(points));

    percentsDiv.appendChild(common.createHeader("Проценты", 'h2'));
    percentsDiv.appendChild(common.createList(percents));

    resultDiv.appendChild(pointsDiv);
    resultDiv.appendChild(percentsDiv);

    showChart(chartDiv);

    const buttonsDiv = document.createElement("div");
    buttonsDiv.id = 'oxftQuestionButtons';

    const saveButton = common.createButton('Сохранить график', 'oxftSave')
    saveButton.addEventListener('click', clickSaveChartButton);

    const sendButton = common.createButton('Отправить результаты', 'oxftSend')
    sendButton.addEventListener('click', clickSendButton);


    buttonsDiv.appendChild(saveButton);
    buttonsDiv.appendChild(sendButton);

    element.appendChild(chartDiv);
    element.appendChild(buttonsDiv);
}

function showChart(element) {
    const percents = [];
 
    percents.push(capacityResults['A']);
    percents.push(capacityResults['B']);
    percents.push(capacityResults['C']);
    percents.push(capacityResults['D']);
    percents.push(capacityResults['E']);
    percents.push(capacityResults['F']);
    percents.push(capacityResults['G']);
    percents.push(capacityResults['H']);
    percents.push(capacityResults['I']);
    percents.push(capacityResults['J']);

    let keyPoints = [];
    if(capacityAnswers.ManicB) keyPoints.push(1);
    if(capacityAnswers.ManicE) keyPoints.push(4);

    let title  = userInfo.firstname;
    if(userInfo.lastname) title += ' ' + userInfo.lastname;
    if(userInfo.occupation) title += ' (' + userInfo.occupation + ')';

    parameters.chart.options.header.title.text = title;
    parameters.chart.options.header.subTitle.text = 'Возраст: ' + userInfo.age;
    parameters.chart.options.header.subTitle.text += ', пол: ' + getSexName(userInfo.sex)

    if(chartSVG) chartSVG.remove();
    chartSVG = chart.drawChart(null, percents, parameters.chart.options, keyPoints);
 
    element.appendChild(chartSVG);
}

function submitInstruction(event) {
    parameters.instruction.element.style.display = 'none';
    parameters.questions.element.style.display = 'block';

    event.preventDefault();
}

function submitQuestion(answer, value) {
    const answerData = {'num': 0, 'capacity': '', 'value': 0, 'answer': ''}
    const numInput = document.getElementById('oxftNum');
    answerData.answer = answer
    answerData.value = value;

    answerData.num = parseInt(document.getElementById('oxftNum').value);
    answerData.capacity = document.getElementById('oxftCapacity').value;

    commitAnswer(answerData);
    saveAnswerToLocalStorage(answerData);

    if(answerData.num < questions.length) {
        numInput.value = answerData.num + 1;
        fillQuestionForm();
    }
    else {
        calculateResults();
        showResults(parameters.results.element);
        parameters.questions.element.style.display = 'none';
        parameters.results.element.style.display = 'block';
    }
}

function submitNoQuestionForm() {
    const value = parseInt(document.getElementById('oxftNo').value);
    submitQuestion('no', value)
}

function submitUnknownQuestionForm() {
    const value = parseInt(document.getElementById('oxftUnknown').value);
    submitQuestion('unknown', value)
}

function submitYesQuestionForm() {
    const value = parseInt(document.getElementById('oxftYes').value);
    submitQuestion('yes', value)
}

function submitUserInfo(event) {
    const sexInputs = common.getElementsByName('inp_sex');

    userInfo.firstname = common.getElementById('inp_firstname').value;
    userInfo.lastname = common.getElementById('inp_lastname').value;
    userInfo.age = parseInt(common.getElementById('inp_age').value);
    userInfo.occupation = common.getElementById('inp_occupation').value;

    for(let i = 0; i < sexInputs.length; i++) {
        if(sexInputs[i].checked)
            userInfo.sex = sexInputs[i].value;
    }

    saveUserInfoToLocalStorage();
    loadRanges(userInfo, loadRangesFunc);

    event.preventDefault();
}

export function startTest() {
    loadUserInfoFromLocalStorage();
    userInfoForm.questions[0].value = userInfo.firstname;
    userInfoForm.questions[1].value = userInfo.lastname;
    userInfoForm.questions[2].value = userInfo.age;
    userInfoForm.questions[3].value = userInfo.occupation;
    userInfoForm.questions[4].value = userInfo.sex;

    common.parameters.document = parameters.document;

    parameters.instruction.element.style.display = 'none';
    parameters.instruction.element.appendChild(createInstruction());

    parameters.userInfo.element.style.display = 'none';
    parameters.userInfo.element.appendChild(createUserInfoForm());

    parameters.questions.element.style.display = 'none';
    parameters.questions.element.appendChild(createQuestion());

    parameters.results.element.style.display = 'none';

    loadJSON(parameters.questions.json, loadQuestionsFunc);
}

// Секция тестовых функций

function testRangesFunc() {
    ranges = this.response;
    loadJSON(parameters.questions.json, testQuestionsFunc);
}

function testQuestionsFunc() {
    questions = this.response;
    loadAnswersFromLocalStorage();

    calculateResults();
    showResults(parameters.results.element);

    parameters.questions.element.style.display = 'none';
    parameters.results.element.style.display = 'block';
}

export function testTest() {
    userInfoForm.questions[0].value = userInfo.firstname;
    userInfoForm.questions[1].value = userInfo.lastname;
    userInfoForm.questions[2].value = userInfo.age;
    userInfoForm.questions[3].value = userInfo.occupation;
    userInfoForm.questions[4].value = userInfo.sex;


    common.parameters.document = parameters.document;

    parameters.instruction.element.style.display = 'none';
    parameters.instruction.element.appendChild(createInstruction());

    parameters.userInfo.element.style.display = 'none';
    parameters.userInfo.element.appendChild(createUserInfoForm());

    parameters.questions.element.style.display = 'none';
    parameters.questions.element.appendChild(createQuestion());

    parameters.results.element.style.display = 'none';

    loadRanges(userInfo, testRangesFunc);
}

// Секция тестовых функций
