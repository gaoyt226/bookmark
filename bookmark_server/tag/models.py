from django.db import models
from user.models import User

# Create your models here.

class Tag(models.Model):
    name = models.CharField(max_length=200, verbose_name='标签名')
    creator = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        db_table = 'tag'










