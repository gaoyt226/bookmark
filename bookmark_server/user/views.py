from django.http import JsonResponse
import json, jwt, datetime
from hashlib import md5
from .models import User
from tools.bmtoken import check_login
from collection.models import Collection

# Create your views here.

def user_view(request):
    # 注册
    if request.method == 'POST':
        json_str = request.body
        if not json_str:
            res = {'code': 10100, 'error': 'request body empty'}
            return JsonResponse(res)

        try:
            json_obj = json.loads(json_str)
        except Exception as e:
            print('--json_str error--', e)
            res = {'code': 10101, 'error': 'data type not json'}
            return JsonResponse(res)

        username = json_obj.get('username', '')
        email = json_obj.get('email', '')
        password = json_obj.get('password', '')
        if not username:
            res = {'code': 10102, 'error': 'username empty'}
            return JsonResponse(res)
        if not email:
            res = {'code': 10103, 'error': 'email empty'}
            return JsonResponse(res)
        if not password:
            res = {'code': 10104, 'error': 'password empty'}
            return JsonResponse(res)

        p_m = md5()
        p_m.update(password.encode())
        password = p_m.hexdigest()

        try:
            user = User.objects.create(
                username=username,
                email=email,
                password=password,
            )
        except Exception as e:
            print('--mysql create error--', e)
            res = {'code': 10105, 'error': 'username already existed'}
            return JsonResponse(res)

        # （用户注册时自动为其创建一个初始收藏集）
        my_collection = Collection.objects.create(
            name='我的收藏', description='默认收藏集', creator=user
        )


        # avatar = str(user.avatar)
        login_time = datetime.datetime.now()
        # 生成token
        token = make_token(username, login_time)
        res = {
            "code": 200,
            "data": {
                "token": token.decode()
            }
        }
        return JsonResponse(res)


# 登录
def login_view(request):
    if request.method == 'POST':
        data_json = request.body
        data = json.loads(data_json)

        username = data.get('username', '')
        password = data.get('password', '')

        try:
            user = User.objects.get(username=username)
        except Exception as e:
            print('--mysql get error--', e)
            res = {'code': 20101, 'error': 'user not exist'}
            return JsonResponse(res)

        pm = md5()
        pm.update(password.encode())
        password = pm.hexdigest()
        if password != user.password:
            res = {'code': 20102, 'error': 'password error'}
            return JsonResponse(res)

        login_time = datetime.datetime.now()
        # 生成token
        token = make_token(username, login_time)
        res = {
            "code": 200,
            "data": {
                "token": token.decode()
            }
        }
        return JsonResponse(res)




# 查询用户信息
@check_login
def info_view(request):
    if request.method == 'GET':
        username = request.user.username
        avatar = request.user.avatar
        res = {
            'code': 200,
            'username': username,
            'avatar': str(avatar)
        }
        return JsonResponse(res)


# 生成token
def make_token(username, login_time, expire=3600 * 24):
    key = 'shiji'
    now_t = int(login_time.timestamp())

    payload = {
        'username': username,
        'exp': now_t + expire,
        'login_time': now_t
    }

    return jwt.encode(payload, key, algorithm='HS256')














