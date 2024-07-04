import pytest
from django.db.utils import IntegrityError
from django.core.exceptions import ValidationError
from ..models import Project, Folder
from ..serializers import ProjectSerializer

@pytest.mark.django_db
def test_project_serializer_create():
    serializer = ProjectSerializer()

    # Create a project with valid data
    project_data = {
        'name': 'Test Project',
        'file_name': 'test_file.txt',
    }
    created_project = serializer.create(project_data)

    # Check if project is created correctly
    assert Project.objects.filter(name='Test Project').exists()
    assert created_project.name == 'Test Project'
    assert created_project.file_name == 'test_file.txt'

    # Check if default folders are created for the project
    assert Folder.objects.filter(project=created_project, name='Project Custom Queries', type='Custom').exists()
    assert Folder.objects.filter(project=created_project, name='Project Favorite Queries', type='Favorite').exists()

@pytest.mark.django_db
def test_project_serializer_validation():
    serializer = ProjectSerializer()
    invalid_data = {'name': '', 'file_name': 'invalid_file.txt'}  # Invalid because name is empty
    
    # Attempt to validate the serializer with invalid data
    with pytest.raises(ValidationError):
        serializer.validate(invalid_data)


@pytest.mark.django_db
def test_project_serializer_unique_constraint():
    serializer = ProjectSerializer()

    # Create a project
    project_data = {
        'name': 'Unique Project',
        'file_name': 'unique_project.txt',
    }
    serializer.create(project_data)

    # Try to create another project with the same name (should raise IntegrityError)
    project_data_duplicate = {
        'name': 'Unique Project',
        'file_name': 'another_unique_project.txt',
    }
    with pytest.raises(IntegrityError):
        serializer.create(project_data_duplicate)

def test_folder_str_representation():
    project = Project(name='Test Project', file_name='test_file.txt')
    folder = Folder(project=project, name='Test Folder', type=Folder.CUSTOM)
    assert str(folder) == f'Folder: Test Folder for Custom queries (Project: Test Project)'

@pytest.mark.django_db
def test_folder_unique_constraint():
    project = Project.objects.create(name='Test Project', file_name='test_file.txt')
    Folder.objects.create(project=project, name='Unique Folder', type=Folder.CUSTOM)
    with pytest.raises(IntegrityError):
        Folder.objects.create(project=project, name='Unique Folder', type=Folder.CUSTOM)

def test_project_serializer_validation():
    serializer = ProjectSerializer()
    invalid_data = {'name': '', 'file_name': 'invalid_file.txt'}  # Invalid because name is empty
    with pytest.raises(ValidationError):
        serializer.validate(invalid_data)

@pytest.mark.django_db
def test_project_update():
    project = Project.objects.create(name='Existing Project', file_name='existing_file.txt')
    serializer = ProjectSerializer(instance=project)
    updated_data = {'name': 'Updated Project', 'file_name': 'updated_file.txt'}
    updated_project = serializer.update(project, updated_data)

    assert updated_project.name == 'Updated Project'
    assert updated_project.file_name == 'updated_file.txt'

@pytest.mark.django_db
def test_project_creation_with_default_folders():
    serializer = ProjectSerializer()
    validated_data = {'name': 'Test Project', 'file_name': 'test_file.txt'}
    project = serializer.create(validated_data)
    
    assert project.name == 'Test Project'
    assert project.file_name == 'test_file.txt'
    assert project.pk is not None

    # Check if default folders are created
    custom_folder = Folder.objects.get(project=project, type=Folder.CUSTOM)
    favorite_folder = Folder.objects.get(project=project, type=Folder.FAVORITE)

    assert custom_folder.name == 'Project Custom Queries'
    assert favorite_folder.name == 'Project Favorite Queries'
