// Specs for jquery_couch.js lines 48-156 and 415-448

describe 'jQuery couchdb'
  before
    if(typeof(old_alert) == 'undefined'){
      old_alert = alert;
    }
    alert = function(msg){
      console.log('alert: ', msg)
    };
  end
  
  after
    alert = old_alert;
  end
  
  describe 'activeTasks'
    it 'should return the active tasks'
      $.couch.session({
        success: function(resp){
          resp.info.should.have_prop 'authentication_db'
          resp.userCtx.should.include 'name'
          resp.userCtx.roles.should.be_an Array
        }
      });
    end
  end
  
  describe 'allDbs'
    
  end
  
  describe 'config'
    
  end
  
  describe 'session'
    
  end
  
  describe 'userDb'
    
  end
  
  describe 'signup'
    
  end
  
  describe 'login'
    
  end
  
  describe 'logout'
    
  end
  
  describe 'encodeDocId'
    // it 'should description'
    //   $.encodeDocId('123');
    // end
  end
  
  describe 'info'
    
  end
  
  describe 'replicate'
    
  end
  
  describe 'newUUID'
    
  end
end