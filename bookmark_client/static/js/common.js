// ----创建Vue对象， 这个对象需要在id为“app-header”的元素加载完成后再创建------
function createVue() {
    vm = new Vue({
        el: '#app-header',
        data() {
            return {
                // 网址输入框
                ser_input: '',
                // 标题输入框
                input: '',
                // 对话框
                dialogFormVisible: false,
                // 表单
                form: {
                    name: '',
                    region: '',
                    date1: '',
                    date2: '',
                    delivery: false,
                    type: [],
                    resource: '',
                    desc: ''
                },
                // 选择器(基础)
                sel_options: [{
                    sel_label: '默认',
                    sel_options: [{
                        sel_value: 'Shanghai',
                        sel_label: '我的收藏'
                    }]
                  }, {
                    sel_label: '自定义',
                    sel_options: [{
                        sel_value: 'Chengdu',
                        sel_label: '色彩'
                    }, {
                        sel_value: 'Shenzhen',
                        sel_label: '编程'
                    }, {
                        sel_value: 'Guangzhou',
                        sel_label: '阅读'
                    }, {
                        sel_value: 'Dalian',
                        sel_label: '图像'
                    },{
                        sel_value: 'youxi',
                        sel_label: '游戏'
                      }]
                  }],
                  sel_value: '',
                // 描述文本框
                textarea1: '',
                // 标签选择器
                tag_options: [{
                    tag_value: 'HTML',
                    tag_label: 'HTML'
                  }, {
                    tag_value: 'CSS',
                    tag_label: 'CSS'
                  }, {
                    tag_value: 'JavaScript',
                    tag_label: 'JavaScript'
                  }],
                  tag_value: [],
                // 加载
                loading: false,
            }
        },
        methods:{
            // -------添加书签------------
            addBookMark: function (){
                var token = window.localStorage.getItem('bookmark_token');

                var link = vm.form.name.trim();
                var title = vm.input;
                var description = vm.textarea1;
                var tags = vm.tag_value;
                var collection = vm.sel_value;
            
                if(link == ''){
                    alert('请输入网址');
                    return;
                }
                if(link.indexOf('http://') < 0 && link.indexOf('https://') < 0){
                    link = 'http://' + link;
                }
                if(title == ''){
                    alert('请输入标题');
                    return;
                }
                if(vm.sel_value == ''){
                    collection = '我的收藏';
                }
                this.dialogFormVisible = false;

                var post_data = {
                    'link': link,
                    'title': title,
                    'description': description,
                    'tags': tags,
                    'collection': collection,
                }
            
                $.ajax({
                    type:"post",
                    url:"http://127.0.0.1:8000/api/v1/bookmarks",
                    contentType:"application/json",
                    dataType:"json",
                    data:JSON.stringify(post_data),
                    beforeSend: function(request) {
                        request.setRequestHeader("Authorization", token);
                    },
                    success:function (result) {
                        if (200 == result.code){
                            // username = result.username;
                            // avatar = result.avatar;
                            alert('成功')
                        }else if(30100 == result.code){
                            alert('请登录');
                        }
                    }
                });
            }
        }
    });
}

// -------关于头部 BEGIN---------
// 1. 是否显示头部
function showHeader(n) {
    var token = window.localStorage.getItem('bookmark_token');
    var username = '';
    var avatar = '';
    $.ajax({
        type:"get",
        url:"http://127.0.0.1:8000/api/v1/users/info",
        async: false,
        beforeSend: function(request) {
            request.setRequestHeader("Authorization", token);
        },
        success:function (result) {
            if (200 == result.code){
                username = result.username;
                avatar = result.avatar;
            }else{
                window.location.href = '/shiji/welcome';
            }
        }
    });
    return makeHeader(n, username, avatar);
}
// 2. 生成头部
function makeHeader(n, username, avatar) {
    var font_color1 = '#68BCDD';
    var font_color2 = '#68BCDD';
    var font_color3 = '#68BCDD';
    var font_size1 = '18px';
    var font_size2 = '18px';
    var font_size3 = '18px';
    switch(n) {
        case 1:
            font_color1 = '#209E85';
            font_size1 = '20px';
            break;
        case 2:
            font_color2 = '#209E85';
            font_size2 = '20px';
            break;
        case 3:
            font_color3 = '#209E85';
            font_size3 = '20px';
    }
    var font_style1 = 'style="color: ' + font_color1 + '; font-size: ' + font_size1 + ';"';
    var font_style2 = 'style="color: ' + font_color2 + '; font-size: ' + font_size2 + ';"';
    var font_style3 = 'style="color: ' + font_color3 + '; font-size: ' + font_size3 + ';"';
    var a1 = '<a href="http://127.0.0.1:5000/shiji/index" ' + font_style1 + '>首页</a>'
    var a2 = '<a href="http://127.0.0.1:5000/shiji/collections" ' + font_style2 + '>收藏集</a>'
    var a3 = '<a href="http://127.0.0.1:5000/shiji/tags" ' + font_style3 + '>标签</a>'

    var header = '';
    header += '<div id="line"></div>';
    header += '<div id="app-header">';
    header += '<el-row :gutter="20">';
    header += '<el-col :span="4">';
    header += '<div class="grid-content bg-purple">拾集</div>';
    header += '</el-col>';
    header += '<el-col :span="14">';
    header += '<div class="grid-content bg-purple">';
    header += '<el-input placeholder="搜索" v-model="ser_input">';
    header += '</el-input>';
    header += '<!-- 嵌套表单的对话框 -->';
    header += '<el-button type="text" @click="dialogFormVisible = true">';
    header += '<img src="../static/images/plus.png" alt="" id="plus" onclick="clearComponent()">';
    header += '</el-button>';
    header += '<el-dialog title="" :visible.sync="dialogFormVisible">';
    header += '<el-form :model="form" @submit.native.prevent>';
    header += '<el-input v-model="form.name" autocomplete="off" class="diaipt" placeholder="请输入网址"';
    header += 'id="getipt"></el-input>';
    header += '<el-button type="primary" plain class="diabtn" onclick="getLinkDetails()">确定</el-button>';
    header += '</el-form>';
    header += '<el-divider></el-divider>';
    header += '<el-form ref="form" :model="form" id="details" v-loading="loading">';
    header += '<el-input placeholder="标题" v-model="input" id="stitle"></el-input>';
    header += '<el-input type="textarea" :rows="3" placeholder="描述" v-model="textarea1" id="sdescription">';
    header += '</el-input>';
    header += '<div id="tags">';
    header += '<el-select v-model="tag_value" multiple filterable allow-create default-first-option ';
    header += 'placeholder="标签">';
    header += '<el-option v-for="item in tag_options" :key="item.tag_value" :label="item.tag_label"';
    header += ':value="item.tag_value">';
    header += '</el-option>';
    header += '</el-select>';
    header += '</div>';
    header += '<!-- 选择器 -->';
    header += '<div id="xiala">';
    header += '<el-select v-model="sel_value" placeholder="收藏集">';
    header += '<el-option-group v-for="group in sel_options" :key="group.sel_label" :label="group.sel_label">';
    header += '<el-option v-for="item in group.sel_options" :key="item.sel_value" :label="item.sel_label"';
    header += ':value="item.sel_value">';
    header += '</el-option>';
    header += '</el-option-group>';
    header += '</el-select>';
    header += '</div>';
    header += '</el-form>';
    header += '<div slot="footer" class="dialog-footer">';
    header += '<el-button @click="dialogFormVisible = false">取 消</el-button>';
    header += '<el-button type="primary" @click="addBookMark()" ';
    header += 'id="addbm">添加书签</el-button>';
    header += '</div>';
    header += '</el-dialog>';
    header += '</div>';
    header += '</el-col>';
    header += '<el-col :span="6">';
    header += '<div class="grid-content bg-purple">';
    header += '<img src="http://127.0.0.1:8000/media/avatar/' + avatar + '" alt="" id="avatar">';
    header += '<div id="user">' + username + '</div>';
    header += '</div>';
    header += '</el-col>';
    header += '</el-row>';
    header += '<el-row>';
    header += '<el-col :span="8"><div class="grid-content bg-purple">' + a1 + '</div></el-col>';
    header += '<el-col :span="8"><div class="grid-content bg-purple-light">' + a2 + '</div></el-col>';
    header += '<el-col :span="8"><div class="grid-content bg-purple">' + a3 + '</div></el-col>';
    header += '</el-row>';
    header += '</div>';

    return header;      
}

// 3. 请求链接的详细信息
function getLinkDetails(){
    var link = $('#getipt').val().trim();
    if (link == ''){
        return;
    }
    if(link.indexOf('http://') < 0 && link.indexOf('https://') < 0){
        link = 'http://' + link;
    }
    link = encodeURIComponent(link);
    
    vm.loading = true;

    var title = '';
    var description = '';

    var token = window.localStorage.getItem('bookmark_token');
    var post_data = {'url': link};

    // 发送ajax请求
    $.ajax({
        type:"get",
        contentType:"application/json",
        dataType:"json",
        url:"http://127.0.0.1:8000/api/v1/bookmarks",
        data: post_data,
        // async: false,
        beforeSend: function(request) {
            request.setRequestHeader("Authorization", token);
        },
        success:function (result) {
            if (200 == result.code){
                title = result.data.title;
                description = result.data.description;
            }else if(30100 == result.code){
                title = '';
                description = '';
            }   
            vm.loading = false;
            showTandD(title, description);
        }
    });
    // showTandD(title, description);
}

// 4. 显示标题和描述
function showTandD(title, description){
    vm.input = title;
    vm.textarea1 = description;
}

// 5. 关闭表单清空控件
function clearComponent(){
    vm.form.name = ''
    vm.input = '';
    vm.textarea1 = '';
    vm.tag_value = [];
    vm.sel_value = '';
}

// -------关于头部 END---------











