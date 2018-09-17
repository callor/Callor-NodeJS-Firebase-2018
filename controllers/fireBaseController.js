var fireBaseConfig 
	= require('../config/fireBaseConfig.js')
	
var firebase = require('firebase')
// console.log(fireBaseConfig)
firebase.initializeApp(fireBaseConfig)

module.exports = (app)=>{
	
	// localhost:3000/input 이라고 요청하면 처리할 부분설정
	app.get('/input',(req,res)=>{
		res.render('input_form',{item:''})
	})
	
	app.get('/input/:title/:memo',(req,res)=>{
		var db = firebase.database()
		
		var newKey = db.ref().child('doc').push().key
		var title = req.params.title
		var memo = req.params.memo
		
		var newData = {
			key : newKey,
			title : title,
			memo : memo
		}
		db.ref('/doc/'+newKey).set(newData)
		res.redirect('/list')
	})
	
	app.post('/input',(req,res)=>{
		var db = firebase.database()
		var newData = req.body
		var updateKey = req.body.no
		
		// form에서 전송된 data 중에 no 항목이 없으면
		if(!updateKey) {
			// key를 새로 생성하라
			updateKey = db.ref().child('doc').push().key
			newData.no = updateKey
		}
		
		// 새로운 key를 생성해서 form 데이터에 추가
		// newData.no = 
		
//		db.ref('/doc/' + newData.no ).set(newData)
		db.ref('/doc/' + updateKey).set(newData)
//		res.send('저장 완료')
		res.redirect('/list')
		
	})
	
	app.get('/update/:key',(req,res)=>{
		var key = req.params.key
		firebase.database().ref('/doc/' + key).once('value',(result)=>{
			data = result.val()
			res.render('input_form',{item:data})
		})
	})
	
	app.get('/delete/:key',(req,res)=>{
		var key = req.params.key
		firebase.database().ref('/doc/'+key).remove()
		res.redirect('/list')
	})
	
	app.get('/list',(req,res)=>{
		// firebase로 부터 데이터를 가져오는 부분
		// firebase로 부터 데이터를 가져올때는 
		// 비동기 방식으로 가져 와야 한다.
		firebase.database().ref('doc').orderByKey().once('value',
				(resultSet)=>{
				
				var rows = [] ;
				resultSet.forEach((row)=>{
					let childData = row.val();
					rows.push(childData)
				})
				res.render('list_form',{list:rows})
		})
		
		// res.render('list_form')
	})

	app.get('/test',(req,res)=>{
	
		// 새로운 insert key 를 생성
		var newKey = firebase.database().ref()
			.child('doc').push().key
		
		// 추가할 데이터
		var newData = {
			no : newKey,
			title : '오늘의 일기',
			memo : '오늘은 민수씨가 재미있나 보다'
		}
		
		// 데이터를 firebase로 전송
		firebase.database()
			.ref('/doc/'+ newKey).set(newData)
		res.json(newData)
	})

}