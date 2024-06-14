from django.db import models

# OLD MODEL


class Query(models.Model):
    cypher_query = models.TextField()
    natural_query = models.TextField()
    # if you want to store the graph as a text file, we can do binary as well
    graph = models.TextField()

    def __str__(self):
        return self.cypher_query

# NEW MODEL


class Project(models.Model):
    """
    Represents a project. Each project has a unique name.
    """
    name = models.CharField(max_length=255, unique=True)
    file_name = models.CharField(max_length=255)

    def __str__(self):
        return f"Project: {self.name}, ID: {self.id}, File Name: {self.file_name}"


class Folder(models.Model):
    """
    Represents a folder belonging to a project.
    """
    CUSTOM = "Custom"
    FAVORITE = "Favorite"
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
        Folder, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    cypher_query = models.TextField()
    natural_language_query = models.TextField()

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['name', 'folder'], name='unique_custom_query_name_constraint')
        ]

    def __str__(self):
        return f"Custom Query: {self.name} (Project: {self.project.name})"


class FavoriteQuery(models.Model):
    """
    Represents a favorite query belonging to a project.
    """
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    folder = models.ForeignKey(
        Folder, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    cypher_query = models.TextField()
    natural_language_query = models.TextField()

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['name', 'folder'], name='unique_favorite_query_name_constraint')
        ]

    def __str__(self):
        return f"Favorite Query: {self.name} (Project: {self.project.name})"


class DefaultQuery(models.Model):
    """
    Represents a default query.
    """
    name = models.CharField(max_length=255)
    cypher_query = models.TextField()
    natural_language_query = models.TextField()

    def __str__(self):
        return f"Default Query: {self.name}"
