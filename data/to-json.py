import csv
import json


def get_question(row):
    result = {"Num": row[0], 
        "Values": {
            "Yes": row[1],
            "Unknown": row[2],
            "No": row[3]},
        "Capacity": row[4],
        "Question": row[5]}
    return result


def get_zone(row):
    result = {"zone": row[0], 
        "range": {
            "min": row[1],
            "max": row[2]}
            }
    return result


def get_array_from_csv(file_name, json_file, func, skip_header):
    result = []
    with open(file_name) as csvfile:
        reader = csv.reader(csvfile)
        if skip_header:
            reader.__next__()
        for row in reader:
            result.append(func(row))

    with open(json_file, "w") as f:
        f.write(json.dumps(result, ensure_ascii=False))

    return result

def get_rating_from_csv(file_name, json_file, skip_header):
    result = {"A": {},"B": {}, "C": {}, "D": {}, "E": {}, "F": {},
        "G": {}, "H": {}, "I": {}, "J": {}}
    with open(file_name) as csvfile:
        reader = csv.reader(csvfile)
        if skip_header:
            reader.__next__()
        for row in reader:
            result[row[2].strip()][row[0].strip()] = row[1]

    with open(json_file, "w") as f:
        f.write(json.dumps(result, ensure_ascii=False))

    return result



if __name__ == "__main__":
    csv_file = "data/questions.csv"
    json_file = "data/questions.json"
    get_array_from_csv(csv_file, json_file, get_question, skip_header=True)


    csv_file = "data/zones.csv"
    json_file = "data/zones.json"
    get_array_from_csv(csv_file, json_file, get_zone, skip_header=True)

    get_rating_from_csv("data/women.csv", "data/women.json", skip_header=False)
    get_rating_from_csv("data/men.csv", "data/men.json", skip_header=False)
    get_rating_from_csv("data/girls.csv", "data/girls.json", skip_header=False)
    get_rating_from_csv("data/boys.csv", "data/boys.json", skip_header=False)
