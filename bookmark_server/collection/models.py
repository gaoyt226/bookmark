from django.db import models
from user.models import User

# Create your models here.

class Collection(models.Model):
    name = models.CharField(max_length=200, verbose_name='收藏集名')
    description = models.TextField(verbose_name='描述')
    creator = models.ForeignKey(User, on_delete=models.CASCADE,
                                verbose_name='创建者')
    created_time = models.DateTimeField(auto_now_add=True, verbose_name='创建时间')
    updated_time = models.DateTimeField(auto_now=True, verbose_name='更新时间')

    class Meta:
        db_table = 'collection'








