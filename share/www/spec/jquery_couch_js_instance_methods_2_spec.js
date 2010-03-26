// Specs for jquery_couch.js lines 210-299

describe 'jQuery couchdb db'
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
  
  before_each
    db = $.couch.db('spec_db');
  end

  describe 'info'
    
  end
  
  describe 'allDocs'
    
  end
  
  describe 'allDesignDocs'
    
  end
  
  describe 'allApps'
    
  end
  
  describe 'openDoc'
    
  end
  
  describe 'saveDoc'
    
  end
  
  describe 'bulkSave'
    
  end
end