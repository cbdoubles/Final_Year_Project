from django.db import models

class Project(models.Model):
    """
    Represents a project. Each project has a uiniqe name.
    """
    project_name = models.CharField(max_length=255)

    def __str__(self):
        return f"Project: {self.project_name}, ID: {self.id}"

class FavoriteQuery(models.Model):
    """
    Represents a favorite query belonging to a project.
    """
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    favorite_query_name = models.CharField(max_length=255)
    cypher_query = models.TextField()
    natural_language_query = models.TextField()

    def __str__(self):
        return f"Favorite Query: {self.favorite_query_name} (Project: {self.project.project_name})"


class CustomQuery(models.Model):
    """
    Represents a custom query belonging to a project.
    """
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    custom_query_name = models.CharField(max_length=255)
    cypher_query = models.TextField()
    natural_language_query = models.TextField()

    def __str__(self):
        return f"Custom Query: {self.custom_query_name} (Project: {self.project.project_name})"


class DefaultQuery(models.Model):
    """
    Represents a default query.
    """
    default_query_name = models.CharField(max_length=255)
    cypher_query = models.TextField()
    natural_language_query = models.TextField() 

    def __str__(self):
        return f"Default Query: {self.default_query_name}"


class GraphFile(models.Model):
    """
    Represents a graph file associated with a project.
    """
    project = models.OneToOneField(Project, on_delete=models.CASCADE)
    file_type = models.CharField(max_length=255)
    file_path = models.CharField(max_length=255)
    last_uploaded = models.DateTimeField()

    def __str__(self):
        return f"Graph File: {self.file_type} (Project: {self.project.project_name})"


class Result(models.Model):
    """
    Represents a result of a favorite query.
    """
    query = models.OneToOneField(FavoriteQuery, on_delete=models.CASCADE)
    result_type = models.CharField(max_length=255)
    file_path = models.CharField(max_length=255)
    last_generated = models.DateTimeField()

    def __str__(self):
        return f"Result: {self.result_type} (Query: {self.query.favorite_query_name})"
