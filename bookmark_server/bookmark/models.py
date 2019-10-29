from django.db import models
from user.models import User
from tag.models import Tag
from collection.models import Collection

# Create your models here.

class BookMark(models.Model):
    link = models.CharField(max_length=2048, verbose_name='链接')
    title = models.CharField(max_length=600, verbose_name='标题')
    description = models.TextField(verbose_name='描述')
    tag = models.ManyToManyField(Tag, verbose_name='标签')
    collection = models.ManyToManyField(Collection, verbose_name='收藏集')
    collector = models.ForeignKey(User, on_delete=models.CASCADE,
                                  verbose_name='创建者')
    created_time = models.DateTimeField(auto_now_add=True, verbose_name='创建时间')
    updated_time = models.DateTimeField(auto_now=True, verbose_name='更新时间')

    class Meta:
        db_table = 'bookmark'











