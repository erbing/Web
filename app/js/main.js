'use strict'
/*
*主页的逻辑层代码
*/

window.onload = function(){

	//测试使用
	var getnameCookie = mainMethod.getCookie('username');
	var getpswCookie = mainMethod.getCookie('psw');

	if (getnameCookie == "admin") {
		  console.log(getnameCookie);
		if(getpswCookie == "admin"){
			console.log(getpswCookie);
		}else{
			window.location.href = "index.html";
		}
	}else{
		window.location.href = "index.html";
	}

	//修改姓名
	$("#username").click(mainMethod.changeName);
	
	//添加好友、创建群、用户设置
	$("#plusbtn").click(mainMethod.plusBtn);

	//阻止时间冒泡的方法
	function stopPropagation(e) {
    if (e.stopPropagation)
        e.stopPropagation();
    else
        e.cancelBubble = true;
  }

  $('#plusbtn').bind('click',function(e){
    stopPropagation(e);
  });

  $('.selectplus').bind('click',function(e){
    stopPropagation(e);
  });

  //点击空白 下拉选择消失 
	$(document).bind('click',mainMethod.removeBtn);

	//添加好友
	$("#addfriends").bind('click',mainMethod.addFriends);
	//创建高级群
	$("#creatgroup").bind('click',mainMethod.creatGroup);
	//用户设置
  $("#usersetting").bind('click',mainMethod.userSetting);


  //搜索
  $("#search").bind('focus',mainMethod.search);

  //聊天、好友列表、群列表 的tab 切换
  var lists = $(".panel-left-list-ul li");;
  var panelBodyContent = $(".panel-left-body");

  lists.click(function(){
  	var _this = $(this);
  	var order = _this.index();

  	lists.removeClass();
  	_this.addClass('active' + order);
  	panelBodyContent.css('display','none');
  	panelBodyContent.eq(order).css('display','block');

  });

}





//所有的方法

var mainMethod = {
	//取出cookie 方法 (test 使用)
	getCookie : function(name){  
	  var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));  
	  if(arr != null){  
	   return unescape(arr[2]);   
	  }else{  
	   return null;  
	  }  
	},

	//修改用户名信息 弹出层 
	changeName : function(){
		layer.open({
			type:1 ,// 选择页面层
			title:false, //
			content: $('#changename'), //内容选择
			area: ['420px', '520px'], //定义宽高
		})
	},

	//显示下拉框
	plusBtn : function(){
		$(".selectplus").css({
			'display':'block'
		})
	},

	// 隐藏下拉框
	removeBtn : function(){
		$(".selectplus").css({
			'display':'none'
		})
	},

	//添加好友
	addFriends : function(){
		layer.open({
			type:1 ,// 选择页面层
			title:false, //
			content: $('.addfriendsdom'), //内容选择
			area: ['400px', '425px'], //定义宽高
		});
	},

	//创建高级群
	creatGroup : function(){
		layer.open({
			type:1 ,// 选择页面层
			title:false, //
			content: $('.addfriendsdom'), //内容选择
			area: ['400px', '425px'], //定义宽高
		});
	},

	//用户设置
  userSetting : function(){
		layer.open({
			type:1 ,// 选择页面层
			title:false, //
			content: $('.addfriendsdom'), //内容选择
			area: ['400px', '425px'], //定义宽高
		});
	},

	//搜索方法
	search : function(){
		var searchVal = $("#search").val();
		if(searchVal == "搜索"){
			$("#search").val("");
		}	
	}, 

	//聊天、好友列表、群列表 的tab 切换
	tabList : function(){
		//alert(1);
	},


};
