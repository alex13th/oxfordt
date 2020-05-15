import json

input_file = "data/questions.json"

with open(input_file, "r", encoding="utf-8") as inputfile:
    questions = json.loads(inputfile.read())
    print(questions)