from django.db import models

# Create your models here.
class User(models.Model):
    username = models.CharField(max_length=90, verbose_name='用户名', unique=True)
    password = models.CharField(max_length=32, verbose_name='密码')
    email = models.EmailField()
    avatar = models.ImageField(upload_to='avatar/', null=True,
                               default='ali.jpeg')
    created_time = models.DateTimeField(auto_now_add=True)
    updated_time = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'user'














