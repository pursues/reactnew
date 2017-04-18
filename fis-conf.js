// 编译less
fis.match('**.less', {
	parser: 'less',
	rExt: '.css'
})
// 编译tsx文件
fis.match('**.tsx', {
	parser: 'typescript',
	// 更改后缀名称
	rExt: '.js' 
})