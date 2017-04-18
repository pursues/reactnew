// 解构React对象以及ReactDOM对象
const { Component } = React;
const { render } = ReactDOM;

// 定义工具对象，实现异步请求方法
let Util = {
	/***
	 * 实现ajax方法
	 * @url 	请求地址
	 * @fn 		请求成功回调函数
	 **/ 
	ajax(url, fn) {
		// 创建xhr对象
		let xhr = new XMLHttpRequest();
		// 注册事件
		xhr.onreadystatechange = () => {
			// 判断状态
			if (xhr.readyState === 4) {
				// 判断状态码
				if (xhr.status === 200) {
					// 解析返回的结果，执行回调函数
					let res = JSON.parse(xhr.responseText)
					fn && fn(res)
				}
			}
		}
		// 打开请求
		xhr.open('GET', url, true);
		// 发送数据
		xhr.send(null);
	},
	/**
	 * 对象转化成query
	 * @obj 	转化的对象
	 * return 	query数据
	 * eg: {color: "red", title: 'ickt'} => ?color=red&title=ickt
	 **/ 
	objToQuery(obj) {
		// 定义结果
		let result = '';
		// 遍历对象
		for (var i in obj) {
			// key是i， value是obj[i]
			result += '&' + i + '=' + obj[i];
		}
		// 删除第一个&符号，添加?
		return '?' + result.slice(1)
	} 
}

// 三个页面有三个组件，创建出来
// 首页
class Home extends Component {
	// 定义组件点击的事件
	clickItem(id) {
		// console.log(this)
		// console.log(arg)
		// 第一种 获取元素的data-id方案
		// let id = e.currentTarget.getAttribute('data-id');
		// 第二种 获取元素的data-id方案, 但是在列表中不能用
		// let id = this.refs.item.getAttribute('data-id')
		// 注意，在列表中有问题，只能使用事件对象访问
		// console.log(id)
		// 第三种 通过传参的方式获取, 最佳方式
		// console.log(id)

		// 执行父组件的方法，传递数据
		this.props.showDetail(id)
	}
	// 创建列表视图
	createView() {
		// 通过data属性数据渲染
		return this.props.data.map((obj, index) => {
			// 这里的this指向谁？
			// 我们希望更改回调函数的作用域，不希望执行，只能通过bind绑定
			return (
				<li ref="item" data-id={obj.id} onClick={this.clickItem.bind(this, obj.id)} className="clearfix" key={index}>
					<img src={obj.img} alt="" />
					<div className="content">
						<h2>{obj.title}</h2>
						<p>{obj.content}<span className="home-comment">{'评论: ' + obj.comment}</span></p>
						
					</div>
				</li>
			)
		})
	}
	// 渲染虚拟DOM
	render() {
		return (
			<ul className="home">{this.createView()}</ul>
		)
	}
}
// 详情页
class Detail extends Component {
	// 渲染输出虚拟DOM
	render () {
		// console.log(this.props)
		// 解构
		let { title, time, img, comment, content, id } = this.props.data;
		// 定义内容
		let contentText = {
			__html: content
		}
		return (
			<div className="detail">
				<h2>{title}</h2>
				<div className="detail-state">
					<span>{time}</span>
					<span className="right">{'评论：' + comment}</span>
				</div>
				<img src={img} alt="" />
				<p className="content" dangerouslySetInnerHTML={contentText}></p>
				<div ref="btn" data-id={id} onClick={this.showMoreComment.bind(this, id)} className="show-comment">查看更多评论</div>
			</div>
		)
	}
	// 查看更多评论事件回调函数
	showMoreComment(e) {
		// 1 点击查看更多评论按钮
		// 2 获取新闻的id
		// 第一种
		// console.log(e.target.getAttribute('data-id'), 111)
		// 第二种
		// console.log(this.refs.btn.getAttribute('data-id'), 222)
		// 第三种
		// console.log(e, 333)
		// 第四种
		// console.log(this.props.data.id, 444)
		// console.log(this)
		// 3 将id传递给父组件
		this.props.showComment(e);
	}
}
// 评论页
class Comment extends Component {
	// 将属性数据转化成状态数据（在构造函数内）
	constructor(props) {
		// 构造函数式继承
		super(props);
		// 定义默认状态
		this.state = {
			// 状态数据有属性提供的
			list: props.data.list || [],
			// id可以保存，也可以不保存
			id: props.data.id || ''
		}
	}
	// 在存在期将属性数据，转化成状态数据
	componentWillReceiveProps(props) {
		// 更新状态
		this.setState({
			// 用属性数据，更新状态数据
			list: props.data.list || [],
			id: props.data.id || ''
		})
	}
	// 定义渲染评论列表的方法
	createView() {
		return this.state.list.map((obj, index) => {
			return (
				<li key={index}>
					<h3>{obj.user}</h3>
					<p>{obj.content}</p>
					<span>{obj.time}</span>
				</li>
			)
		})
	}
	// 渲染输出虚拟DOM
	render () {
		return (
			<div className="comment">
				<div className="comment-input">
					<textarea ref="inputText" placeholder="文明上网，理性发言！"></textarea>
				</div>
				<div onClick={this.submibtInput.bind(this)} className="submit-btn">提交</div>
				<ul>{this.createView()}</ul>
			</div>
		)
	}
	// 1 为提交按钮绑定click事件
	submibtInput() {
		// 2 获取输入的内容
		let val = this.refs.inputText.value;
		// 3 判断输入的是否合法
		// 不能为空
		if (/^\s*$/.test(val)) {
			alert('请您输入内容！');
			return;
		}
		// 4 拼凑提交的数据
		let date = new Date();
		let result = {
			user: '雨夜清荷',
			content: val,
			// "昨天 22:38:28"
			time: '刚刚: ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
		}
		// 5 发送请求，提交数据
		// 添加新闻id
		// let result.id = this.props.data.id
		// console.log(this.state.id);
		result.id = this.state.id;
		Util.ajax('data/addComment.json' + Util.objToQuery(result), res => {
			// console.log(res)
			if (res && res.errno === 0) {
				// 6 更新视图
				// 要为list后面添加新的提交数据
				let list = this.state.list;
				list.push(result);
				// 更新新的数据
				this.setState({
					list: list
				})
				// 7 输入内容清空
				this.refs.inputText.value = '';
				alert('恭喜您，提交成功！');
			}
		})
		
	}
}
// 定义header组件
class Header extends Component {
	render() {
		return (
			<div className="header">
				<div className="go-back" onClick={this.props.goBack}>
					<span className="arrow"></span>
					<span className="arrow blue"></span>
				</div>
				<div className="login">登录</div>
				<h1 className="title">爱创课堂新闻平台</h1>	
			</div>
		)
	}
}

// 创建一个组件，渲染到页面中
class App extends Component {
	// 构造函数
	constructor (props) {
		super(props);
		// 定义状态
		this.state = {
			section: props.section,
			// 初始化list数据（传递给home组件）
			list: [],
			// 初始化detail数据（传递给detail组件，是一个对象）
			detail: {},
			// 初始化comment数据，（传递给comment组件，是一个对象）
			comment: {}
		}
	}
	// 定义传递给home组件的方法
	showDetail(id) {
		// console.log(this)
		// console.log(123, id)
		// 1 根据id发送请求，获取数据
		Util.ajax('data/detail.json?id=' + id, res => {
			// console.log(res)
			if (res && res.errno === 0) {
				// 这里的this是谁？
				// console.log(this)
				// 2 存储在状态中
				this.setState({
					detail: res.data,
					// 显示detail页面
					section: 'detail'
				})
			}
		})
		// 3 将数据传递给detail组件
	}
	// 显示评论页面
	showComment(id) {
		// 1 根据id发送请求，获取数据
		Util.ajax('data/comment.json?id=' + id, res => {
			if (res && res.errno === 0) {
				// 2 存储返回的数据, 显示评论页
				this.setState({
					comment: res.data,
					// 显示页面
					section: 'comment'
				})
			}
		})
		// 3 将数据传递给评论页组件
		// console.log(id, 123)
	}
	// 定义返回逻辑方法
	goBack() {
		// 判断section的值
		switch(this.state.section) {
			// 在首页点击无效果
			case 'home': 
				break;
			// 在详情页点击返回首页
			case 'detail':
				// 显示首页
				this.setState({section: 'home'})
				break;
			// 在评论页点击返回详情页
			case 'comment': 
				// 显示详情页
				this.setState({section: 'detail'});
				break;
		}
	}
	// 通过render方法渲染输出虚拟dom
	render() {
		// console.log(this.state)
		// 解构状态
		let { section, list, detail, comment } = this.state;
		return (
			<div>
				<Header goBack={this.goBack.bind(this)}></Header>
				{/*通过状态决定渲染哪个组件*/}
				<div style={{display: section === "home" ? 'block' : 'none'}}>
					<Home showDetail={this.showDetail.bind(this)} data={list}></Home>
				</div>
				<div style={{display: section === 'detail' ? 'block' : 'none'}}>
					<Detail showComment={this.showComment.bind(this)} data={detail}></Detail>
				</div>
				<div style={{display: section === 'comment' ? 'block' : 'none'}}>
					<Comment data={comment}></Comment>
				</div>
			</div>
		)
	}
	// 组件构建完成发送请求获取数据
	componentDidMount() {
		Util.ajax('data/list.json', res => {
			// 判断是否成功
			if (res && res.errno === 0) {
				// 更新状态
				// 这里的this是谁
				// console.log(this)
				this.setState({
					list: res.data
				})
			}
		})
	}
}

// 想继承Util就要继承Util类，所以可以将Util定义成类
// 首先让Util继承Component类
// class Util extends Component {
// 	ajax(url, fn) {
// 		// 创建xhr对象
// 		let xhr = new XMLHttpRequest();
// 		// 注册事件
// 		xhr.onreadystatechange = () => {
// 			// 判断状态
// 			if (xhr.readyState === 4) {
// 				// 判断状态码
// 				if (xhr.status === 200) {
// 					// 解析返回的结果，执行回调函数
// 					let res = JSON.parse(xhr.responseText)
// 					fn && fn(res)
// 				}
// 			}
// 		}
// 		// 打开请求
// 		xhr.open('GET', url, true);
// 		// 发送数据
// 		xhr.send(null);
// 	}
// }
// 在让App继承Util类，这样App就继承了Util以及Component类
// class App extends Util {
// 	// 构造函数
// 	constructor (props) {
// 		super(props);
// 		// 定义状态
// 		this.state = {
// 			section: props.section,
// 			// 初始化list数据（传递给home组件）
// 			list: []
// 		}
// 	}
// 	// 通过render方法渲染输出虚拟dom
// 	render() {
// 		// console.log(this.state)
// 		// 解构状态
// 		let { section, list } = this.state;
// 		return (
// 			<div>
// 				<Header></Header>
// 				{/*通过状态决定渲染哪个组件*/}
// 				<div style={{display: section === "home" ? 'block' : 'none'}}>
// 					<Home data={list}></Home>
// 				</div>
// 				<div style={{display: section === 'detail' ? 'block' : 'none'}}>
// 					<Detail></Detail>
// 				</div>
// 				<div style={{display: section === 'comment' ? 'block' : 'none'}}>
// 					<Comment></Comment>
// 				</div>
// 			</div>
// 		)
// 	}
// 	// 组件构建完成发送请求获取数据
// 	componentDidMount() {
// 		this.ajax('data/list.json', res => {
// 			// 判断是否成功
// 			if (res && res.errno === 0) {
// 				// 更新状态
// 				// 这里的this是谁
// 				// console.log(this)
// 				this.setState({
// 					list: res.data
// 				})
// 			}
// 		})
// 	}
// }

// 渲染到页面中
render(<App section="home"></App>, document.getElementById('app'))