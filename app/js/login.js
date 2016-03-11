var Login = {
	init: function() {
		this.initNode();
		this.initAnimation();
		this.clickInput();
		//this.inputValidate();
	},

	initNode: function() {	// 初始化节点
		this.$account = $('#j-account');
		this.$pwd = $('#j-secret');
		//this.$errorMsg = $('#j-errorMsg');
		this.$loginBtn = $('#j-loginBtn');
		//this.$footer = $('#footer');
	},

	//input 的输入框点击事件
	clickInput:function(){
		$account = $('#j-account');
		$pwd = $('#j-secret');
		$account.focus(function(){
			if (this.value == "请输入手机号") {
				this.value = "";
			}
		});

		$account.blur(function(){
			if (this.value == "") {
				this.value = '请输入手机号';
			}
		});

		$pwd.focus(function(){
			if (this.value == "请输入登陆密码") {
				this.value = "";
			}
			$pwd.attr("type","password");
		});
		$pwd.blur(function(){
			if (this.value == "") {
				this.value = '请输入登陆密码';
				$pwd.attr("type","text");
			}
		});
	},


	initAnimation: function() {	// 添加动画
		var $wrapper = $('#j-wrapper'),
			wrapperClass = $wrapper.attr('class');
		$wrapper.addClass('fadeInDown animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
			$(this).removeClass().addClass(wrapperClass);
		});
	}

};
Login.init();