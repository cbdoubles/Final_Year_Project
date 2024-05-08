from django.db import models

# Create your models here.
class Query(models.Model):
    cypher_query = models.TextField()
    natural_query = models.TextField()
    graph = models.TextField()  # if you want to store the graph as a text file, we can do binary as well

    def __str__(self):
        return self.cypher_query