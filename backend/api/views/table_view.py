from django.http import JsonResponse
import json

# url: http://localhost:8000/my-json-endpoint/


def json_view(url):
    # change with the path where your json file is located
    file_path = 'path/to/your/file.json'
    with open(file_path, 'r') as file:
        data = json.load(file)

    return JsonResponse(data)
