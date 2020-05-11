import * as common from './common.js';
import * as chart from './chart.js';

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
        'json': 'json/questions.json',
        "className": 'questionText',
        pageSize: 20
    },
    'results': {
        'element': null,
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
            leftPadding: 200, // Подумать как расчитать от параметров вертикальной оси
            chartArea: {
                style: {
                    width: 3,
                    color: 'black',
                    className: 'rectChart'
                }                
            },
            hAxis: {
                position: 10,
                style: {
                    width: 3,
                    color: 'gray',
                    className: 'axisLine'
                }
            },
            vAxis: {
                position: 0,
                style: {
                    width: 3,
                    color: 'gray',
                    className: 'axisLine'
                }
            },
            hGrid: {
                step: 100,
                count: 21,
                offset: 0,
                extend: 200,
                style: {
                    width: 5,
                    color: 'gray',
                    className: 'gridLine'
                },
                dataLabels: {
                    labels: ['+100', '+90','+80','+70','+60','+50','+40','+30','+20','+10',
                    '0', '-10', '-20', '-30', '-40', '-50', '-60', '-70', '-80', '-90', '-100'],
                    style: {
                        fontSize: 70,
                        color: 'gray',
                        anchor: 'end',
                        offset: 140, // Подумать о замене на расчетный от leftPadding
                        className: ''
                    }
                }
            },
            vGrid: {
                step: 400,
                count: 10,
                offset: 200,
                style: {
                    width: 5,
                    color: 'gray',
                    className: 'gridLine'
                },
                dataLabels: {
                    labels: ['A','B','C','D','E','F','G','H','I', 'J'],
                    style: {
                        fontSize: 70,
                        color: 'gray',
                        anchor: 'middle',
                        offset: 0,
                        height: 200,
                        className: 'rectLabel'
                    }
                }
            },
            graph: {
                line: {
                    width: 10,
                    color: "navy",
                    className: ''
                },
                point: {
                    radius: 20,
                    color: 'maroon',
                }
            }
        }
    }
}

export const userInfo = {
    'firstname': '',
    'lastname': '',
    'age': null,
    'sex': '',
    'occupation': ''
};
export const answers = [];
export const capacityAnswers = {'A': 0, 'B': 0,'C': 0, 'D': 0, 'E': 0, 'F': 0, 'G': 0, 'H': 0,'I': 0, 'J': 0};

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
        },
        {
            'name': 'save',
            'label': 'Запомнить',
            'type': 'checkbox',
            'required': false,
            'value': ''
        }
    ]
}

let questions;
let ranges;

function loadQuestions(url) {
    const request = new XMLHttpRequest();

    request.open('GET', url);
    request.responseType = 'json';

    request.onload = function () {
        questions = request.response;
        fillQuestionsForm();
        parameters.userInfo.element.style.display = 'block';
    }

    request.send();
}

function loadRanges(userInfo) {
    const request = new XMLHttpRequest();

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

    request.open('GET', json);
    request.responseType = 'json';

    request.onload = function () {
        ranges = request.response;
    }

    request.send();
}

function submitUserInfo(event) {
    userInfo.firstname = document.getElementById('inp_firstname').value;
    userInfo.lastname = document.getElementById('inp_lastname').value;
    userInfo.age = document.getElementById('inp_age').value;
    userInfo.occupation = document.getElementById('inp_occupation').value;

    let sexInputs = document.getElementsByName('inp_sex');
    for(let i = 0; i < sexInputs.length; i++) {
        if(sexInputs[i].checked)
            userInfo.sex = sexInputs[i].value;
    }

    loadRanges(userInfo);

    parameters.userInfo.element.style.display = 'none';
    parameters.instruction.element.style.display = 'block';

    event.preventDefault();
}

function createUserInfoForm(element) {
    const form = document.createElement("form");

    form.appendChild(common.createHeader(userInfoForm.caption));
    form.appendChild(common.createFields(userInfoForm.questions));
    form.appendChild(common.createButton('Далее'));
    form.addEventListener('submit', submitUserInfo);

    element.appendChild(form);
}

function submitInstruction(event) {
    parameters.instruction.element.style.display = 'none';
    parameters.questions.element.style.display = 'block';

    event.preventDefault();
}

function createInstruction(element) {
    const form = document.createElement("form");

    form.appendChild(common.createHeader(instruction.title));
    form.appendChild(common.createList(instruction.instructions, 'ol'));
    form.appendChild(common.createButton('Далее'));

    form.addEventListener('submit', submitInstruction);

    element.appendChild(form);
}

function createQuestion(name) {
    const result = document.createElement("div");
    result.id = 'div_' + name;

    const textDiv = document.createElement("div");
    textDiv.id = 'divText_' + name;
    textDiv.className = parameters.questions.className;

    result.appendChild(textDiv);

    const answerDiv = document.createElement("div");
    answerDiv.id = 'divAnswer_' + name;

    const choice = {
        'name': 'answer_' + name,
        'label': '',
        'type': 'radio',
        'required': true,
        'options': [
            {'label': 'Да', 'id': 'yes_' + name, 'value': 0},
            {'label': 'Затрудняюсь ответить', 'id': 'unknown_' + name, 'value': 1},
            {'label': 'Нет', 'id': 'no_' + name, 'value': 2}
        ]
    }

    answerDiv.appendChild(common.createField(choice));

    const capacityInput = common.createInput('capacity_' + name, 'hidden');
    const numInput = common.createInput('num_' + name, 'hidden');

    answerDiv.appendChild(capacityInput);
    answerDiv.appendChild(numInput);

    result.appendChild(answerDiv);
    return result;
}

function submitQuestionsForm(event) {
    const pageInput = document.getElementById('oxftPageNum');
    const pageNum = parseInt(pageInput.value);

    for(let i = 0; i < parameters.questions.pageSize; i++){
        const answerElements = document.getElementsByName('inp_answer_' + i);
        const answer = {'num': 0, 'capacity': '', 'value': 0, 'answer': ''}

        answer.num = document.getElementById('num_' + i).value;
        answer.capacity = document.getElementById('capacity_' + i).value;

        for(let j = 0; j < answerElements.length; j++){
            if(answerElements[j].checked) {
                answer.value = parseInt(answerElements[j].value);
                answer.answer = answerElements[j].id.replace('_' + i, '');

            }
        }
        capacityAnswers[answer.capacity] += answer.value;
        answers.push(answer);
    }

    if(pageNum < questions.length / parameters.questions.pageSize){
        pageInput.value = pageNum + 1;
        fillQuestionsForm();
    }
    else {
        calculateResults();
        showResults(parameters.results.element);
        parameters.questions.element.style.display = 'none';
        parameters.results.element.style.display = 'block';
    }

    event.target.reset();
    event.preventDefault();
}

function createQuestionsForm(element) {
    const form = document.createElement("form");

    for(let i = 0; i < parameters.questions.pageSize; i++) {
        const questionDiv = createQuestion(i);
        form.appendChild(questionDiv);
    }

    const pageInput = common.createInput('oxftPageNum', 'hidden');
    pageInput.id = 'oxftPageNum';
    pageInput.value = 1;

    form.appendChild(pageInput);
    form.appendChild(common.createButton('Далее'));

    form.addEventListener('submit', submitQuestionsForm);

    element.appendChild(form);
}

function fillQuestionsForm() {
    const pageInput = document.getElementById('oxftPageNum');
    const page = pageInput.value;

    for(let i = 0; i < parameters.questions.pageSize; i++){
        let questionNum = (page - 1) * parameters.questions.pageSize  + i;

        if(questionNum < questions.length){
            let question = questions[questionNum];
            document.getElementById("divText_" + i).innerHTML = question.Num + '.&nbsp;' + question.Question;
            document.getElementById('yes_' + i).setAttribute('value', question.Values.Yes);
            document.getElementById('unknown_' + i).setAttribute('value', question.Values.Unknown);
            document.getElementById('no_' + i).setAttribute('value', question.Values.No);
            document.getElementById('capacity_' + i).setAttribute('value', question.Capacity);
            document.getElementById('num_' + i).setAttribute('value', question.Num);
        }
        else {
            document.getElementById("div_" + i).style.display = 'none';
        }
    }
}

function calculateResults() {
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

function showResults(element) {
    const points = [];
    const percents = [];
    const resultDiv = document.createElement("div");
    resultDiv.style.display = 'flex';
    const pointsDiv = document.createElement("div");
    const percentsDiv = document.createElement("div");
    const chartDiv = document.createElement("div");

    pointsDiv.appendChild(common.createHeader("Набранные очки", 'h2'));
    pointsDiv.style.flex = '1';
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
    pointsDiv.appendChild(common.createList(points));
    resultDiv.appendChild(pointsDiv);

    percentsDiv.appendChild(common.createHeader("Проценты", 'h2'));
    percentsDiv.style.flex = '1';
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
    percentsDiv.appendChild(common.createList(percents));
    resultDiv.appendChild(percentsDiv);

    showChart(chartDiv);

    element.appendChild(chartDiv);
    element.appendChild(resultDiv);
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
    chart.drawChart(element, percents, parameters.chart.options);
}

export function startTest() {
    userInfoForm.questions[0].value = userInfo.firstname;
    userInfoForm.questions[1].value = userInfo.lastname;
    userInfoForm.questions[2].value = userInfo.age;
    userInfoForm.questions[3].value = userInfo.occupation;
    userInfoForm.questions[4].value = userInfo.sex;

    common.parameters.document = parameters.document;
    parameters.instruction.element.style.display = 'none';
    createInstruction(parameters.instruction.element);

    parameters.userInfo.element.style.display = 'none';
    createUserInfoForm(parameters.userInfo.element);

    parameters.questions.element.style.display = 'none';
    createQuestionsForm(parameters.questions.element);

    parameters.results.element.style.display = 'none';

    loadQuestions(parameters.questions.json);
}