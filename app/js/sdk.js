/**
 * SDK连接 功能相关
 * time:2016-03-02	
 * Developer:zhangge
 */


/*
*初始化SDK 
*/

var SDKBridge = function (ctr,data) {
	var sdktoken = readCookie('sdktoken'),
		userUID = readCookie('uid'),
		that = this;

	if(!sdktoken){
     	window.location.href = './index.html';
    	return;
	}

	//缓存需要获取的用户信息账号
	this.person = {};
	//缓存需要获取的群组账号
	this.team =[];
	this.person[userUID] = true;
	this.controller = ctr;
	this.cache = data;
	// 数据源(在不支持数据库时, SDK 需要开发者提供数据来完成下面的工作,SDK文档里有详细说明)
 	var dataSource = {
        getUser: function(account) {
            return that.cache.getUserById(account);
        },
        getSession: function(sessionId) {
            return that.cache.findSession(sessionId);
        },
      	getMsg: function(msg) {
            return that.nim.findMsg(that.cache.msgs[msg.sessionId], msg.idClient);
        },
        getSysMsg: function(sysMsg) {
            return that.nim.findSysMsg(that.cache.sysMsgs, sysMsg.idServer);
        }
    };

	this.nim = new NIM({
		//控制台日志，上线时应该关掉
		debug: true || { api: 'info', style: 'font-size:14px;color:blue;background-color:rgba(0,0,0,0.1)' },
        appKey: '694fcf62db13d8c74aa2c8fdf0f6fbf2',
        account: userUID,
        token: sdktoken,
        //连接
        onconnect: onConnect.bind(this),
        ondisconnect: onDisconnect.bind(this),
        onerror: onError.bind(this),
       	onwillreconnect: onWillReconnect.bind(this),
        // 多端登录变化
        onloginportschange:onLoginPortsChange.bind(this),
        // 群
        onteams: onTeams.bind(this),
        onteammembers: onTeamMembers.bind(this),
        //消息
        onmsg: onMsg.bind(this), 
        onroamingmsgs: saveMsgs.bind(this),
        onofflinemsgs: saveMsgs.bind(this),
        //会话
        onsessions: onSessions.bind(this),
        onupdatesession: onUpdatesession.bind(this),
     	//同步完成
        onsyncteammembersdone: onSyncTeamMembersDone.bind(this),
        onsyncdone: onSyncDone.bind(this),
       
        //个人信息
        onmyinfo:onMyInfo.bind(this),
        onupdatemyinfo:onMyInfo.bind(this),
        //系统通知
        onsysmsg: onSysMsg.bind(this,1),
     		onofflinesysmsgs: onOfflineSysmsgs.bind(this),
     		onupdatesysmsg:onSysMsg.bind(this,0),
     		oncustomsysmsg:onCustomSysMsg.bind(this),
     		onofflinecustomsysmsgs:onOfflineCustomSysMsgs.bind(this),

        // 静音，黑名单，好友
        onmutelist:onMutelist.bind(this),
        onblacklist: onBlacklist.bind(this),
        onfriends:onFriends.bind(this),
        onsynccreateteam:onSyncCreateteam.bind(this),
        onsyncmarkinblacklist:onSyncMarkinBlacklist.bind(this),
        onsyncmarkinmutelist:onSyncMarkinMutelist.bind(this),
        onsyncfriendaction:onSyncFriendAction.bind(this),
        //辅助
        dataSource: dataSource

    });

	function onConnect() {
		$('#j-errorNetwork').addClass('hide');
		this.teamMemberDone = false;
		this.sysMsgDone = false;
	    console&&console.log('连接成功');
	};

	function onKicked(obj) {
	    this.iskicked = true;
		
	};

	function onWillReconnect(obj){
		// 此时说明 `SDK` 已经断开连接，请开发者在界面上提示用户连接已断开，而且正在重新建立连接
		$('#j-errorNetwork').removeClass('hide');
	};

	function onError(error) {
	    console.log('错误信息' + error);
	};
	function onDisconnect(error) {
		// 此时说明 `SDK` 处于断开状态，开发者此时应该根据错误码提示相应的错误信息，并且跳转到登录页面
		var that = this;
		console.log('连接断开');
	    if (error) {
	        switch (error.code) {
	        // 账号或者密码错误, 请跳转到登录页面并提示错误
	        case 302:
		        alert(error.message);
		    	delCookie('uid');
			    delCookie('sdktoken');
			    window.location.href = '/webdemo/index.html'; 
	            break;
	        // 被踢, 请提示错误后跳转到登录页面
	        case 'kicked':
		        var map={
					PC:"电脑版",
					Web:"网页版",
					Android:"手机版",
					iOS:"手机版",
					WindowsPhone:"手机版"
				};
				var str =error.from;
        		alert("你的帐号于"+dateFormat(+new Date(),"HH:mm")+"被"+(map[str]||"其他端")+"踢出下线，请确定帐号信息安全!");
			    delCookie('uid');
			    delCookie('sdktoken');
			    window.location.href = '/webdemo/index.html'; 	
	            break;
	        default:
	            break;
	        }
	    }
	};
	function onLoginPortsChange(loginPorts) {
	    console.log('当前登录帐号在其它端的状态发生改变了', loginPorts);
     	this.controller.loginPorts(loginPorts);
	};
	function onTeams(teams) {
		var teamlist = this.cache.getTeamlist();
		teamlist = this.nim.mergeTeams(teamlist, teams);    
		teamlist = this.nim.cutTeams(teamlist, teams.invalid);
		this.cache.setTeamList(teamlist);
	};
	function onFriends(friends){
		var friendlist = this.cache.getFriends();
		friendlist = this.nim.mergeFriends(friendlist, friends);    
		friendlist = this.nim.cutFriends(friendlist, friends.invalid);
		this.cache.setFriends(friendlist);
		for(var i = 0;i<friendlist.length;i++){
			this.person[friendlist[i].account] = true;
		}		
	};
	function onSessions(sessions){
		var old = this.cache.getSessions();
		this.cache.setSessions(this.nim.mergeSessions(old, sessions));
		for(var i = 0;i<sessions.length;i++){
	    	if(sessions[i].scene==="p2p"){
	    		this.person[sessions[i].to] = true;
	    	}else{
	    		this.team.push(sessions[i].to);
	    	}
		}
	};
	function onUpdatesession(session){
		var old = this.cache.getSessions();
		this.cache.setSessions(this.nim.mergeSessions(old, session));
		this.controller.buildConversations();			
	};

	function saveMsgs(msgs) {
		msgs = msgs.msgs;
	    this.cache.addMsgs(msgs);
	    for(var i = 0;i<msgs.length;i++){
	    	if(msgs[i].scene==="p2p"){
	    		this.person[msgs[i].from!==userUID?msgs[i].from:msgs[i].to] = true;
	    	}
		}
	};
	function onSyncDone() {
		console.log('消息同步完成');	
 		var ctr = this.controller;
 		this.sysMsgDone = true;
	    //如果用户数据拉取完毕，UI开始呈现
	    if(this.teamMemberDone){
	    	ctr.initInfo(this.person,this.team);
	    }
	};
	function onSyncTeamMembersDone() {
		console.log('群成员同步完成');
		var ctr = this.controller;
	    this.teamMemberDone = true;
	    //如果用户消息等拉取完毕，UI开始呈现
	    if(this.sysMsgDone){
	    	ctr.initInfo(this.person,this.team);
	    }
	};
	function onTeamMembers(obj) {
		this.cache.setTeamMembers(obj.teamId,obj.members);
		var members = obj.members;
	    for(var i = 0;i<members.length;i++){
    		this.person[members[i].account] = true;	
		}
	};
	function onMsg(msg) {
		//涉及UI太多放到main.js里去处理了
	    this.controller.doMsg(msg);
	};
	function onOfflineSysmsgs(sysMsgs){
		var data = this.cache.getSysMsgs();
		data =this.nim.mergeSysMsgs(data, sysMsgs).sort(function(a,b){
			return b.time-a.time;
		});
		this.cache.setSysMsgs(data);
		this.cache.addSysMsgCount(data.length);
	}
	function onSysMsg(newMsg,msg) {
		var type = msg.type,
			ctr = this.controller,
			cache = this.cache;
			data = cache.getSysMsgs();
		data =this.nim.mergeSysMsgs(data, msg).sort(function(a,b){
			return b.time-a.time;
		});
		this.cache.setSysMsgs(data);
		if(msg.category!=="team"){
			
			switch (type) {
	            case 'deleteFriend':
	                cache.removeFriend(msg.from);
	                ctr.buildContacts();
	                break;
	            case 'addFriend':
	                if(!this.cache.getUserById(msg.from)){
	                    this.getUser(msg.from,function(err,data){
	                    	if(!err){
		                    	cache.addFriend(data);
		                        cache.updatePersonlist(data);
		                        ctr.buildContacts();	
	                    	}
	                    })
	                }else{
	                	cache.addFriend(msg.friend);
	                    ctr.buildContacts();   
	                }
	                break;
	            default:
	            	console.log("系统消息---->"+msg);
	                break;
	        }			
		}else{
			if(newMsg){
				this.cache.addSysMsgCount(1);
				ctr.showSysMsgCount();
			}
			ctr.buildSysNotice();
		}
	};

	function onCustomSysMsg(msg){
		//多端同步 正在输入自定义消息类型需要过滤
		var id = JSON.parse(msg.content).id;
		if(id===1){
			return;
		}
		var ctr = this.controller;
		this.cache.addCustomSysMsgs([msg]);
		this.cache.addSysMsgCount(1);
		ctr.showSysMsgCount();
		ctr.buildCustomSysNotice();
	};
	function onOfflineCustomSysMsgs(msgs){
		this.cache.addCustomSysMsgs(msgs);
		this.cache.addSysMsgCount(msgs.length);
	};
	// 黑名单
	function onBlacklist(blacklist){
		var list = this.cache.getBlacklist();
	 	list = this.nim.mergeRelations(list, blacklist);
    	list = this.nim.cutRelations(list, blacklist.invalid);
		this.cache.setBlacklist(list);
		
		for(var i = 0;i<data.length;i++){
			this.person[data[i]] = true;
		}
	};
	//静音
	function onMutelist(mutelist){
		var list = this.cache.getMutelist();
		list = this.nim.mergeRelations(list, mutelist);
    	list = this.nim.cutRelations(list, mutelist.invalid);
		this.cache.setMutelist(list);
		for(var i = 0;i<data.length;i++){
			this.person[data[i]] = true;
		}
	};

	function onMyInfo(data){
		this.cache.updatePersonlist(data);
		this.controller.showMe();
	};

	function onSyncCreateteam(data){
		this.cache.addTeam(data);
		this.controller.buildTeams();
	};
	// 多端同步好友关系
	function onSyncFriendAction(data){
		ctr.doSyncFriendAction(data);
	};

	function onSyncMarkinBlacklist(param){
		if(param.isAdd){
			this.cache.addToBlacklist(param.record);
		}else {
			this.cache.removeFromBlacklist(param.account);
		}
		this.controller.buildConversations();
        this.controller.buildContacts();     
	};

	function onSyncMarkinMutelist(param){
		if(param.isAdd){
			this.cache.addToMutelist(param.record);
		}else {
			this.cache.removeFromMutelist(param.account);
		}
	};
}

/**
 * 设置当前会话，当前会话未读数会被置为0，同时开发者会收到 onupdatesession回调
 * @param {String} scene 
 * @param {String} to    
 */
 
SDKBridge.prototype.setCurrSession = function(scene,to){
	this.nim.setCurrSession(scene+"-"+to);
}

