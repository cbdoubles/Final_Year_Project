import pytest
from django.apps import apps
from ..apps import ApiConfig

def test_app_config():
    assert ApiConfig.name == 'api'
    assert apps.get_app_config('api').name == 'api'
