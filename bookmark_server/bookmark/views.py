from django.shortcuts import render
import requests
from lxml import etree
from django.http import JsonResponse, HttpResponse
from urllib import parse
import re
import json
import time
from tools.bmtoken import check_login
from .models import BookMark
from tag.models import Tag
from collection.models import Collection

# Create your views here.

@check_login
def bookmark_view(request):
    # 获取链接的详细信息
    if request.method == 'GET':

        link = request.GET.get('url')
        link = parse.unquote(link)

        if len(link) > 2048:
            res = HttpResponse()
            res.status_code = 414
            return res

        try:
            # 获取页面编码格式
            res = requests.get(
                url=link,
                headers = {'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) '
                                         'AppleWebKit/537.36 (KHTML, like Gecko) '
                                         'Chrome/73.0.3683.75 Safari/537.36'},
                timeout=5
            )
            ecd_html = res.text

            try:
                parsing_html = etree.HTML(ecd_html)
                chs_list_xp = parsing_html.xpath('//meta[1]/@charset')
                pattern = re.compile(r'charset=(.*?)"', re.S)
                chs_list_re = pattern.findall(ecd_html)

                if (not chs_list_xp) and (not chs_list_re):
                    res = {
                        'code': 30100,
                        'error': 'get no encoding'
                    }
                    return JsonResponse(res)

                ecd = 'utf-8'
                if chs_list_xp:
                    ecd = chs_list_xp[0].strip()
                if chs_list_re:
                    ecd = chs_list_re[0].strip()
            # xpath错误，因为不是html页面，是二进制的数据
            except Exception as e:
                print('--not html--', e)
                res = {
                    'code': 30102,
                    'error': 'not html'
                }
                return JsonResponse(res)


            # 请求页面
            res = requests.get(
                url=link,
                headers={'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) '
                                       'AppleWebKit/537.36 (KHTML, like Gecko) '
                                       'Chrome/73.0.3683.75 Safari/537.36'},
                timeout=5
            )
        # 请求超时
        except Exception as e:
            print('--get link detail timeout--', e)
            res = {
                'code': 30101,
                'error': 'request timeout'
            }
            return JsonResponse(res)

        # 响应的编码
        res.encoding = ecd
        html = res.text

        parsing_html = etree.HTML(html)
        title_list = parsing_html.xpath('//title/text()')
        if title_list:
            title = title_list[0].strip()
        else:
            title = ''
        description_list = parsing_html.xpath('//meta[@name="description"]/@content')
        if description_list:
            description = description_list[0].strip()
        else:
            description = ''
        res_json = {
            'code': '200',
            'data': {
                'title': title,
                'description': description,
            }
        }
        res_str = json.dumps(res_json, ensure_ascii=False)
        return HttpResponse(res_str)

    # 添加书签
    if request.method == 'POST':
        data_json = request.body
        data = json.loads(data_json)
        link = data.get('link', '')
        title = data.get('title', '')
        description = data.get('description', '')
        tags = data.get('tags', '')
        collection = data.get('collection', '')

        if not link:
            res = {'code': 50100, 'error': 'link empty'}
            return JsonResponse(res)
        if not title:
            res = {'code': 50101, 'error': 'title empty'}
            return JsonResponse(res)
        if not collection:
            res = {'code': 50102, 'error': 'collection empty'}
            return JsonResponse(res)

        # 将书签存入bookmark表中
        bookmark = BookMark.objects.create(
            link=link,
            title=title,
            description=description,
            collector=request.user
        )

        # 收藏集
        try:
            collection = Collection.objects.get(
                name=collection, creator=request.user)
        except Exception as e:
            print('collection not exist------', e)
            res = {'code': 50104, 'error': 'collection not exist'}
            return JsonResponse(res)
        collection.bookmark_set.add(bookmark)

        # 标签
        for t in tags:
            try:
                tag = Tag.objects.get(name=t, creator=request.user)
            except Exception as e:
                # 标签不存在
                print('tag not exist------', e)
                tag = Tag.objects.create(name=t, creator=request.user)
            tag.bookmark_set.add(bookmark)

        res = {
            'code': 200,
            'data': {
                'username': request.user.username,
                'created_time': bookmark.created_time
            }
        }
        return JsonResponse(res)


























