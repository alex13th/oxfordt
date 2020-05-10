import * as common from './common.js';

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
        pageSize: 5
    },
    'results': {
        'element': null,
        'womenJSON': 'json/women.json',
        'menJSON': 'json/men.json',
        'boysJSON': 'json/boys.json',
        'girlsJSON': 'json/girls.json'
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
export const capacityAnswers = {
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
        'required': false,
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