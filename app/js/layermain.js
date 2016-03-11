/*
*功能: 实现该项目的所有弹出层的优化等
 time:20160309
 author:zhangge
*/

'use strict'

window.onload = function(){

/*
* 登录页面，登录按钮的 layer 事件
	time：20160309
	author:zhangge
*/


/*
* 登录时候做用户名以及密码验证
*/
$('#j-loginBtn').on('click', function(){
		var accountVal = $('#j-account').val();
		var pswVal = $('#j-secret').val();
		if(accountVal == "" || accountVal == "请输入手机号"){
	    
	    layer.alert('请输入手机号', {
	        skin: 'layui-layer-TipsG'
	        ,closeBtn: 0
	        ,shift: 4 //动画类型
	    });
	  }else if(pswVal == undefined || pswVal == "请输入登陆密码"){
	  		    
	    layer.alert('请输入密码', {
	        skin: 'layui-layer-TipsG'
	        ,closeBtn: 0
	        ,shift: 4 //动画类型
	    });
	  	
	  }

	  setCookie('username',accountVal,1);  
	  setCookie('psw',pswVal,1); 

	  window.location.href='main.html';
});



}


	//存入cookie 方法
	function setCookie(name, value, iDay){

		var oDate=new Date();

		oDate.setDate(oDate.getDate()+iDay);

		document.cookie=name+'='+encodeURIComponent(value)+';expires='+oDate;
		
	}

	//删除cookie 方法
	function delCookie(name){  
    var exp = new Date();  //当前时间  
    exp.setTime(exp.getTime() - 1);  
    var cval=getCookie(name);  
    if(cval!=null) document.cookie= name + "="+cval+";expires="+exp.toGMTString();  
	} 