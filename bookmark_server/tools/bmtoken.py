"""
    登录验证装饰器
"""

import jwt
from django.http import JsonResponse
from user.models import User

TOKEN_KEY = 'shiji'


def check_login(func):
    def wrapper(request, *args, **kwargs):

        token = request.META.get('HTTP_AUTHORIZATION')

        # 1. 检查token
        if not token:
            res = {
                'code': 40100,
                'error': 'no token'
            }
            return JsonResponse(res)
        try:
            result = jwt.decode(token, TOKEN_KEY)
        except Exception as e:
            print(e)
            res = {
                'code': 40101,
                'error': 'token error'
            }
            return JsonResponse(res)
        username = result['username']
        try:
            user = User.objects.get(username=username)
        except Exception as e:
            print(e)
            res = {
                'code': 40102,
                'error': 'user error'
            }
            return JsonResponse(res)
        request.user = user

        return func(request, *args, **kwargs)

    return wrapper
















