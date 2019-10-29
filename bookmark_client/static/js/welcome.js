$(function(){
    // 注册块的初始display值
    $('#regshow').css({'display':'none'})
});
// 登录注册的切换-------
function logc(){
    $('#regshow').css({'display':'none'})
    $('#logshow').css({'display':'block'})
}
function regc(){
    $('#logshow').css({'display':'none'})
    $('#regshow').css({'display':'block'})
}
// $('#log').click(function(){
//     $('#regshow').css({'display':'none'})
//     $('#logshow').css({'display':'block'})
// });
// $('#reg').click(function(){
//     $('#logshow').css({'display':'none'})
//     $('#regshow').css({'display':'block'})
// });
// ------------

// 点击‘开始吧’
function wstart(){
    var token = window.localStorage.getItem('bookmark_token');
    $.ajax({
        type:"get",
        url:"http://127.0.0.1:8000/api/v1/users/info",
        beforeSend: function(request) {
            request.setRequestHeader("Authorization", token);
        },
        success:function (result) {
            if (200 == result.code){
                window.location.href = '/shiji/index';
            }
        }
    });
}

// 注册
function register(){
    var username = $('#un').val()
    // 判断用户名是否合法(只简单地判断了长度问题)
    if(username.length == 0){
        alert('用户名为空')
        return 0;
    }
    if(username.length > 30){
        alert('用户名超过30个字符')
        return 0;
    }
    
    var email = $('#em').val()
    // 未验证邮箱
    // 判断邮箱是否合法（只判断是否为空）
    if(email.length == 0){
        alert('邮箱为空')
        return 0;
    }

    var password = $('#ps').val()
    // 判断密码是否合法（只判断是否为空）
    if(password.length == 0){
        alert('密码为空')
        return 0;
    }

    var post_data = {
        'username':username, 
        'email':email, 
        'password':password,
    }

    // 发送ajax请求
    $.ajax({
        type:"post",
        contentType:"application/json",
        dataType:"json",
        url:"http://127.0.0.1:8000/api/v1/users",
        data:JSON.stringify(post_data),
        success:function (result) {
            if (200 == result.code){
                window.localStorage.setItem('bookmark_token', result.data.token)
                window.location.href = '/shiji/index';
            }else{
                alert(result.error)
            }
        }
    });
}

// 登录
function login(){
    var username = $('#unl').val()
    // 判断用户名是否合法(只简单地判断了长度问题)
    if(username.length == 0){
        alert('用户名为空')
        return 0;
    }

    var password = $('#psl').val()
    // 判断密码是否合法（只判断是否为空）
    if(password.length == 0){
        alert('密码为空')
        return 0;
    }

    var post_data = {
        'username':username, 
        'password':password,
    }

    // 发送ajax请求
    $.ajax({
        type:"post",
        contentType:"application/json",
        // dataType
        dataType:"json",
        // url
        url:"http://127.0.0.1:8000/api/v1/users/login",
        // 不需要把JS的对象或数组序列化一个json 字符串
        data: JSON.stringify(post_data),
        // result 为请求的返回结果对象
        success:function (result) {
            if (200 == result.code){
                window.localStorage.setItem('bookmark_token', result.data.token);
                window.location.href = '/shiji/index';
            }else{
                alert(result.error)
            }
        }
    });
}






