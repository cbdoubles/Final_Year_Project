import os
from django.conf import settings


def modify_file(project_id, file_data, reupload=False):
    # Save the file on the server
    file_path = os.path.join(settings.MEDIA_ROOT, file_data.name)
    with open(file_path, 'wb+') as destination:
        for chunk in file_data.chunks():
            destination.write(chunk)

    # You can add any additional file modification logic here @Nikola
    if reupload:
        print("Don't leave if empty -.-")
        # cal method to clea DB for the project id
