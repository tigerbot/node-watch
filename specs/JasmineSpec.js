// // File: ./spec/watchSpec.js
// /*
// TODO:
// make the test faster by mocking the async callbacks

// dev_mod is set in the JakeFile either src or lib
// */
// require('VNLS');

// describe('What does jasmin does suite 1', function(){

//   beforeEach(function(){
//     console.log('suite 1 before');
//   });

// 	it('test 1', function(){
//     var x = 0
//     waitsFor(function() {
//       if(x===1){
//         console.log('t 1 ready');
//         return true;
//       }
//       return false;
//     },'waiting',1000);

//     setTimeout(function(){
//       x=1;
//     },500);

// 		console.log('t 1');
//  	}); 

//  	it('test2', function(){
//  		var x = 0
//     waitsFor(function() {
//       if(x===1){
//         console.log('t 2 ready');
//         return true;
//       }
//       return false;
//     },'waiting',1000);

//     setTimeout(function(){
//       x=1;
//     },500);

//     console.log('t 2');
// 	});
	
//   it('test 3',function(){
//     var x = 0
//     waitsFor(function() {
//       if(x===1){
//         console.log('t 3 ready');
//         return true;
//       }
//       return false;
//     },'waiting',1000);

//     setTimeout(function(){
//       x=1;
//     },500);

//     console.log('t 3');
//   });

// 	it('test 4', function(){
//   	var x = 0
//     waitsFor(function() {
//       if(x===1){
//         console.log('t 4 ready');
//         return true;
//       }
//       return false;
//     },'waiting',1000);

//     setTimeout(function(){
//       x=1;
//     },500);

//     console.log('t 4');
// 	}); 

// });

// describe('What does jasmin does suite 2', function(){

//   beforeEach(function(){
//     console.log('suite 2 before');
//   });

//   it('test 1', function(){
//     console.log('t 1');
//   }); 

//   it('test2', function(){
//     console.log('t 2');
//   });
  
//   it('test 3',function(){
//     console.log('t 3');
//   });

//   it('test 4', function(){
//     console.log('t 4');
//   }); 

// });