from django.db import models

class Project(models.Model):
    """
    Represents a project. Each project has a unique name.
    """
    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return f"Project: {self.name}, ID: {self.id}"


class GraphFile(models.Model):
    """
    Represents a graph file associated with a project.
    """
    project = models.OneToOneField(Project, on_delete=models.CASCADE)
    file_type = models.CharField(max_length=255)
    file_path = models.FileField(upload_to='projects_files/')
    last_uploaded = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Graph File: {self.file_type} (Project: {self.project.name})"


class Folder(models.Model):
    """
    Represents a folder belonging to a project.
    """
    CUSTOM = "custom"
    FAVORITE = "favorite"
    QUERY_TYPE_CHOICES = [
        (CUSTOM, "Custom"),
        (FAVORITE, "Favorite")
    ]

    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    type = models.CharField(max_length=255, choices=QUERY_TYPE_CHOICES)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['project', 'name', 'type'], name='unique_folder_constraint')
        ]

    def __str__(self):
        return f"Folder: {self.name} for {self.type} queries (Project: {self.project.name})"


class CustomQuery(models.Model):
    """
    Represents a custom query belonging to a project.
    """
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    folder = models.ForeignKey(
        Folder, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=255)
    cypher_query = models.TextField()
    natural_language_query = models.TextField()

    def __str__(self):
        return f"Custom Query: {self.name} (Project: {self.project.name})"


class FavoriteQuery(models.Model):
    """
    Represents a favorite query belonging to a project.
    """
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    folder = models.ForeignKey(
        Folder, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=255)
    cypher_query = models.TextField()
    natural_language_query = models.TextField()

    def __str__(self):
        return f"Favorite Query: {self.name} (Project: {self.project.name})"


class Result(models.Model):
    """
    Represents a result of a favorite query.
    """
    query = models.OneToOneField(FavoriteQuery, on_delete=models.CASCADE)
    result_type = models.CharField(max_length=255)
    file_path = models.FileField(upload_to='favorite_queries_results/')
    last_generated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Result: {self.result_type} (Query: {self.query.favorite_query_name})"


class DefaultQuery(models.Model):
    """
    Represents a default query.
    """
    name = models.CharField(max_length=255)
    cypher_query = models.TextField()
    natural_language_query = models.TextField()

    def __str__(self):
        return f"Default Query: {self.name}"
