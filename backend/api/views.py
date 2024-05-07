from django.http import FileResponse, JsonResponse
from .neo4j_services import Neo4jService
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from django.core.files.storage import default_storage
import os
import json

# Initialize Neo4j connection
neo4j_service = Neo4jService('bolt://localhost:7687', 'neo4j', 'cobra-paprika-nylon-conan-tobacco-2599')

# @csrf_exempt
# def save_file(request):
#     if request.method == 'POST':
#         json_file = request.FILES.get('json_file')
#         if json_file:
#             file_path = os.path.join(settings.BASE_DIR, 'backend', 'api', 'downloads', json_file.name)
#             if not os.path.exists(os.path.dirname(file_path)):
#                 try:
#                     os.makedirs(os.path.dirname(file_path))
#                 except OSError as exc:  # Guard against race condition
#                     if exc.errno != errno.EEXIST:
#                         raise
#             with open(file_path, 'wb+') as destination:
#                 for chunk in json_file.chunks():
#                     destination.write(chunk)
#             return JsonResponse({'status': 'success'})
#         else:
#             return JsonResponse({'status': 'error', 'error': 'No file uploaded'})
#     else:
#         return JsonResponse({'status': 'error', 'error': 'Invalid request method'})

def upload_file(request):
    if request.method == 'POST':
        file = request.FILES['file']
        file_name = default_storage.save(file.name, file)
        return JsonResponse({'file_name': file_name})

@csrf_exempt # THIS SHIT IS THE GOAT (FIXED HTTP ERROR 403)
def download_file(request):
    if request.method == 'POST' and request.FILES.get('json_file'):
        uploaded_file = request.FILES['json_file']
        file_name = uploaded_file.name
        current_dir = os.path.dirname(os.path.realpath(__file__))
        file_path = os.path.join(current_dir, '..', 'api', 'downloads', file_name)
        file_path = os.path.normpath(file_path)  # Normalize the path, resolve any '..'
        if not os.path.exists(os.path.dirname(file_path)):
            try:
                os.makedirs(os.path.dirname(file_path))
            except OSError as exc:  # Guard against race condition
                if exc.errno != errno.EEXIST:
                    raise
        with open(file_path, 'wb') as destination:
            for chunk in uploaded_file.chunks():
                destination.write(chunk)
        return FileResponse(open(file_path, 'rb'))
    else:
        return JsonResponse({'status': 'error', 'error': 'Invalid request'}, status=400)