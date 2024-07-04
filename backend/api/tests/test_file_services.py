import os
import pytest
from unittest.mock import patch, Mock, MagicMock, mock_open
from ..file_services import FileService

@patch('os.getenv')
@patch('neo4j.GraphDatabase.driver')
def test_init(mock_driver, mock_getenv):
    mock_getenv.side_effect = lambda key: 'test' if key in ['NEO4J_USER', 'NEO4J_PASSWORD'] else None
    fs = FileService()
    assert fs.neo4j_user == 'test'
    assert fs.neo4j_password == 'test'
    mock_driver.assert_called_once_with('bolt://localhost:7474', auth=('test', 'test'))
    fs.close()

def test_determine_file_format():
    fs = FileService()
    assert fs.determine_file_format('test.csv') == '.csv'
    assert fs.determine_file_format('test.json') == '.json'
    assert fs.determine_file_format('test.graphml') == '.graphml'
    assert fs.determine_file_format('test.TXT') == '.txt'
    fs.close()

@patch('os.remove')
def test_delete_file(mock_remove):
    fs = FileService()
    fs.delete_file('dummy_path')
    mock_remove.assert_called_once_with('dummy_path')
    fs.close()

@patch('os.remove')
def test_delete_file_not_found(mock_remove):
    fs = FileService()
    mock_remove.side_effect = FileNotFoundError
    fs.delete_file('dummy_path')
    mock_remove.assert_called_once_with('dummy_path')
    fs.close()

@patch('os.remove')
def test_delete_file_error(mock_remove):
    fs = FileService()
    mock_remove.side_effect = Exception('Error')
    fs.delete_file('dummy_path')
    mock_remove.assert_called_once_with('dummy_path')
    fs.close()

@patch('neo4j.GraphDatabase.driver')
def test_import_csv_data(mock_driver):
    fs = FileService()
    mock_tx = MagicMock()
    fs.import_csv_data(mock_tx, 'dummy_path.csv')
    mock_tx.run.assert_called_once_with("""
        CALL apoc.load.csv($csv_file_path) YIELD map
        CREATE (n:Data) SET n = map
        """, file_path='dummy_path.csv')
    fs.close()

@patch('neo4j.GraphDatabase.driver')
def test_import_json_data(mock_driver):
    fs = FileService()
    mock_tx = MagicMock()
    fs.import_json_data(mock_tx, 'dummy_path.json')
    mock_tx.run.assert_called_once_with("""
        CALL apoc.load.json($json_file_path) YIELD value
        UNWIND value.nodes AS node
        CREATE (n:Data) SET n = node.properties
        WITH value
        UNWIND value.edges AS edge
        MATCH (a:Data {id: edge.source}), (b:Data {id: edge.target})
        CREATE (a)-[:CONNECTS_TO]->(b)
        """, json_file_path='dummy_path.json')
    fs.close()

@patch('neo4j.GraphDatabase.driver')
def test_import_graphml_data(mock_driver):
    fs = FileService()
    mock_tx = MagicMock()
    fs.import_graphml_data(mock_tx, 'dummy_path.graphml')
    mock_tx.run.assert_called_once_with("CALL apoc.import.graphml($file_path, {})", file_path='dummy_path.graphml')
    fs.close()

@patch('neo4j.GraphDatabase.driver')
def test_set_project_id(mock_driver):
    fs = FileService()
    mock_tx = MagicMock()
    fs.set_project_id(mock_tx, 'test_project')
    mock_tx.run.assert_any_call("""
        MATCH (n) WHERE n.project_id IS NULL SET n.project_id = $project_id
        """, parameters={'project_id': 'test_project'})
    mock_tx.run.assert_any_call("""
        MATCH ()-[r]->() WHERE r.project_id IS NULL SET r.project_id = $project_id
        """, parameters={'project_id': 'test_project'})
    fs.close()

@patch('neo4j.GraphDatabase.driver')
def test_clear_db(mock_driver):
    fs = FileService()
    mock_tx = MagicMock()
    fs.clear_db(mock_tx, 'test_project')
    mock_tx.run.assert_called_once_with("""
        MATCH (n {project_id: $project_id}) DETACH DELETE n
        """, parameters={'project_id': 'test_project'})
    fs.close()

@patch('neo4j.GraphDatabase.driver')
def test_fix_labels(mock_driver):
    fs = FileService()
    mock_tx = MagicMock()
    mock_tx.run.return_value.single.return_value.get.return_value = ['Label']
    fs.fix_labels(mock_tx, 'test_project')
    mock_tx.run.assert_called_once_with("""
        MATCH (n {project_id: $project_id})
        RETURN labels(n) AS labels LIMIT 1
        """, parameters={'project_id': 'test_project'})
    fs.close()

@patch('neo4j.GraphDatabase.driver')
def test_fix_labels_no_labels(mock_driver):
    fs = FileService()
    mock_tx = MagicMock()
    mock_tx.run.return_value.single.return_value.get.return_value = None
    fs.fix_labels(mock_tx, 'test_project')
    assert mock_tx.run.call_count == 2
    query_fix_labels = """
            MATCH (n {project_id: $project_id})
            WITH n, properties(n).labels AS nodeLabels, apoc.map.removeKey(properties(n), 'labels') AS newProps
            SET n = newProps
            WITH n, nodeLabels, newProps
            UNWIND nodeLabels AS label
            CALL apoc.create.addLabels(elementId(n), [label]) YIELD node
            WITH node, newProps
            SET node = newProps
            RETURN collect({data: {id: elementId(node), label: labels(node), properties: properties(node)}}) AS nodes
            """
    mock_tx.run.assert_called_with(query_fix_labels, parameters={'project_id': 'test_project'})

@patch('neo4j.GraphDatabase.driver')
@patch('os.path.join')
@patch('os.path.normpath')
@patch('django.conf.settings.MEDIA_ROOT', 'dummy_media_root')
@patch('builtins.open', new_callable=mock_open)
def test_modify_file_csv(mock_open, mock_normpath, mock_join, mock_driver):
    fs = FileService()
    mock_file_data = Mock()
    mock_file_data.name = 'dummy_file.csv'
    mock_file_data.chunks.return_value = [b'data']
    mock_join.return_value = 'dummy_path/dummy_file.csv'
    mock_normpath.return_value = 'dummy_path/dummy_file.csv'

    with patch.object(fs, 'delete_file') as mock_delete_file, \
         patch.object(fs, 'determine_file_format') as mock_determine_file_format:

        mock_session = MagicMock()
        mock_driver_instance = mock_driver.return_value
        mock_driver_instance.session.return_value.__enter__.return_value = mock_session
        mock_determine_file_format.return_value = '.csv'

        fs.modify_file('test_project', mock_file_data, reupload=True)

        mock_determine_file_format.assert_called_once_with('dummy_path/dummy_file.csv')
        mock_session.execute_write.assert_any_call(fs.clear_db, 'test_project')
        mock_session.execute_write.assert_any_call(fs.import_csv_data, 'file:///dummy_path/dummy_file.csv')
        mock_delete_file.assert_called_once_with('dummy_path/dummy_file.csv')
        mock_session.execute_write.assert_any_call(fs.set_project_id, 'test_project')
        mock_session.execute_write.assert_any_call(fs.fix_labels, 'test_project')

    fs.close()


@patch('neo4j.GraphDatabase.driver')
@patch('os.path.join')
@patch('os.path.normpath')
@patch('django.conf.settings.MEDIA_ROOT', 'dummy_media_root')
@patch('builtins.open', new_callable=mock_open)
def test_modify_file_json(mock_open, mock_normpath, mock_join, mock_driver):
    fs = FileService()
    mock_file_data = Mock()
    mock_file_data.name = 'dummy_file.json'
    mock_file_data.chunks.return_value = [b'data']
    mock_join.return_value = 'dummy_path/dummy_file.json'
    mock_normpath.return_value = 'dummy_path/dummy_file.json'

    with patch.object(fs, 'delete_file') as mock_delete_file, \
         patch.object(fs, 'determine_file_format') as mock_determine_file_format:

        mock_session = MagicMock()
        mock_driver_instance = mock_driver.return_value
        mock_driver_instance.session.return_value.__enter__.return_value = mock_session
        mock_determine_file_format.return_value = '.json'

        fs.modify_file('test_project', mock_file_data, reupload=True)

        mock_determine_file_format.assert_called_once_with('dummy_path/dummy_file.json')
        mock_session.execute_write.assert_any_call(fs.clear_db, 'test_project')
        mock_session.execute_write.assert_any_call(fs.import_json_data, 'file:///dummy_path/dummy_file.json')
        mock_delete_file.assert_called_once_with('dummy_path/dummy_file.json')
        mock_session.execute_write.assert_any_call(fs.set_project_id, 'test_project')
        mock_session.execute_write.assert_any_call(fs.fix_labels, 'test_project')

    fs.close()

@patch('neo4j.GraphDatabase.driver')
@patch('os.path.join')
@patch('os.path.normpath')
@patch('django.conf.settings.MEDIA_ROOT', 'dummy_media_root')
@patch('builtins.open', new_callable=mock_open)
def test_modify_file_graphml(mock_open, mock_normpath, mock_join, mock_driver):
    fs = FileService()
    mock_file_data = Mock()
    mock_file_data.name = 'dummy_file.graphml'
    mock_file_data.chunks.return_value = [b'data']
    mock_join.return_value = 'dummy_path/dummy_file.graphml'
    mock_normpath.return_value = 'dummy_path/dummy_file.graphml'

    with patch.object(fs, 'delete_file') as mock_delete_file, \
         patch.object(fs, 'determine_file_format') as mock_determine_file_format:

        mock_session = MagicMock()
        mock_driver_instance = mock_driver.return_value
        mock_driver_instance.session.return_value.__enter__.return_value = mock_session
        mock_determine_file_format.return_value = '.graphml'

        fs.modify_file('test_project', mock_file_data, reupload=True)

        mock_determine_file_format.assert_called_once_with('dummy_path/dummy_file.graphml')
        mock_session.execute_write.assert_any_call(fs.clear_db, 'test_project')
        mock_session.execute_write.assert_any_call(fs.import_graphml_data, 'file:///dummy_path/dummy_file.graphml')
        mock_delete_file.assert_called_once_with('dummy_path/dummy_file.graphml')
        mock_session.execute_write.assert_any_call(fs.set_project_id, 'test_project')
        mock_session.execute_write.assert_any_call(fs.fix_labels, 'test_project')

    fs.close()

@patch('neo4j.GraphDatabase.driver')
@patch('os.path.join')
@patch('os.path.normpath')
@patch('django.conf.settings.MEDIA_ROOT', 'dummy_media_root')
@patch('builtins.open', new_callable=mock_open)
def test_modify_file_error_modifying_file(mock_open, mock_normpath, mock_join, mock_driver):
    fs = FileService()
    mock_file_data = Mock()
    mock_file_data.name = 'dummy_file.csv'
    mock_file_data.chunks.side_effect = Exception("Error reading file")

    mock_join.return_value = 'dummy_path/dummy_file.csv'

    fs.modify_file('test_project', mock_file_data, reupload=True)

    mock_open.assert_called_once_with('dummy_path/dummy_file.csv', 'wb+')

@patch('neo4j.GraphDatabase.driver')
@patch('os.path.join')
@patch('os.path.normpath')
@patch('django.conf.settings.MEDIA_ROOT', 'dummy_media_root')
@patch('builtins.open', new_callable=mock_open)
def test_modify_file_unsupported_format(mock_open, mock_normpath, mock_join, mock_driver):
    fs = FileService()
    mock_file_data = Mock()
    mock_file_data.name = 'dummy_file.txt'
    mock_file_data.chunks.return_value = [b'data']
    mock_join.return_value = 'dummy_path/dummy_file.txt'
    mock_normpath.return_value = 'dummy_path/dummy_file.txt'

    with patch.object(fs, 'determine_file_format') as mock_determine_file_format:
        mock_determine_file_format.return_value = '.txt'

        fs.modify_file('test_project', mock_file_data, reupload=True)

        mock_open.assert_called_once_with('dummy_path/dummy_file.txt', 'wb+')
        mock_determine_file_format.assert_called_once_with('dummy_path/dummy_file.txt')

@patch('neo4j.GraphDatabase.driver')
@patch('os.path.join')
@patch('os.path.normpath')
@patch('django.conf.settings.MEDIA_ROOT', 'dummy_media_root')
@patch('builtins.open', new_callable=mock_open)
def test_modify_file_error_reuploading_data(mock_open, mock_normpath, mock_join, mock_driver):
    fs = FileService()
    mock_file_data = Mock()
    mock_file_data.name = 'dummy_file.csv'
    mock_file_data.chunks.return_value = [b'data']
    mock_join.return_value = 'dummy_path/dummy_file.csv'
    mock_normpath.return_value = 'dummy_path/dummy_file.csv'

    with patch.object(fs, 'delete_file') as mock_delete_file, \
         patch.object(fs, 'determine_file_format') as mock_determine_file_format:

        mock_session = MagicMock()
        mock_driver_instance = mock_driver.return_value
        mock_driver_instance.session.return_value.__enter__.return_value = mock_session
        mock_determine_file_format.return_value = '.csv'
        mock_session.execute_write.side_effect = [None, Exception("Error reuploading data")]

        fs.modify_file('test_project', mock_file_data, reupload=True)

        mock_open.assert_called_once_with('dummy_path/dummy_file.csv', 'wb+')
        mock_delete_file.assert_called_once_with('dummy_path/dummy_file.csv')

@patch('neo4j.GraphDatabase.driver')
@patch('os.path.join')
@patch('os.path.normpath')
@patch('django.conf.settings.MEDIA_ROOT', 'dummy_media_root')
@patch('builtins.open', new_callable=mock_open)
def test_modify_file_neo4j_error(mock_open, mock_normpath, mock_join, mock_driver):
    fs = FileService()
    mock_file_data = Mock()
    mock_file_data.name = 'dummy_file.csv'
    mock_file_data.chunks.return_value = [b'data']
    mock_join.return_value = 'dummy_path/dummy_file.csv'
    mock_normpath.return_value = 'dummy_path/dummy_file.csv'

    with patch.object(fs, 'delete_file') as mock_delete_file, \
         patch.object(fs, 'determine_file_format') as mock_determine_file_format:

        mock_session = MagicMock()
        mock_driver_instance = mock_driver.return_value
        mock_driver_instance.session.return_value.__enter__.return_value = mock_session
        mock_determine_file_format.return_value = '.csv'
        mock_session.execute_write.side_effect = Exception("Neo4j transaction error")

        fs.modify_file('test_project', mock_file_data, reupload=True)

        mock_open.assert_called_once_with('dummy_path/dummy_file.csv', 'wb+')
        mock_delete_file.assert_called_once_with('dummy_path/dummy_file.csv')