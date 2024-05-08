from django.http import FileResponse, JsonResponse
from .neo4j_services import Neo4jService
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from django.core.files.storage import default_storage
import os
import json

# Initialize Neo4j connection
neo4j_service = Neo4jService('bolt://localhost:7687', 'admin', 'password')

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