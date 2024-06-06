from .settings import *

# overrie the DB settings to use the actual DB when testing

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'querify_db_test',
        'USER': 'querify_remote',
        'PASSWORD': 'querifyrocks',
        'HOST': '145.220.75.94',
        'PORT': '3306',
        'TEST': {
            'NAME': 'querify_db_test',  # Use the actual database name
            'MIRROR': 'default',  # Use the same database configuration
        },
    }
}