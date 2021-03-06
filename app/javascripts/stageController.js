
angular.module('mainApp');

app.controller('stageController' ,function($scope ,$rootScope, brideService ,$route , $http , $q ,$location,$window){
  var s=[];
  var stage2;
  var done =false;
   init = function(){ 
        $scope.tempid = $route.current.params.brideid;
         $scope.bride = brideService.get({id: $scope.tempid});
      checkStage();

      $scope.dressInfoRoute = function(id){  
          $scope.brideid = $route.current.params.brideid;
          
      };
   }    
   
    
      stages = function(){
                $scope.s1 = s[0];
                if($scope.s1 == true){
                    $scope.s2 = s[1];
                    if($scope.s2 == true){
                        $scope.s3 = s[2];
                        if($scope.s3 == true){
                           $scope.s4 = s[3];
                           if($scope.s4 == true){
                               $scope.s5 = s[4];
                           } 
                        }
                    }
                }
      }
       
     checkStage = function(){
         var stageid;
         $scope.tempid = $route.current.params.brideid;
         $http.get('/api/bridestages/'+ $scope.tempid).then(function(res) {
                for(var i=0; i <res.data.stages.length; i++){
                    stageid =  res.data.stages[i];
                    if(stageid != undefined){  
                      console.log('true' + stageid);
                      s[i] = true;
                      if(i ==1 ){
                        $scope.stage2 = res.data.stages[i].s;
                      }
                    }
                    else
                    if( stageid === undefined){
                                          console.log('false' + stageid);
                      s[i] = false;
                    }
                }
                stages();
                
         }, function(err) {
            console.log(err);
           });
     };
        $scope.sendStage = function(Stage){
           $scope.tempid = $route.current.params.brideid;
           var stage = {s: '',last_update:'' };
           stage.s = Stage.s;
           stage.last_update = Date.now();
        $http.post('/api/stages', stage ).then(function(res) {
               $http.put('/api/stages/'+ $scope.tempid +'/'+ res.data._id ).then(function(res) {
                        $http.get('/api/brides/'+ $scope.tempid ).then(function(res) {
                            checkStage();
                          console.log(res.data);
                          }, function(err) {
                        })
                    }, function(err) {
                      console.log(err);
                  })
            }, function(err) {
                console.log(err);
            })
      };
     $scope.finishStage = function(){      
      $scope.tempid = $route.current.params.brideid;

      var stage = {s: '',last_update:'' };
        stage.s = 'שלב 3';
        stage.last_update = Date.now();

        $http.post('/api/stages', stage ).then(function(res) {
               $http.put('/api/stages/'+ $scope.tempid +'/'+ res.data._id ).then(function(res) {
                        $http.get('/api/brides/'+ $scope.tempid ).then(function(res) {
                            $scope.brideWithStage = res.data;
                               checkStage();
                        //    $location.path('stage/' + $scope.tempid );           
                          }, function(err) {
                        })
                    }, function(err) {
                      console.log(err);
                  })
            }, function(err) {
                console.log(err);
            })
      };
      $scope.finishStageFinel = function(){        
        $scope.tempid = $route.current.params.brideid;
        var bride = brideService.get({id: $scope.tempid});
        $http.get('/api/brides/'+ $scope.tempid).then(function(res) {
                    brideWithPayment = res.data;
                    if(brideWithPayment.payments == null){
                        swal({
                                title: '1 השמלה לא שולמה !',
                                type: 'info',
                                text:
                                    'בבקשה הכנס תשלומים!' +
                                    ' ללא תשלום לא תוכל לסיים את השלב '
                                })
                        $location.path('brideInfo/' + $scope.tempid);
                    }else{
                        var totalDone = 0;
                        var total =0;
                        for(var i=0; i < brideWithPayment.payments.length; i++){
                            var payment = brideWithPayment.payments[i];
                            total += payment.pay;
                            if(payment.done == true)
                                totalDone += payment.pay;
                        }
                        if(totalDone == total && total == bride.price){
                                    var stage = {s: '',last_update:'' };
                                    stage.s = 'שלב 4';
                                    stage.last_update = Date.now();
                                $http.post('/api/stages', stage ).then(function(res) {
                                $http.put('/api/stages/'+ $scope.tempid +'/'+ res.data._id ).then(function(res) {
                                            $http.get('/api/brides/'+ $scope.tempid ).then(function(res) {
                                                $scope.brideWithStage = res.data;
                                                        checkStage();
                                            //    $location.path('stage/' + $scope.tempid );           
                                            }, function(err) {
                                            })
                                        }, function(err) {
                                        console.log(err);
                                    })
                                }, function(err) {
                                    console.log(err);
                                })
                        }else{
                            swal({
                                    title: 'השמלה לא שולמה !',
                                    type: 'info',
                                    text:
                                        'בבקשה הכנס תשלומים!' +
                                        ' ללא תשלום לא תוכל לסיים את השלב '
                                    })
                                    $location.path('brideInfo/' + $scope.tempid);
                        }
                    }
        }, function(err) {
            console.log(err);
         });


      };
      $scope.retDressStage = function(){
          
      $scope.tempid = $route.current.params.brideid;
      var bride = brideService.get({id: $scope.tempid});
      $http.get('/api/brides/'+ $scope.tempid).then(function(res) {
                    brideEventr = res.data;
                    console.log(brideEventr.date_event);
                    if(brideEventr.date_event > Date()){
                        swal({
                                title: 'תאריך האירוע לא עבר !',
                                type: 'info',
                                text:
                                'לא ניתן לסיים שלב זה'
                                })
                    }
                    else{

                    
                        var stage = {s: '',last_update:'' };
                        stage.s = 'שלב 5';
                        stage.last_update = Date.now();

                        $http.post('/api/stages', stage ).then(function(res) {
                            $http.put('/api/stages/'+ $scope.tempid +'/'+ res.data._id ).then(function(res) {
                                        
                                        $http.get('/api/brides/'+ $scope.tempid ).then(function(res) {
                                            $scope.brideWithStage = res.data;

                                                    updateStatus();
                                                    
                                        //    $location.path('stage/' + $scope.tempid );           
                                        }, function(err) {
                                        })
                                    }, function(err) {
                                    console.log(err);
                                })
                            }, function(err) {
                                console.log(err);
                            })
                    }
      }, function(err) {
            console.log(err);
        })
            
    };
      updateStatus = function(){
            $scope.upBride = {};
            upBride = {
                status:'סגור'
            };
            $http.put('/api/bride/update' , {id:$scope.tempid , updatedObj:upBride}).then(function(res){
              console.log(res);
              checkStage();
            },function(err){
              console.log(err);
            }) 
     };
  
     $scope.forwordStage = function(){
          
          $location.path('brideInfo/' + $scope.tempid );
     };
     init();
});