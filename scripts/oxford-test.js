const oxftPageSize = 10;
const oxftQuestionsJSON = 'scripts/questions.json';

const ofxtQuestionStyle = 'questionText';

const oxftInstructionJSON = {
  'title': 'Как заполнять опросный лист',
  'instructions': [
    'Убедитесь в том, что понимаете вопрос. Прочтите его столько раз, сколько Вам необходимо.',
    'Пожалуйста, ответьте на каждый вопрос.',
    'Не задерживайтесь слишком долго на одном вопросе. Ответьте на вопрос сразу же, как только Вы его поняли, и переходите к следующему вопросу.',
    'Когда ответ будет разным, в зависимости от того, рассматриваете ли Вы прошлое или настоящее, отвечайте по отношению к настоящему времени.'
  ]
};

const oxftUserInfoForm = {
  'caption': 'Введите данные для прохождения теста',
  'questions': [
    {
      'name': 'firstname',
      'label': 'Имя',
      'type': 'text',
      'required': true,
      'placeholder': 'Ваше имя'
    },
    {
      'name': 'lastname',
      'label': 'Фамилия',
      'type': 'text',
      'required': false,
      'placeholder': 'Ваша фамилия'
    },
    {
      'name': 'age',
      'label': 'Возраст',
      'type': 'number',
      'min': 14,
      'max': 100,
      'required': true,
      'placeholder': 'Ваш возраст'
    },
    {
      'name': 'occupation',
      'label': 'Профессия',
      'type': 'text',
      'required': false,
      'placeholder': 'Ваша профессия'
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
      ]
    },
    
  ]
}

const oxftUserInfo = {
  'firstname': '',
  'lastname': '',
  'age': 0,
  'sex': '',
  'occupation': ''
};

let oxftInstructionElement;
let oxftUserInfoElement;
let oxftQuestionElement;
let oxftResultsElement;

let oxftQuestions;
let currentQuestion;
let answers = [];

function oxftLoadQuestions(url) {
  const request = new XMLHttpRequest();

  request.open('GET', url);
  request.responseType = 'json';
  
  request.onload = function () {
    oxftQuestions = request.response;
    oxftFillQuestionsForm();
  }

  request.send();
}

function oxftCreateButton(caption) {
  result = document.createElement("button");
  result.innerHTML = caption;
  result.setAttribute("type", "submit");

  return result;
}

function oxftCreateHeader(text) {
  let result = document.createElement("h2");
  result.innerHTML = text;

  return result;
}

function oxftCreateList(items, type='ul') {
  let result = document.createElement(type);
  for(let i = 0; i < items.length; i++) {
    let itemLI = document.createElement("li");
    itemLI.innerHTML = items[i];
    result.appendChild(itemLI);
  }

  return result;
}

function oxftCreateLabel(caption, forName) {
  const result = document.createElement("label");
  result.innerHTML = caption;
  result.setAttribute('for', forName);
  return result;
}

function oxftCreateInput(name, required=false) {
  let result = document.createElement("input");

  result.name = name;
  result.id = name;
  result.required = required;
 
  return result;
}

function oxftCreateTextInput(name, placeholder='', required=false) {
  let result = oxftCreateInput(name, required);
  result.type = 'text';
  if(placeholder) result.placeholder = placeholder;

  return result;
}

function oxftCreateNumberInput(name, placeholder='', required=false, min, max) {
  let result = oxftCreateInput(name, required);
  result.type = 'number';
  if(placeholder) result.placeholder = placeholder;
  if(min) result.min = min;
  if(max) result.max = max;

  return result;
}

function oxftAddRadioInputs(element, name, required, options) {
  for(i = 0; i < options.length; i++) {
    let optionInput = oxftCreateInput(name, required);
    optionInput.type = 'radio';
    optionInput.value = options[i].value;
    optionInput.id = options[i].id;
    element.appendChild(optionInput);

    let optionLabel = oxftCreateLabel(options[i].label, options[i].id);
    element.appendChild(optionLabel);
  }
}

function oxftCreateField(item) {
  let result = document.createElement("li");

  let inpName = 'inp_' + item.name;
  let label = item.label;
  let placeholder = item.placeholder;
  let required = item.required;
  if(required) placeholder = placeholder + ' (обязательно)';

  result.appendChild(oxftCreateLabel(label, inpName));

  if(item.type == 'text') {
    result.appendChild(oxftCreateTextInput(inpName, placeholder, required));
  } 
  else if (item.type == 'number') {
    result.appendChild(oxftCreateNumberInput(inpName, placeholder, required, item.min, item.max));
  }
  else if (item.type == 'radio') {
    oxftAddRadioInputs(result, inpName, required, item.options)
  }

  return result;
}

function oxftCreateFields(items) {
  const result = oxftCreateList([]);
  for(let i = 0; i < items.length; i++) {
    result.appendChild(oxftCreateField(items[i]));
  }
  return result;
}

function oxftSubmitUserInfo(event) {
  oxftUserInfo.firstname = document.getElementById('inp_firstname').value;
  oxftUserInfo.lastname = document.getElementById('inp_lastname').value;
  oxftUserInfo.age = document.getElementById('inp_age').value;
  oxftUserInfo.occupation = document.getElementById('inp_occupation').value;
  let sexInputs = document.getElementsByName('inp_sex');
  for(let i = 0; i < sexInputs.length; i++) {
    if(sexInputs[i].checked)
      oxftUserInfo.sex = sexInputs[i].value;
  }

  oxftUserInfoElement.style.display = 'none';

  event.preventDefault();
}

function oxftCreateUserInfoForm(element) {
  const oxftForm = document.createElement("form");

  oxftForm.appendChild(oxftCreateHeader(oxftUserInfoForm.caption));
  oxftForm.appendChild(oxftCreateFields(oxftUserInfoForm.questions));
  oxftForm.appendChild(oxftCreateButton('Далее'));
  oxftForm.addEventListener('submit', oxftSubmitUserInfo);

  element.appendChild(oxftForm);
}

function oxftSubmitInstruction(event) {
  oxftInstructionElement.style.display = 'none';

  event.preventDefault();
}

function oxftCreateInstruction(element) {
  const oxftForm = document.createElement("form");

  oxftForm.appendChild(oxftCreateHeader(oxftInstructionJSON.title));
  oxftForm.appendChild(oxftCreateList(oxftInstructionJSON.instructions, 'ol'));
  oxftForm.appendChild(oxftCreateButton('Далее'));

  oxftForm.addEventListener('submit', oxftSubmitInstruction);

  element.appendChild(oxftForm);
}

function oxftCreateQuestion(name) {
  const result = document.createElement("div");
  const textDiv = document.createElement("div");
  textDiv.id = 'divText_' + name;
  textDiv.className = ofxtQuestionStyle;
  result.appendChild(textDiv);

  const answerDiv = document.createElement("div");
  answerDiv.id = 'divAnswer_' + name;


  choice = {
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

  answerDiv.appendChild(oxftCreateField(choice));

  capacityInput = oxftCreateInput('capacity');
  capacityInput.type = 'hidden';
  capacityInput.id = 'capacity_' + name;

  answerDiv.appendChild(capacityInput);

  result.appendChild(answerDiv);
  return result;
}

function oxftSubmitQuestionsForm(event) {
  event.preventDefault();
}


function oxftCreateQuestionsForm(element) {
  const oxftForm = document.createElement("form");

  for(let i = 0; i < oxftPageSize; i++) {
    let questionDiv = oxftCreateQuestion(i);
    oxftForm.appendChild(questionDiv);
  }
 
  oxftForm.appendChild(oxftCreateButton('Далее'));

  oxftForm.addEventListener('submit', oxftSubmitQuestionsForm);

  element.appendChild(oxftForm);
}

function oxftFillQuestionsForm(page) {
  for(let i = 0; i < oxftPageSize; i++){
    let question = oxftQuestions[page * oxftPageSize + i];
    document.getElementById("divText_" + i).innerHTML = question.Num + '.&nbsp;' + question.Question;
    document.getElementById('yes_' + i).setAttribute('value', question.Values.Yes);
    document.getElementById('unknown_' + i).setAttribute('value', question.Values.Unknown);
    document.getElementById('no_' + i).setAttribute('value', question.Values.No);
    document.getElementById('capacity_' + i).setAttribute('value', question.Capacity);
  }
}


function oxftStartTest(elemInstr, elemUserInfo, elemQuestion, elemResults) {
  oxftInstructionElement = elemInstr;
  oxftInstructionElement.style.display = 'block';
  oxftCreateInstruction(oxftInstructionElement);

  oxftUserInfoElement = elemUserInfo;
  oxftCreateUserInfoForm(oxftUserInfoElement);
  oxftUserInfoElement.style.display = 'block';

  oxftQuestionElement = elemQuestion;
  oxftCreateQuestionsForm(oxftQuestionElement);
  oxftQuestionElement.style.display = 'block';

  oxftResultsElement = elemResults;
  oxftResultsElement.style.display = 'none';

  oxftLoadQuestions(oxftQuestionsJSON);

}